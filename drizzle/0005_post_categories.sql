ALTER TABLE `posts` ADD `categories` text NOT NULL DEFAULT '[]';
UPDATE `posts` SET `categories` = json_array(`category`);
