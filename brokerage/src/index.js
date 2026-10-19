import {CATEGORIES, calculateProfit, matchingOffers, nextStatus, checkTransition} from './rules.js';
const MAX_BODY = 12000;
const RESPONSE_HEADERS = {'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'};
const send = (value,status=200) => new Response(JSON.stringify(value),{status,headers:RESPONSE_HEADERS});
const bad = (message,status=400) => send({ok:false,error:message},status);
const clean = (x, max=200) => String(x ?? '').trim().slice(0,max);
const euro = (x) => Number.isInteger(Number(x)) ? Number(x) : NaN;
const email = (x) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x) && x.length <= 180;
const url = (x) => !x || /^https:\/\/[A-Za-z0-9.-]+(?::\d+)?(?:\/[^\s]*)?$/.test(x);
async function payload(request){
  if(!request.headers.get('content-type')?.includes('application/json')) throw Error('JSON required');
  const body = await request.text();
  if(body.length > MAX_BODY) throw Error('Payload too large');
  const data = JSON.parse(body);
  if(!data || Array.isArray(data) || typeof data !== 'object') throw Error('Invalid body');
  return data;
}
function sameOrigin(request){
 const o=request.headers.get('origin');
 return !o || o === new URL(request.url).origin;
}
export function authorized(request,env){
 const id=request.headers.get('oai-authenticated-user-id');
 const email=request.headers.get('oai-authenticated-user-email');
 return Boolean(id && email && env.OWNER_EMAIL && email.toLowerCase() === env.OWNER_EMAIL.toLowerCase());
}
async function throttle(request,env){
 const ip=request.headers.get('CF-Connecting-IP')||'local';
 const today=new Date().toISOString().slice(0,10);
 const bytes=new TextEncoder().encode(today + '|' + ip + '|' + env.RATE_LIMIT_SALT);
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(x=>x.toString(16).padStart(2,'0')).join('');
 const row=await env.DB.prepare('INSERT INTO rate_limit(keyed_ip,day,hits) VALUES(?,?,1) ON CONFLICT(keyed_ip,day) DO UPDATE SET hits=hits+1 RETURNING hits').bind(hash,today).first();
 return row.hits <= 8;
}
async function buyerPost(request,env){
 const d=await payload(request);
 if(d.website) return send({ok:true,message:'Request received'}); // honeypot
 if(!await throttle(request,env)) return bad('Submission limit reached. Contact us directly.',429);
 const name=clean(d.name,100),clinic=clean(d.clinic,150),mail=clean(d.email,180);
 const category=clean(d.category,50), country=clean(d.country,80)||'Romania';
 const budget=euro(d.budget_eur);
 if(!name||!clinic||!email(mail)||!CATEGORIES.includes(category)||!Number.isInteger(budget)||budget<0||budget>100000000||d.consent!==true) return bad('Please check required fields and consent.');
 const saved=await env.DB.prepare(`INSERT INTO buyers(contact_name,clinic,email,country,category,budget_eur,timeline,details,consent)
 VALUES(?,?,?,?,?,?,?,?,1)`).bind(name,clinic,mail,country,category,budget,clean(d.timeline,80),clean(d.details,1500)).run();
 return send({ok:true,reference:'B'+saved.meta.last_row_id,message:'Request recorded. This is not a binding offer.'},201);
}
async function supplierPost(request,env){
 const d=await payload(request);
 if(d.website) return send({ok:true,message:'Information received'});
 if(!await throttle(request,env)) return bad('Submission limit reached.',429);
 const name=clean(d.name,100),company=clean(d.company,150),mail=clean(d.email,180), site=clean(d.site,255);
 const category=clean(d.category,50),title=clean(d.title,180),price=euro(d.asking_price_eur);
 const stock=clean(d.stock_valid_until,10),evidence=clean(d.evidence_url,300);
 const serviceYears=d.service_years_remaining===''||d.service_years_remaining===undefined?null:euro(d.service_years_remaining);
 const year=d.year_made===''||d.year_made===undefined?null:euro(d.year_made);
 if(!name||!company||!email(mail)||!CATEGORIES.includes(category)||!title||!Number.isInteger(price)||price<=0||price>100000000||!url(site)||!url(evidence)||d.consent!==true) return bad('Check supplier details and consent.');
 if(stock && !/^\d{4}-\d{2}-\d{2}$/.test(stock)) return bad('Stock date must be YYYY-MM-DD');
 if(year!==null && (!Number.isInteger(year)||year<1980||year>2100)) return bad('Invalid year');
 if(serviceYears!==null && (!Number.isInteger(serviceYears)||serviceYears<0||serviceYears>50)) return bad('Invalid estimated remaining service life');
 const supplierInsert=env.DB.prepare(`INSERT INTO suppliers(contact_name,company,email,website,country,categories,service_notes,consent)
 VALUES(?,?,?,?,?,?,?,1)`).bind(name,company,mail,site,clean(d.country,80)||'Germany',category,clean(d.service_notes,750));
 const listingInsert=env.DB.prepare(`INSERT INTO listings(supplier_id,title,category,asking_price_eur,country,serial_ref,year_made,service_years_remaining,stock_valid_until,evidence_url,condition_notes)
 VALUES(last_insert_rowid(),?,?,?,?,?,?,?,?,?,?)`).bind(title,category,price,clean(d.country,80)||'Germany',clean(d.serial_ref,100),year,serviceYears,stock,evidence,clean(d.condition_notes,750));
 await env.DB.batch([supplierInsert,listingInsert]);
 return send({ok:true,message:'Supplier enquiry received. Publication requires verification.'},201);
}
async function publicListings(env){
 const today=new Date().toISOString().slice(0,10);
 const {results}=await env.DB.prepare(`SELECT l.id,l.title,l.category,l.asking_price_eur,l.country,l.year_made,l.condition_notes,s.company
 FROM listings l JOIN suppliers s ON l.supplier_id=s.id WHERE l.reviewed=1 AND l.public=1 AND s.status='verified' AND l.stock_valid_until >= ?
 ORDER BY l.created_at DESC LIMIT 30`).bind(today).all();
 return send({ok:true,disclaimer:'Indicative offers; availability and legal suitability require reconfirmation.',listings:results});
}
async function adminGet(path,request,env){
 if(path==='/api/admin/summary'){
  const [buyers,suppliers,listings,deals]=await Promise.all([
   env.DB.prepare('SELECT COUNT(*) AS n FROM buyers').first(),
   env.DB.prepare('SELECT COUNT(*) AS n FROM suppliers').first(),
   env.DB.prepare('SELECT COUNT(*) AS n FROM listings WHERE reviewed=1').first(),
   env.DB.prepare("SELECT COUNT(*) AS n,COALESCE(SUM(expected_profit_eur),0) AS profit FROM deals WHERE status NOT IN ('closed','cancelled')").first()
  ]);
  return send({ok:true,counts:{buyers:buyers.n,suppliers:suppliers.n,reviewed_offers:listings.n,active_deals:deals.n,projected_profit_eur:deals.profit}});
 }
 const map={buyers:'SELECT * FROM buyers ORDER BY id DESC LIMIT 150',suppliers:'SELECT * FROM suppliers ORDER BY id DESC LIMIT 150',listings:'SELECT l.*,s.company,s.status AS supplier_status FROM listings l JOIN suppliers s ON l.supplier_id=s.id ORDER BY l.id DESC LIMIT 150',deals:'SELECT d.*,b.clinic,l.title AS equipment_title,s.company AS supplier_company FROM deals d JOIN buyers b ON d.buyer_id=b.id JOIN listings l ON d.listing_id=l.id JOIN suppliers s ON l.supplier_id=s.id ORDER BY d.id DESC LIMIT 150'};
 const key=path.split('/')[3];
 if(key in map){const {results}=await env.DB.prepare(map[key]).all();return send({ok:true,items:results});}
 if(path==='/api/admin/matches'){
  const buyerID=Number(new URL(request.url).searchParams.get('buyer_id'));
  if(!Number.isInteger(buyerID) || buyerID<1) return bad('Missing buyer id');
  const buyer=await env.DB.prepare('SELECT * FROM buyers WHERE id=?').bind(buyerID).first();
  if(!buyer || buyer.status!=='qualified') return bad('Buyer must first be qualified');
  const {results}=await env.DB.prepare(`SELECT l.*,s.company FROM listings l JOIN suppliers s ON l.supplier_id=s.id WHERE s.status='verified' AND l.category=?`).bind(buyer.category).all();
  return send({ok:true,matches:matchingOffers(buyer,results,new Date().toISOString().slice(0,10))});
 }
 return bad('Unknown endpoint',404);
}
async function adminPost(path,request,env){
 const d=await payload(request);
 if(path==='/api/admin/verify-buyer'){
  const id=euro(d.id), status=clean(d.status,30);
  if(!['qualified','rejected'].includes(status)||id<1) return bad('Invalid buyer status');
  const res=await env.DB.prepare('UPDATE buyers SET status=? WHERE id=?').bind(status,id).run();
  return res.meta.changes?send({ok:true}):bad('Buyer not found',404);
 }
 if(path==='/api/admin/verify-supplier'){
  const id=euro(d.id), status=clean(d.status,30);
  if(!['verified','rejected'].includes(status)||id<1) return bad('Invalid supplier status');
  const res=await env.DB.prepare('UPDATE suppliers SET status=? WHERE id=?').bind(status,id).run();
  return res.meta.changes?send({ok:true}):bad('Supplier not found',404);
 }
 if(path==='/api/admin/review-listing'){
  const id=euro(d.id), publish=d.publish===true;
  const listing=await env.DB.prepare('SELECT l.*,s.status AS supplier_status FROM listings l JOIN suppliers s ON s.id=l.supplier_id WHERE l.id=?').bind(id).first();
  if(!listing) return bad('Listing not found',404);
  if(publish && (listing.supplier_status!=='verified' || !listing.stock_valid_until || listing.stock_valid_until < new Date().toISOString().slice(0,10) || !listing.evidence_url || !listing.year_made || listing.service_years_remaining === null || listing.service_years_remaining < 3)) return bad('Pilot requires verified supplier, stock date, source, manufacture year, and at least 3 years documented remaining service life. Check ANMDMR requirements with the authorized Romanian party.');
  await env.DB.prepare('UPDATE listings SET reviewed=1,public=? WHERE id=?').bind(publish?1:0,id).run();
  return send({ok:true});
 }
 if(path==='/api/admin/create-deal'){
  const buyerID=euro(d.buyer_id), listingID=euro(d.listing_id), price=euro(d.equipment_price_eur), bps=euro(d.fee_bps), costs=euro(d.variable_cost_eur||0),reserve=euro(d.reserve_eur||0);
  const feePayer=clean(d.fee_payer,20);
  if(!['supplier','buyer'].includes(feePayer)) return bad('Fee payer must be designated');
  let profit;
  try{profit=calculateProfit(price,bps,costs,reserve);}catch{return bad('Invalid pricing inputs');}
  if(profit<=0) return bad('Do not open a loss-making or zero-profit deal.');
  const buyer=await env.DB.prepare('SELECT * FROM buyers WHERE id=?').bind(buyerID).first();
  const listing=await env.DB.prepare(`SELECT l.*,s.status AS supplier_status FROM listings l JOIN suppliers s ON s.id=l.supplier_id WHERE l.id=?`).bind(listingID).first();
  if(!buyer || buyer.status!=='qualified') return bad('Qualified buyer required');
  if(!listing||!listing.reviewed||!listing.public||listing.supplier_status!=='verified'||(listing.stock_valid_until && listing.stock_valid_until < new Date().toISOString().slice(0,10))) return bad('Verified current supplier offer required');
  if(!matchingOffers(buyer,[listing],new Date().toISOString().slice(0,10)).length) return bad('Offer not an eligible candidate for this buyer.');
  const res=await env.DB.prepare(`INSERT INTO deals(buyer_id,listing_id,equipment_price_eur,fee_bps,variable_cost_eur,reserve_eur,expected_profit_eur,fee_payer)
 VALUES(?,?,?,?,?,?,?,?)`).bind(buyerID,listingID,price,bps,costs,reserve,profit,feePayer).run();
  return send({ok:true,deal_id:res.meta.last_row_id,expected_profit_eur:profit},201);
 }
 if(path==='/api/admin/advance-deal'){
  const id=euro(d.id), note=clean(d.note,1500);
  const deal=await env.DB.prepare('SELECT * FROM deals WHERE id=?').bind(id).first();
  if(!deal) return bad('Deal not found',404);
  const next=nextStatus(deal.status);
  if(!next) return bad('Deal is already closed');
  const err=checkTransition(deal.status,next,note);
  if(err) return bad(err);
  const result=await env.DB.batch([
   env.DB.prepare('INSERT INTO events(deal_id,from_status,to_status,note) SELECT id,status,?,? FROM deals WHERE id=? AND status=?').bind(next,note,id,deal.status),
   env.DB.prepare("UPDATE deals SET status=?,updated_at=datetime('now') WHERE id=? AND status=?").bind(next,id,deal.status)
  ]);
  if(!result[1].meta.changes) return bad('Deal changed. Refresh and try again.',409);
  return send({ok:true,status:next});
 }
 return bad('Unknown endpoint',404);
}
export default {
 async fetch(request,env){
  const uri=new URL(request.url), path=uri.pathname;
  if(!path.startsWith('/api/')) return env.ASSETS.fetch(request);
  if(!env.DB) return bad('Database is not configured',503);
  if(request.method==='POST' && !sameOrigin(request)) return bad('Cross-origin requests not accepted',403);
  if(request.method==='POST' && (!env.OWNER_EMAIL || !env.RATE_LIMIT_SALT)) return bad('Owner access must be configured before accepting submissions.',503);
  if(['/api/buyer','/api/supplier'].includes(path) && request.method==='POST' && env.INTAKE_ENABLED !== 'true' && !authorized(request,env)) return bad('Public enquiries are not open yet.',503);
  try {
   if(path==='/api/listings' && request.method==='GET') return await publicListings(env);
   if(path==='/api/buyer' && request.method==='POST') return await buyerPost(request,env);
   if(path==='/api/supplier' && request.method==='POST') return await supplierPost(request,env);
   if(path.startsWith('/api/admin/')){
    if(!authorized(request,env)) return new Response(JSON.stringify({ok:false,error:'Owner sign-in required'}),{status:401,headers:RESPONSE_HEADERS});
    if(request.method==='GET') return await adminGet(path,request,env);
    if(request.method==='POST') return await adminPost(path,request,env);
   }
   return bad('Not found',404);
  } catch(e){
   if(e instanceof SyntaxError) return bad('Invalid JSON');
   if(['JSON required','Payload too large','Invalid body'].includes(e?.message)) return bad(e.message);
   console.error('API exception',e);
   return bad('Request could not be processed',500);
  }
 }
};
