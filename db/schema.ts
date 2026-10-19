import { sqliteTable, integer, text, primaryKey, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
export const buyers = sqliteTable("buyers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contact_name: text("contact_name").notNull(),
  clinic: text("clinic").notNull(),
  email: text("email").notNull(),
  country: text("country").notNull().default(sql`'Romania'`),
  category: text("category").notNull(),
  budget_eur: integer("budget_eur").notNull().default(sql`0`),
  timeline: text("timeline").notNull().default(sql`'unknown'`),
  details: text("details").notNull().default(sql`''`),
  consent: integer("consent").notNull().default(sql`0`),
  status: text("status").notNull().default(sql`'inquiry'`),
  source: text("source").notNull().default(sql`'website'`),
  created_at: text("created_at").notNull().default(sql`(datetime('now'))`)
});
export const suppliers = sqliteTable("suppliers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contact_name: text("contact_name").notNull(),
  company: text("company").notNull(),
  email: text("email").notNull(),
  website: text("website").notNull().default(sql`''`),
  country: text("country").notNull().default(sql`'Germany'`),
  categories: text("categories").notNull().default(sql`''`),
  service_notes: text("service_notes").notNull().default(sql`''`),
  consent: integer("consent").notNull().default(sql`0`),
  status: text("status").notNull().default(sql`'unverified'`),
  created_at: text("created_at").notNull().default(sql`(datetime('now'))`)
});
export const listings = sqliteTable("listings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  supplier_id: integer("supplier_id").notNull().references(() => suppliers.id),
  title: text("title").notNull(),
  category: text("category").notNull(),
  asking_price_eur: integer("asking_price_eur").notNull(),
  country: text("country").notNull().default(sql`'Germany'`),
  serial_ref: text("serial_ref").notNull().default(sql`''`),
  year_made: integer("year_made"),
  service_years_remaining: integer("service_years_remaining"),
  stock_valid_until: text("stock_valid_until").notNull().default(sql`''`),
  evidence_url: text("evidence_url").notNull().default(sql`''`),
  condition_notes: text("condition_notes").notNull().default(sql`''`),
  reviewed: integer("reviewed").notNull().default(sql`0`),
  public: integer("public").notNull().default(sql`0`),
  created_at: text("created_at").notNull().default(sql`(datetime('now'))`)
});
export const deals = sqliteTable("deals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  buyer_id: integer("buyer_id").notNull().references(() => buyers.id),
  listing_id: integer("listing_id").notNull().references(() => listings.id),
  equipment_price_eur: integer("equipment_price_eur").notNull(),
  fee_bps: integer("fee_bps").notNull(),
  variable_cost_eur: integer("variable_cost_eur").notNull().default(sql`0`),
  reserve_eur: integer("reserve_eur").notNull().default(sql`0`),
  expected_profit_eur: integer("expected_profit_eur").notNull(),
  fee_payer: text("fee_payer").notNull(),
  status: text("status").notNull().default(sql`'draft'`),
  regulatory_note: text("regulatory_note").notNull().default(sql`''`),
  escrow_reference: text("escrow_reference").notNull().default(sql`''`),
  tracking_reference: text("tracking_reference").notNull().default(sql`''`),
  acceptance_note: text("acceptance_note").notNull().default(sql`''`),
  fee_receipt_reference: text("fee_receipt_reference").notNull().default(sql`''`),
  created_at: text("created_at").notNull().default(sql`(datetime('now'))`),
  updated_at: text("updated_at").notNull().default(sql`(datetime('now'))`)
});
export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  deal_id: integer("deal_id").notNull().references(() => deals.id),
  from_status: text("from_status").notNull(),
  to_status: text("to_status").notNull(),
  note: text("note").notNull().default(sql`''`),
  created_at: text("created_at").notNull().default(sql`(datetime('now'))`)
});
export const rate_limit = sqliteTable("rate_limit", {
  keyed_ip: text("keyed_ip").notNull(),
  day: text("day").notNull(),
  hits: integer("hits").notNull().default(sql`0`)
}, (t) => [primaryKey({ columns: [t.keyed_ip, t.day] })]);
