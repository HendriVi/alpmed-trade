// Pure business rules. No AI is allowed to override these deterministic gates.
export const CATEGORIES = ['ultrasound', 'patient-monitoring', 'laboratory', 'endoscopy', 'other'];
export const DEAL_STATES = ['draft','terms_agreed','regulatory_cleared','escrow_funded','shipped','installed','accepted','fee_received','closed'];
export function calculateProfit(priceEUR, feeBps, costEUR = 0, reserveEUR = 0) {
  const vals = [priceEUR,feeBps,costEUR,reserveEUR];
  if(vals.some(x => !Number.isInteger(x) || x < 0) || priceEUR <= 0 || feeBps > 10000) throw new Error('Invalid deal economics');
  return Math.round(priceEUR * feeBps / 10000) - costEUR - reserveEUR;
}
export function matchingOffers(buyer, offers, today) {
  return offers.filter(o => {
    if(!o.reviewed || !o.public || o.category !== buyer.category) return false;
    if(o.stock_valid_until && o.stock_valid_until < today) return false;
    if(Number(buyer.budget_eur) > 0 && o.asking_price_eur > Number(buyer.budget_eur)) return false;
    return true;
  }).sort((a,b) => a.asking_price_eur - b.asking_price_eur);
}
export function nextStatus(current) {
  const i = DEAL_STATES.indexOf(current);
  return i >= 0 && i < DEAL_STATES.length - 1 ? DEAL_STATES[i+1] : null;
}
export function checkTransition(current, next, note) {
  if(next !== nextStatus(current)) return 'Deals must advance in order; no skipped gates';
  if(next === 'regulatory_cleared' && (note || '').trim().length < 15) return 'Regulatory evidence and responsible party required';
  if(next === 'escrow_funded' && (note || '').trim().length < 5) return 'Independent escrow confirmation required';
  if(next === 'shipped' && (note || '').trim().length < 5) return 'Carrier / tracking reference required';
  if(next === 'installed' && (note || '').trim().length < 10) return 'Installation and technical handover confirmation required';
  if(next === 'accepted' && (note || '').trim().length < 10) return 'Buyer acceptance proof required';
  if(next === 'fee_received' && (note || '').trim().length < 5) return 'Receipt / commission payment reference required';
  return null;
}
