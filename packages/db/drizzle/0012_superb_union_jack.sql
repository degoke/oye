CREATE TABLE `usage_reservations` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`owner_hash` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `usage_kind_time_idx` ON `usage_reservations` (`kind`,`created_at`);