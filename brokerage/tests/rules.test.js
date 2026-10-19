import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateProfit,matchingOffers,nextStatus,checkTransition} from '../src/rules.js';
test('profitable commission with costs and reserve',()=>assert.equal(calculateProfit(20000,1000,200,300),1500));
test('loss-making deals are detected',()=>assert.equal(calculateProfit(10000,300,200,200),-100));
test('zero and invalid inputs are rejected',()=>assert.throws(()=>calculateProfit(-1,500,0,0)));
test('matching only current, reviewed, within budget and category',()=>{
 const b={category:'ultrasound',budget_eur:15000};
 const o=[
  {id:1,category:'ultrasound',asking_price_eur:10000,reviewed:1,public:1,stock_valid_until:'2026-12-01'},
  {id:2,category:'ultrasound',asking_price_eur:9000,reviewed:0,public:1,stock_valid_until:'2026-12-01'},
  {id:3,category:'ultrasound',asking_price_eur:18000,reviewed:1,public:1,stock_valid_until:'2026-12-01'},
  {id:4,category:'ultrasound',asking_price_eur:8000,reviewed:1,public:1,stock_valid_until:'2025-12-01'},
  {id:5,category:'endoscopy',asking_price_eur:8000,reviewed:1,public:1,stock_valid_until:'2026-12-01'}
 ];
 assert.deepEqual(matchingOffers(b,o,'2026-10-19').map(x=>x.id),[1]);
});
test('no skipping regulatory or escrow gates',()=>{
 assert.equal(nextStatus('terms_agreed'),'regulatory_cleared');
 assert.ok(checkTransition('terms_agreed','escrow_funded','some reference'));
 assert.ok(checkTransition('terms_agreed','regulatory_cleared','short'));
 assert.equal(checkTransition('terms_agreed','regulatory_cleared','Approved by contracted authorized distributor X'),null);
});
