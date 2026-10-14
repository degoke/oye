CREATE TABLE `assessments` (
	`journey_id` text PRIMARY KEY NOT NULL,
	`questions` text NOT NULL,
	`answers` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`score` integer,
	`submitted_at` integer,
	FOREIGN KEY (`journey_id`) REFERENCES `journeys`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `concepts` (
	`id` text PRIMARY KEY NOT NULL,
	`journey_id` text NOT NULL,
	`title` text NOT NULL,
	`objective` text NOT NULL,
	`position` integer NOT NULL,
	`rubric` text NOT NULL,
	`understanding` text DEFAULT 'unknown' NOT NULL,
	FOREIGN KEY (`journey_id`) REFERENCES `journeys`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `concepts_journey_idx` ON `concepts` (`journey_id`);--> statement-breakpoint
CREATE TABLE `journeys` (
	`id` text PRIMARY KEY NOT NULL,
	`learner_id` text NOT NULL,
	`request_id` text NOT NULL,
	`objective` text NOT NULL,
	`title` text NOT NULL,
	`scope` text NOT NULL,
	`language` text NOT NULL,
	`mode` text NOT NULL,
	`status` text NOT NULL,
	`sources` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `journeys_owner_idx` ON `journeys` (`learner_id`);