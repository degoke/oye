CREATE TABLE `explain_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`learner_id` text NOT NULL,
	`concept_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`request_id` text NOT NULL,
	`language` text NOT NULL,
	`rubric_version` text NOT NULL,
	`rubric` text NOT NULL,
	`sources` text NOT NULL,
	`explanation` text NOT NULL,
	`answers` text DEFAULT '[]' NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`status` text NOT NULL,
	`question` text,
	`evaluation` text,
	`application_answer` text,
	`application_request_id` text,
	`application_evaluation` text,
	`understanding` text DEFAULT 'unknown' NOT NULL,
	`job_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`concept_id`) REFERENCES `concepts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `explain_request_idx` ON `explain_attempts` (`learner_id`,`request_id`);--> statement-breakpoint
CREATE INDEX `explain_concept_idx` ON `explain_attempts` (`concept_id`);