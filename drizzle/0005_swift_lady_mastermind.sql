ALTER TABLE `shops` MODIFY COLUMN `SMTPHost` varchar(50) DEFAULT 'smtp.gmail.com';--> statement-breakpoint
ALTER TABLE `shops` MODIFY COLUMN `SMTPPort` int DEFAULT 465;--> statement-breakpoint
ALTER TABLE `shops` MODIFY COLUMN `SMTPSecure` boolean DEFAULT true;