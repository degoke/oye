CREATE TABLE `narrations` (
	`id` text PRIMARY KEY NOT NULL,
	`learner_id` text NOT NULL,
	`journey_id` text NOT NULL,
	`cache_key` text NOT NULL,
	`language` text NOT NULL,
	`transcript` text NOT NULL,
	`source_ids` text NOT NULL,
	`model` text NOT NULL,
	`voice` text NOT NULL,
	`file_name` text NOT NULL,
	`duration` integer NOT NULL,
	`bytes` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`journey_id`) REFERENCES `journeys`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `narration_cache_idx` ON `narrations` (`learner_id`,`cache_key`);--> statement-breakpoint
CREATE TABLE `transcriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`learner_id` text NOT NULL,
	`request_id` text NOT NULL,
	`context` text NOT NULL,
	`language` text NOT NULL,
	`text` text NOT NULL,
	`confirmed_text` text,
	`confirmed_at` integer,
	`duration` integer NOT NULL,
	`model` text NOT NULL,
	`used_for` text,
	`selected_option_id` text,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `transcription_request_idx` ON `transcriptions` (`learner_id`,`request_id`);