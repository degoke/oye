CREATE TABLE `practice_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`learner_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`concept_id` text NOT NULL,
	`request_id` text NOT NULL,
	`question_id` text NOT NULL,
	`option_id` text,
	`correct` integer,
	`explanation` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`concept_id`) REFERENCES `concepts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `practice_request_idx` ON `practice_attempts` (`learner_id`,`request_id`);--> statement-breakpoint
CREATE INDEX `practice_concept_idx` ON `practice_attempts` (`concept_id`);--> statement-breakpoint
ALTER TABLE `journeys` ADD `last_concept_id` text;