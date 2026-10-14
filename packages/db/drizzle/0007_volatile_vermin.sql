DROP INDEX `lessons_version_idx`;--> statement-breakpoint
ALTER TABLE `lessons` ADD `generation_version` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `lessons_version_idx` ON `lessons` (`concept_id`,`language`,`reading_support`,`generation_version`);