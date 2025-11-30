ALTER TABLE `shops` ADD `SMTPHost` varchar(50);--> statement-breakpoint
ALTER TABLE `shops` ADD `SMTPPort` int;--> statement-breakpoint
ALTER TABLE `shops` ADD `SMTPSecure` boolean;--> statement-breakpoint
ALTER TABLE `shops` ADD `emailName` varchar(255);--> statement-breakpoint
ALTER TABLE `shops` ADD `emailAddress` varchar(255);--> statement-breakpoint
ALTER TABLE `shops` ADD `emailPassword` varchar(255);