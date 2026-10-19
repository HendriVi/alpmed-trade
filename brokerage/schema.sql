-- D1 / SQLite schema. No PHI or patient data permitted.
CREATE TABLE IF NOT EXISTS buyers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contact_name TEXT NOT NULL, clinic TEXT NOT NULL, email TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Romania', category TEXT NOT NULL,
  budget_eur INTEGER NOT NULL DEFAULT 0, timeline TEXT NOT NULL DEFAULT 'unknown',
  details TEXT NOT NULL DEFAULT '', consent INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'inquiry', source TEXT NOT NULL DEFAULT 'website',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contact_name TEXT NOT NULL, company TEXT NOT NULL, email TEXT NOT NULL,
  website TEXT NOT NULL DEFAULT '', country TEXT NOT NULL DEFAULT 'Germany',
  categories TEXT NOT NULL DEFAULT '', service_notes TEXT NOT NULL DEFAULT '',
  consent INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'unverified',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL, title TEXT NOT NULL, category TEXT NOT NULL,
  asking_price_eur INTEGER NOT NULL CHECK (asking_price_eur > 0),
  country TEXT NOT NULL DEFAULT 'Germany',
  serial_ref TEXT NOT NULL DEFAULT '',
  year_made INTEGER,
  service_years_remaining INTEGER,
  stock_valid_until TEXT NOT NULL DEFAULT '',
  evidence_url TEXT NOT NULL DEFAULT '',
  condition_notes TEXT NOT NULL DEFAULT '',
  reviewed INTEGER NOT NULL DEFAULT 0,
  public INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(supplier_id) REFERENCES suppliers(id)
);
CREATE TABLE IF NOT EXISTS deals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  buyer_id INTEGER NOT NULL, listing_id INTEGER NOT NULL,
  equipment_price_eur INTEGER NOT NULL CHECK (equipment_price_eur > 0),
  fee_bps INTEGER NOT NULL CHECK (fee_bps >= 0 AND fee_bps <= 10000),
  variable_cost_eur INTEGER NOT NULL DEFAULT 0,
  reserve_eur INTEGER NOT NULL DEFAULT 0,
  expected_profit_eur INTEGER NOT NULL,
  fee_payer TEXT NOT NULL CHECK (fee_payer IN ('supplier','buyer')),
  status TEXT NOT NULL DEFAULT 'draft',
  regulatory_note TEXT NOT NULL DEFAULT '', escrow_reference TEXT NOT NULL DEFAULT '',
  tracking_reference TEXT NOT NULL DEFAULT '', acceptance_note TEXT NOT NULL DEFAULT '',
  fee_receipt_reference TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(buyer_id) REFERENCES buyers(id), FOREIGN KEY(listing_id) REFERENCES listings(id)
);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT, deal_id INTEGER NOT NULL,
  from_status TEXT NOT NULL, to_status TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(deal_id) REFERENCES deals(id)
);
CREATE TABLE IF NOT EXISTS rate_limit (
  keyed_ip TEXT NOT NULL, day TEXT NOT NULL, hits INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(keyed_ip,day)
);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category,reviewed,public);
CREATE INDEX IF NOT EXISTS idx_buyers_category ON buyers(category,status);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
