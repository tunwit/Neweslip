ALTER TABLE `employees` MODIFY COLUMN `gender` enum('male','female','other') NOT NULL DEFAULT 'female';--> statement-breakpoint
ALTER TABLE `employees` MODIFY COLUMN `status` enum('ACTIVE','INACTIVE','PARTTIME') NOT NULL DEFAULT 'ACTIVE';--> statement-breakpoint
ALTER TABLE `employees` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;