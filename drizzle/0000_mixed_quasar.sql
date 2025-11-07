CREATE TABLE `deduction_details` (
	`id` int AUTO_INCREMENT NOT NULL,
	`field_name_th` text NOT NULL,
	`field_name_eng` text,
	`shopId` int NOT NULL,
	CONSTRAINT `deduction_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`nickName` text NOT NULL,
	`email` text NOT NULL,
	`position` varchar(20),
	`dateOfBirth` text,
	`gender` enum('male','female','other') DEFAULT 'female',
	`phoneNumber` varchar(11) NOT NULL,
	`dateEmploy` text,
	`address1` varchar(255),
	`address2` varchar(255),
	`address3` varchar(255),
	`avatar` varchar(255),
	`salary` int NOT NULL,
	`bankName` text NOT NULL,
	`bankAccountOwner` text NOT NULL,
	`bankAccountNumber` text NOT NULL,
	`promtpay` text,
	`shopId` int NOT NULL,
	`branchId` int NOT NULL,
	`status` enum('ACTIVE','INACTIVE','PARTTIME') DEFAULT 'ACTIVE',
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `branches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`shopId` int NOT NULL,
	CONSTRAINT `branches_id` PRIMARY KEY(`id`),
	CONSTRAINT `name_shopId` UNIQUE(`shopId`,`name`)
);
--> statement-breakpoint
CREATE TABLE `shops` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`avatar` varchar(255),
	CONSTRAINT `shops_id` PRIMARY KEY(`id`),
	CONSTRAINT `shops_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `shop_owner` (
	`shopId` int NOT NULL,
	`ownerId` int NOT NULL,
	CONSTRAINT `shop_owner_shopId_ownerId_pk` PRIMARY KEY(`shopId`,`ownerId`)
);
--> statement-breakpoint
CREATE TABLE `ot_details` (
	`id` int AUTO_INCREMENT NOT NULL,
	`field_name_th` text NOT NULL,
	`field_name_eng` text,
	`ot_rate` float NOT NULL,
	`method` enum('daily','hourly'),
	`type` enum('base on salary','constant'),
	`rop` int,
	`shopId` int NOT NULL,
	CONSTRAINT `ot_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `income_details` (
	`id` int AUTO_INCREMENT NOT NULL,
	`field_name_th` text NOT NULL,
	`field_name_eng` text,
	`shopId` int NOT NULL,
	CONSTRAINT `income_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `absent_details` (
	`id` int AUTO_INCREMENT NOT NULL,
	`field_name_th` text NOT NULL,
	`field_name_eng` text,
	`method` enum('per minute','daily','hourly') NOT NULL,
	`type` enum('base on salary','constant') NOT NULL,
	`rod` int,
	`shopId` int NOT NULL,
	CONSTRAINT `absent_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `owners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`avatar` varchar(255),
	CONSTRAINT `owners_id` PRIMARY KEY(`id`),
	CONSTRAINT `owners_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `deduction_details` ADD CONSTRAINT `deduction_details_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_branchId_branches_id_fk` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `branches` ADD CONSTRAINT `branches_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shop_owner` ADD CONSTRAINT `shop_owner_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shop_owner` ADD CONSTRAINT `shop_owner_ownerId_owners_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `owners`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ot_details` ADD CONSTRAINT `ot_details_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `income_details` ADD CONSTRAINT `income_details_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `absent_details` ADD CONSTRAINT `absent_details_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE no action ON UPDATE no action;