CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`learner_id` text NOT NULL,
	`request_id` text NOT NULL,
	`concept_id` text,
	`title` text NOT NULL,
	`sources` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`concept_id`) REFERENCES `concepts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `conversation_request_idx` ON `conversations` (`learner_id`,`request_id`);--> statement-breakpoint
CREATE TABLE `tutor_turns` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`request_id` text NOT NULL,
	`user_text` text NOT NULL,
	`assistant_text` text DEFAULT '' NOT NULL,
	`language` text NOT NULL,
	`status` text NOT NULL,
	`attempts` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tutor_request_idx` ON `tutor_turns` (`conversation_id`,`request_id`);