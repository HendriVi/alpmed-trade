CREATE TABLE `buyers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contact_name` text NOT NULL,
	`clinic` text NOT NULL,
	`email` text NOT NULL,
	`country` text DEFAULT 'Romania' NOT NULL,
	`category` text NOT NULL,
	`budget_eur` integer DEFAULT 0 NOT NULL,
	`timeline` text DEFAULT 'unknown' NOT NULL,
	`details` text DEFAULT '' NOT NULL,
	`consent` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'inquiry' NOT NULL,
	`source` text DEFAULT 'website' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `deals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`buyer_id` integer NOT NULL,
	`listing_id` integer NOT NULL,
	`equipment_price_eur` integer NOT NULL,
	`fee_bps` integer NOT NULL,
	`variable_cost_eur` integer DEFAULT 0 NOT NULL,
	`reserve_eur` integer DEFAULT 0 NOT NULL,
	`expected_profit_eur` integer NOT NULL,
	`fee_payer` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`regulatory_note` text DEFAULT '' NOT NULL,
	`escrow_reference` text DEFAULT '' NOT NULL,
	`tracking_reference` text DEFAULT '' NOT NULL,
	`acceptance_note` text DEFAULT '' NOT NULL,
	`fee_receipt_reference` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`buyer_id`) REFERENCES `buyers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`deal_id` integer NOT NULL,
	`from_status` text NOT NULL,
	`to_status` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`deal_id`) REFERENCES `deals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `listings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`supplier_id` integer NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`asking_price_eur` integer NOT NULL,
	`country` text DEFAULT 'Germany' NOT NULL,
	`serial_ref` text DEFAULT '' NOT NULL,
	`year_made` integer,
	`service_years_remaining` integer,
	`stock_valid_until` text DEFAULT '' NOT NULL,
	`evidence_url` text DEFAULT '' NOT NULL,
	`condition_notes` text DEFAULT '' NOT NULL,
	`reviewed` integer DEFAULT 0 NOT NULL,
	`public` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rate_limit` (
	`keyed_ip` text NOT NULL,
	`day` text NOT NULL,
	`hits` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`keyed_ip`, `day`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contact_name` text NOT NULL,
	`company` text NOT NULL,
	`email` text NOT NULL,
	`website` text DEFAULT '' NOT NULL,
	`country` text DEFAULT 'Germany' NOT NULL,
	`categories` text DEFAULT '' NOT NULL,
	`service_notes` text DEFAULT '' NOT NULL,
	`consent` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'unverified' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
