import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import app from '../src/index.js';
function makeEnv(){
  const db=new DatabaseSync(':memory:');for(const file of fs.readdirSync(new URL('../../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort()) db.exec(fs.readFileSync(new URL('../../drizzle/'+file,import.meta.url),'utf8'));
  const DB={prepare(sql){const values=[];return {bind(...args){values.push(...args);return this;},first(){return db.prepare(sql).get(...values)??null;},all(){return {results:db.prepare(sql).all(...values)};},run(){let x=db.prepare(sql).run(...values);return {meta:{changes:Number(x.changes),last_row_id:Number(x.lastInsertRowid)}};}}}};
  DB.batch=async statements=>{db.exec('BEGIN');try{const rows=statements.map(s=>s.run());db.exec('COMMIT');return rows;}catch(e){db.exec('ROLLBACK');throw e;}};
  return {DB,OWNER_EMAIL:'owner@example.test',RATE_LIMIT_SALT:'test-only-salt',INTAKE_ENABLED:'true',ASSETS:{fetch:()=>new Response('asset')}};
}
const origin='https://medbroker.test';
const auth='Basic '+btoa('owner:secret-password-for-tests');
async function request(env,path,body,admin=true,method){
 const opt={method:method??(body===undefined?'GET':'POST'),headers:{origin,...(body===undefined?{}:{'content-type':'application/json'}),...(admin?{'oai-authenticated-user-id':'owner-test-id','oai-authenticated-user-email':'owner@example.test'}:{})}};
 if(body!==undefined)opt.body=JSON.stringify(body);
 const res=await app.fetch(new Request(origin+path,opt),env);return {status:res.status,body:await res.json()};
}
test('end-to-end two-sided marketplace funnel, checks and closed deal',async()=>{
 const env=makeEnv();
 const buyer={name:'Buyer Contact',clinic:'Demo Clinic',email:'buyer@example.com',country:'Romania',category:'ultrasound',budget_eur:30000,timeline:'1–3 months',details:'Need 4D ultrasound',consent:true};
 const supplier={name:'Sales Contact',company:'Demo Ultrasound Germany',email:'supplier@example.com',country:'Germany',site:'https://example.com',category:'ultrasound',title:'Ultrasound demo machine',asking_price_eur:18000,year_made:2023,service_years_remaining:5,stock_valid_until:'2030-12-30',evidence_url:'https://example.com/machine',consent:true};
 assert.equal((await request(env,'/api/buyer',buyer,false)).status,201);
 assert.equal((await request(env,'/api/supplier',supplier,false)).status,201);
 assert.equal((await request(env,'/api/admin/buyers',undefined,false)).status,401);
 let pub=await request(env,'/api/listings',undefined,false);assert.equal(pub.body.listings.length,0);
 assert.equal((await request(env,'/api/admin/review-listing',{id:1,publish:true})).status,400);
 assert.equal((await request(env,'/api/admin/verify-buyer',{id:1,status:'qualified'})).status,200);
 assert.equal((await request(env,'/api/admin/verify-supplier',{id:1,status:'verified'})).status,200);
 assert.equal((await request(env,'/api/admin/review-listing',{id:1,publish:true})).status,200);
 pub=await request(env,'/api/listings',undefined,false);assert.equal(pub.body.listings.length,1);
 const match=await request(env,'/api/admin/matches?buyer_id=1');assert.equal(match.body.matches.length,1);
 const deal={buyer_id:1,listing_id:1,equipment_price_eur:20000,fee_bps:1000,variable_cost_eur:250,reserve_eur:250,fee_payer:'supplier'};
 assert.equal((await request(env,'/api/admin/create-deal',{...deal,variable_cost_eur:2300})).status,400);
 const created=await request(env,'/api/admin/create-deal',deal);assert.equal(created.status,201);assert.equal(created.body.expected_profit_eur,1500);
 assert.equal((await request(env,'/api/admin/advance-deal',{id:1,note:'terms agreed'})).body.status,'terms_agreed');
 assert.equal((await request(env,'/api/admin/advance-deal',{id:1,note:'none'})).status,400);
 const stages=[['regulatory_cleared','ANMDMR pathway confirmed by authorized Romanian partner #123'],['escrow_funded','Escrow reference E-4242'],['shipped','DHL tracking X-123'],['installed','Commissioning signed by partner A on 2026-11-12'],['accepted','Signed buyer acceptance received on 2026-11-16'],['fee_received','Bank receipt B-1981'],['closed','']];
 for(const [state,note] of stages){const r=await request(env,'/api/admin/advance-deal',{id:1,note});assert.equal(r.status,200,JSON.stringify(r.body));assert.equal(r.body.status,state);}
 assert.equal((await request(env,'/api/admin/advance-deal',{id:1,note:'again'})).status,400);
 assert.equal((await request(env,'/api/admin/deals')).body.items[0].expected_profit_eur,1500);
});
test('owner secrets required before accepting public requests',async()=>{
 const env=makeEnv();delete env.OWNER_EMAIL;
 const x=await request(env,'/api/buyer',{name:'A'},false);assert.equal(x.status,503);
});
test('no cross-origin submission allowed',async()=>{
 const env=makeEnv();
 const res=await app.fetch(new Request(origin+'/api/buyer',{method:'POST',headers:{'content-type':'application/json',origin:'https://evil.site'},body:'{}'}),env);
 assert.equal(res.status,403);
});

test('public intake stays closed until explicitly enabled; owner can test',async()=>{
 const env=makeEnv();env.INTAKE_ENABLED='false';
 assert.equal((await request(env,'/api/buyer',{},false)).status,503);
 assert.equal((await request(env,'/api/buyer',{},true)).status,400);
});
test('another signed-in account cannot read customer records',async()=>{
 const env=makeEnv();const res=await app.fetch(new Request(origin+'/api/admin/buyers',{headers:{'oai-authenticated-user-id':'different','oai-authenticated-user-email':'other@example.test'}}),env);
 assert.equal(res.status,401);
});
test('validation, consent, rate limits and empty catalogue',async()=>{
 const env=makeEnv(); const b={name:'Test',clinic:'Test',email:'test@example.test',category:'ultrasound',country:'Romania',budget_eur:0,consent:true};
 assert.equal((await request(env,'/api/buyer',{...b,consent:false},false)).status,400);
 for(let i=0;i<7;i++)assert.equal((await request(env,'/api/buyer',b,false)).status,201);
 assert.equal((await request(env,'/api/buyer',b,false)).status,429);
 assert.equal((await request(env,'/api/listings',undefined,false)).body.listings.length,0);
});
