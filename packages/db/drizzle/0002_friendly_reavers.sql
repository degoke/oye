CREATE TABLE `jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`learner_id` text NOT NULL,
	`journey_id` text NOT NULL,
	`concept_id` text,
	`dedupe_key` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'queued' NOT NULL,
	`input` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`available_at` integer NOT NULL,
	`message` text,
	`output_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`journey_id`) REFERENCES `journeys`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`concept_id`) REFERENCES `concepts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `jobs_dedupe_idx` ON `jobs` (`learner_id`,`dedupe_key`);--> statement-breakpoint
CREATE INDEX `jobs_pending_idx` ON `jobs` (`status`,`available_at`);--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` text PRIMARY KEY NOT NULL,
	`concept_id` text NOT NULL,
	`language` text NOT NULL,
	`reading_support` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`concept_id`) REFERENCES `concepts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lessons_version_idx` ON `lessons` (`concept_id`,`language`,`reading_support`);