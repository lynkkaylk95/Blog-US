ALTER TABLE `posts` ADD `series_title` text;
--> statement-breakpoint
ALTER TABLE `posts` ADD `part_number` integer;
--> statement-breakpoint
CREATE INDEX `idx_posts_series_title` ON `posts` (`series_title`);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_posts_series_part` ON `posts` (`series_title`,`part_number`);
