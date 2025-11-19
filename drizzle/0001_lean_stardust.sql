ALTER TABLE `ot_fields` MODIFY COLUMN `rateOfPay` decimal(10,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `penalty_fields` MODIFY COLUMN `rateOfPay` decimal(10,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `shops` ADD `work_hours_per_day` decimal(4,2) DEFAULT '8.0';--> statement-breakpoint
ALTER TABLE `shops` ADD `workdays_per_month` decimal(4,2) DEFAULT '22.0';