CREATE TABLE `voice_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`learner_id` text NOT NULL,
	`request_id` text NOT NULL,
	`context` text NOT NULL,
	`lesson_id` text,
	`language` text NOT NULL,
	`provider` text NOT NULL,
	`transport` text NOT NULL,
	`status` text DEFAULT 'ready' NOT NULL,
	`credential_hash` text,
	`credential_expires_at` integer,
	`expires_at` integer NOT NULL,
	`turns` integer DEFAULT 0 NOT NULL,
	`input_milliseconds` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `voice_request_idx` ON `voice_sessions` (`learner_id`,`request_id`);--> statement-breakpoint
CREATE INDEX `voice_expiry_idx` ON `voice_sessions` (`expires_at`);--> statement-breakpoint
CREATE TABLE `voice_turns` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`transcription_id` text,
	`tutor_turn_id` text,
	`recognized_text` text DEFAULT '' NOT NULL,
	`assistant_text` text DEFAULT '' NOT NULL,
	`status` text NOT NULL,
	`file_name` text,
	`duration` integer,
	`model` text,
	`review` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `voice_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`transcription_id`) REFERENCES `transcriptions`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`tutor_turn_id`) REFERENCES `tutor_turns`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `voice_turn_session_idx` ON `voice_turns` (`session_id`);