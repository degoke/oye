CREATE TABLE `journey_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`journey_id` text NOT NULL,
	`language` text NOT NULL,
	`canonical_version` text NOT NULL,
	`content` text NOT NULL,
	`model` text NOT NULL,
	`review` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`journey_id`) REFERENCES `journeys`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `journey_language_version_idx` ON `journey_versions` (`journey_id`,`language`,`canonical_version`);