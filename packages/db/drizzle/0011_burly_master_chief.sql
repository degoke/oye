CREATE TABLE `videos` (
	`id` text PRIMARY KEY NOT NULL,
	`learner_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`narration_id` text NOT NULL,
	`cache_key` text NOT NULL,
	`language` text NOT NULL,
	`transcript` text NOT NULL,
	`storyboard` text NOT NULL,
	`source_ids` text NOT NULL,
	`caption_timing` text NOT NULL,
	`file_name` text NOT NULL,
	`captions_file_name` text NOT NULL,
	`duration` integer NOT NULL,
	`bytes` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`narration_id`) REFERENCES `narrations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `video_cache_idx` ON `videos` (`learner_id`,`cache_key`);--> statement-breakpoint
ALTER TABLE `narrations` ADD `timings` text DEFAULT '[]' NOT NULL;