const $=sel=>document.querySelector(sel),$$=sel=>Array.from(document.querySelectorAll(sel));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur=n=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n||0);
let buyers=[],suppliers=[],listings=[],deals=[];
async function api(path,data){
 const r=await fetch('/api/admin/'+path,{method:data?'POST':'GET',headers:{...(data?{'content-type':'application/json'}:{})},...(data?{body:JSON.stringify(data)}:{})});
 const j=await r.json();if(!r.ok) throw Error(j.error||'Request failed');return j;
}
function say(s,err=false){const x=$('#opMessage');x.textContent=s;x.className=err?'message error':'message';}
async function task(label,fn){try{say(label+'…');await fn();await refresh();say('Saved.');}catch(e){say(e.message,true);}}
const card=s=>`<article class="card compact">${s}</article>`;
async function refresh(){
 const [stats,b,s,l,d]=await Promise.all([api('summary'),api('buyers'),api('suppliers'),api('listings'),api('deals')]);
 buyers=b.items;suppliers=s.items;listings=l.items;deals=d.items;
 const n=stats.counts;
 $('#kpis').innerHTML=[['Buyer enquiries',n.buyers],['Suppliers',n.suppliers],['Reviewed offers',n.reviewed_offers],['Open deals',n.active_deals],['Projected open-deal profit',eur(n.projected_profit_eur)]].map(([name,val])=>card(`<div class="muted mini">${esc(name)}</div><div class="kpi">${esc(val)}</div>`)).join('');
 renderBuyers();renderSuppliers();renderListings();renderDeals();
}
function renderBuyers(){
 $('#buyers').innerHTML=buyers.length?buyers.map(b=>card(`<div class="row"><h3>${esc(b.clinic)} <span class="pill">${esc(b.status)}</span></h3><span class="tag">#B${b.id}</span></div>
 <p><strong>${esc(b.category)}</strong> · Budget ${eur(b.budget_eur)} · ${esc(b.timeline)} · ${esc(b.country)}</p><p>${esc(b.details)}</p><p class="mini">${esc(b.contact_name)} · <a href="mailto:${encodeURIComponent(b.email)}">${esc(b.email)}</a> · ${esc(b.created_at)}</p>
 <div class="cta"><button class="smallbtn" data-action="qualify-buyer" data-id="${b.id}">Qualify</button><button class="secondary smallbtn" data-action="reject-buyer" data-id="${b.id}">Reject</button><button class="secondary smallbtn" data-action="matches" data-id="${b.id}">Find matches</button></div><div id="matches-${b.id}"></div>`)).join(''):card('No buyer enquiries yet.');
}
function renderSuppliers(){
 $('#suppliers').innerHTML=suppliers.length?suppliers.map(s=>card(`<div class="row"><h3>${esc(s.company)} <span class="pill">${esc(s.status)}</span></h3><span class="tag">#S${s.id}</span></div>
 <p>${esc(s.categories)} · ${esc(s.country)} · ${esc(s.service_notes)}</p><p class="mini">${esc(s.contact_name)} · <a href="mailto:${encodeURIComponent(s.email)}">${esc(s.email)}</a> · ${s.website?`<a href="${esc(s.website)}" target="_blank" rel="noopener noreferrer">Website</a>`:''}</p>
 <div class="cta"><button class="smallbtn" data-action="verify-supplier" data-id="${s.id}">Mark verified</button><button class="secondary smallbtn" data-action="reject-supplier" data-id="${s.id}">Reject</button></div>`)).join(''):card('No supplier submissions yet.');
}
function renderListings(){
 $('#listings').innerHTML=listings.length?listings.map(l=>card(`<div class="row"><h3>${esc(l.title)}</h3><span class="tag">#L${l.id}</span></div>
 <p>${esc(l.company)} · ${esc(l.category)} · ${eur(l.asking_price_eur)} · Supplier ${esc(l.supplier_status)}</p>
 <p class="mini">Year ${esc(l.year_made||'unknown')} · Remaining life ${esc(l.service_years_remaining??'unknown')} years · Stock check expires ${esc(l.stock_valid_until||'not provided')} · ${l.evidence_url?`<a href="${esc(l.evidence_url)}" target="_blank" rel="noopener noreferrer">Evidence link</a>`:'no source link'}</p>
 <p class="mini">${esc(l.condition_notes)} · ${l.public?'Published':'Not published'}</p>
 <div class="cta"><button class="smallbtn" data-action="publish-offer" data-id="${l.id}">Verify & publish</button><button class="secondary smallbtn" data-action="hide-offer" data-id="${l.id}">Remove from public site</button></div>`)).join(''):card('No supplier offers yet.');
}
const STATES=['draft','terms_agreed','regulatory_cleared','escrow_funded','shipped','installed','accepted','fee_received','closed'];
function renderDeals(){
 $('#deals').innerHTML=deals.length?deals.map(d=>{
 const idx=STATES.indexOf(d.status),next=idx>=0?STATES[idx+1]:null;
 return card(`<div class="row"><h3>Deal #D${d.id} <span class="pill">${esc(d.status)}</span></h3><strong>${eur(d.expected_profit_eur)} projected</strong></div>
 <p>${esc(d.clinic)} ↔ ${esc(d.supplier_company)}: ${esc(d.equipment_title)}</p>
 <p class="mini">Purchase price ${eur(d.equipment_price_eur)} · Commission ${(d.fee_bps/100).toFixed(2)}% (${esc(d.fee_payer)} pays) · Costs ${eur(d.variable_cost_eur)} · Reserve ${eur(d.reserve_eur)}</p>
 ${next?`<div class="stack"><label>Next gate: ${esc(next.replaceAll('_',' '))}</label><textarea id="note-${d.id}" placeholder="Enter a real reference or documented verification. Required at regulatory, escrow, shipping, installation, acceptance and commission gates."></textarea><button class="smallbtn" data-action="advance" data-id="${d.id}">Confirm ${esc(next.replaceAll('_',' '))}</button></div>`:'<span class="tag">Completed</span>'}`);
 }).join(''):card('No active deals. Qualify a buyer, verify a supplier and publish one offer to create a match.');
}
async function showMatches(id){
 const j=await api('matches?buyer_id='+id); const dest=$('#matches-'+id);
 dest.innerHTML=j.matches.length?j.matches.map(l=>`<div class="card" style="margin-top:10px"><p><strong>${esc(l.title)}</strong> · ${eur(l.asking_price_eur)} · ${esc(l.company)}</p>
 <form class="dealForm" data-buyer="${id}" data-listing="${l.id}"><div><label>Equipment price EUR</label><input name="equipment_price_eur" type="number" min="1" value="${l.asking_price_eur}" required></div>
 <div><label>Commission %</label><input name="fee_percent" type="number" min="0" max="100" step="0.1" placeholder="Agreed fee" required></div><div><label>Your operating costs EUR</label><input name="variable_cost_eur" type="number" value="0" min="0"></div>
 <div><label>Risk reserve EUR</label><input name="reserve_eur" type="number" value="0" min="0"></div>
 <div><label>Who pays brokerage commission?</label><select name="fee_payer"><option value="supplier">Supplier</option><option value="buyer">Buyer</option></select></div>
 <div class="full"><button class="smallbtn">Create positive-margin deal</button></div></form></div>`).join(''):card('No current, verified offers fit this qualified buyer. Continue supplier sourcing.');
}
refresh().catch(err=>say(err.message,true));
$('#refresh').addEventListener('click',()=>task('Refreshing',async()=>{}));
$$('[data-tab]').forEach(b=>b.addEventListener('click',()=>{
 $$('[data-tab]').forEach(el=>el.classList.toggle('active',el===b));
 for(const t of ['buyers','suppliers','listings','deals'])$('#'+t).classList.toggle('hidden',b.dataset.tab!==t);
}));
document.addEventListener('click',e=>{
 const btn=e.target.closest('[data-action]');if(!btn)return;
 const id=Number(btn.dataset.id),a=btn.dataset.action;
 if(a==='matches'){say('Finding matches…');showMatches(id).then(()=>say('Matching candidates shown below.')).catch(err=>say(err.message,true));return;}
 if(a==='qualify-buyer'||a==='reject-buyer')return task('Updating buyer',()=>api('verify-buyer',{id,status:a==='qualify-buyer'?'qualified':'rejected'}));
 if(a==='verify-supplier'||a==='reject-supplier')return task('Updating supplier',()=>api('verify-supplier',{id,status:a==='verify-supplier'?'verified':'rejected'}));
 if(a==='publish-offer'||a==='hide-offer')return task('Reviewing offer',()=>api('review-listing',{id,publish:a==='publish-offer'}));
 if(a==='advance'){const note=$('#note-'+id)?.value||'';return task('Advancing deal',()=>api('advance-deal',{id,note}));}
});
document.addEventListener('submit',e=>{
 if(!e.target.classList.contains('dealForm'))return;
 e.preventDefault();const f=e.target,fd=new FormData(f);
 const data={buyer_id:Number(f.dataset.buyer),listing_id:Number(f.dataset.listing),equipment_price_eur:Number(fd.get('equipment_price_eur')),fee_bps:Math.round(Number(fd.get('fee_percent'))*100),variable_cost_eur:Number(fd.get('variable_cost_eur')),reserve_eur:Number(fd.get('reserve_eur')),fee_payer:fd.get('fee_payer')};
 task('Creating deal',()=>api('create-deal',data));
});
