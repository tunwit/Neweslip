CREATE TABLE `branches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`nameEng` varchar(50) NOT NULL,
	`address` varchar(255) NOT NULL DEFAULT '-',
	`shopId` int NOT NULL,
	CONSTRAINT `branches_id` PRIMARY KEY(`id`),
	CONSTRAINT `name_shopId` UNIQUE(`shopId`,`name`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`nickName` text NOT NULL,
	`email` text NOT NULL,
	`position` varchar(20),
	`dateOfBirth` date,
	`gender` enum('male','female','other') NOT NULL DEFAULT 'female',
	`phoneNumber` varchar(11) NOT NULL,
	`dateEmploy` date,
	`address1` varchar(255),
	`address2` varchar(255),
	`address3` varchar(255),
	`avatar` varchar(255),
	`salary` decimal(10,2) NOT NULL,
	`bankName` text,
	`bankAccountOwner` text,
	`bankAccountNumber` text,
	`promtpay` text,
	`shopId` int NOT NULL,
	`branchId` int NOT NULL,
	`status` enum('ACTIVE','INACTIVE','PARTTIME') NOT NULL DEFAULT 'ACTIVE',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shop_owner` (
	`shopId` int NOT NULL,
	`ownerId` varchar(255) NOT NULL,
	CONSTRAINT `shop_owner_shopId_ownerId_pk` PRIMARY KEY(`shopId`,`ownerId`)
);
--> statement-breakpoint
CREATE TABLE `shops` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`avatar` varchar(255),
	`taxId` varchar(13) NOT NULL DEFAULT '-',
	`work_hours_per_day` decimal(4,2) DEFAULT '8.0',
	`workdays_per_month` decimal(4,2) DEFAULT '22.0',
	`password` varchar(255) DEFAULT '$argon2id$v=19$m=65536,t=3,p=4$a5oCZIxj4yYJpanqEaaSPg$8iW06/tr7zIu3d3iP8ZbPrk4rBfTQb9Gv38/VNh+A+Y',
	`SMTPHost` varchar(50) DEFAULT 'smtp.gmail.com',
	`SMTPPort` int DEFAULT 465,
	`SMTPSecure` boolean DEFAULT true,
	`emailName` varchar(255),
	`emailAddress` varchar(255),
	`emailPassword` varchar(255),
	CONSTRAINT `shops_id` PRIMARY KEY(`id`),
	CONSTRAINT `shops_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `payroll_field_value` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payrollRecordId` int,
	`name` varchar(50) NOT NULL,
	`nameEng` varchar(50) NOT NULL,
	`type` enum('INCOME','DEDUCTION','NON_CALCULATED') NOT NULL DEFAULT 'INCOME',
	`formular` varchar(255),
	`amount` decimal(10,2) NOT NULL DEFAULT '0.00',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payroll_field_value_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payroll_periods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shopId` int NOT NULL,
	`name` varchar(50) NOT NULL,
	`start_period` date NOT NULL,
	`end_period` date NOT NULL,
	`status` enum('DRAFT','FINALIZED','PAID') NOT NULL DEFAULT 'DRAFT',
	`finalized_at` timestamp,
	`finalized_by` varchar(255),
	`edited` boolean DEFAULT false,
	`work_hours_per_day` decimal(4,2) DEFAULT '8.0',
	`workdays_per_month` decimal(4,2) DEFAULT '22.0',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payroll_periods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payroll_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payrollPeriodId` int NOT NULL,
	`employeeId` int NOT NULL,
	`salary` decimal(10,2) NOT NULL,
	`sent_mail` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payroll_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `payroll_period_employee_unique` UNIQUE(`payrollPeriodId`,`employeeId`)
);
--> statement-breakpoint
CREATE TABLE `ot_fields` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shopId` int NOT NULL,
	`name` varchar(50) NOT NULL,
	`nameEng` varchar(50) NOT NULL,
	`type` enum('CONSTANT','BASEDONSALARY') NOT NULL DEFAULT 'BASEDONSALARY',
	`method` enum('DAILY','HOURLY') NOT NULL DEFAULT 'HOURLY',
	`rate` decimal(10,2) NOT NULL,
	`rateOfPay` decimal(10,2) DEFAULT '0',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ot_fields_id` PRIMARY KEY(`id`),
	CONSTRAINT `salary_field_name_id_unique` UNIQUE(`name`,`id`)
);
--> statement-breakpoint
CREATE TABLE `ot_field_value` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payrollRecordId` int,
	`name` varchar(50) NOT NULL,
	`nameEng` varchar(50) NOT NULL,
	`type` enum('CONSTANT','BASEDONSALARY') NOT NULL DEFAULT 'BASEDONSALARY',
	`method` enum('DAILY','HOURLY') NOT NULL DEFAULT 'HOURLY',
	`rate` decimal(10,2) NOT NULL,
	`rateOfPay` decimal(10,2),
	`value` decimal(10,2) NOT NULL DEFAULT '0.00',
	`amount` decimal(10,2) NOT NULL DEFAULT '0.00',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ot_field_value_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `penalty_fields` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shopId` int NOT NULL,
	`name` varchar(50) NOT NULL,
	`nameEng` varchar(50) NOT NULL,
	`type` enum('CONSTANT','BASEDONSALARY') NOT NULL DEFAULT 'BASEDONSALARY',
	`method` enum('PERMINUTE','DAILY','HOURLY') NOT NULL DEFAULT 'HOURLY',
	`rateOfPay` decimal(10,2) DEFAULT '0',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `penalty_fields_id` PRIMARY KEY(`id`),
	CONSTRAINT `salary_field_name_id_unique` UNIQUE(`name`,`id`)
);
--> statement-breakpoint
CREATE TABLE `penalty_field_value` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payrollRecordId` int,
	`name` varchar(50) NOT NULL,
	`nameEng` varchar(50) NOT NULL,
	`type` enum('CONSTANT','BASEDONSALARY') NOT NULL DEFAULT 'BASEDONSALARY',
	`method` enum('PERMINUTE','DAILY','HOURLY') NOT NULL DEFAULT 'HOURLY',
	`rateOfPay` decimal(10,2),
	`value` decimal(10,2) NOT NULL DEFAULT '0.00',
	`amount` decimal(10,2) NOT NULL DEFAULT '0.00',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `penalty_field_value_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `salary_fields` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shopId` int NOT NULL,
	`name` varchar(50) NOT NULL,
	`nameEng` varchar(50) NOT NULL,
	`type` enum('INCOME','DEDUCTION','NON_CALCULATED') NOT NULL DEFAULT 'INCOME',
	`formular` varchar(255),
	`isActive` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
	CONSTRAINT `salary_fields_id` PRIMARY KEY(`id`),
	CONSTRAINT `salary_field_name_id_unique` UNIQUE(`name`,`id`)
);
--> statement-breakpoint
CREATE TABLE `invitations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(100) NOT NULL,
	`redirect_url` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`metadata` json,
	`status` enum('PENDING','ACCEPTED','REVOKE') DEFAULT 'PENDING',
	`accepted_at` timestamp,
	`created_by` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `invitations_id` PRIMARY KEY(`id`),
	CONSTRAINT `invitations_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `employee_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int NOT NULL,
	`key` varchar(500) NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`tag` varchar(100),
	`mime_type` varchar(100),
	`size` int,
	`uploaded_by` varchar(255),
	`metadata` json,
	`uploaded_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `employee_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shop_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shop_id` int NOT NULL,
	`key` varchar(500) NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`tag` varchar(100),
	`mime_type` varchar(100),
	`size` int,
	`uploaded_by` varchar(255),
	`metadata` json,
	`uploaded_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `shop_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `branches` ADD CONSTRAINT `branches_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_branchId_branches_id_fk` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shop_owner` ADD CONSTRAINT `shop_owner_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_field_value` ADD CONSTRAINT `payroll_field_value_payrollRecordId_payroll_records_id_fk` FOREIGN KEY (`payrollRecordId`) REFERENCES `payroll_records`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_periods` ADD CONSTRAINT `payroll_periods_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_records` ADD CONSTRAINT `payroll_records_payrollPeriodId_payroll_periods_id_fk` FOREIGN KEY (`payrollPeriodId`) REFERENCES `payroll_periods`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_records` ADD CONSTRAINT `payroll_records_employeeId_employees_id_fk` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ot_fields` ADD CONSTRAINT `ot_fields_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ot_field_value` ADD CONSTRAINT `ot_field_value_payrollRecordId_payroll_records_id_fk` FOREIGN KEY (`payrollRecordId`) REFERENCES `payroll_records`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `penalty_fields` ADD CONSTRAINT `penalty_fields_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `penalty_field_value` ADD CONSTRAINT `penalty_field_value_payrollRecordId_payroll_records_id_fk` FOREIGN KEY (`payrollRecordId`) REFERENCES `payroll_records`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `salary_fields` ADD CONSTRAINT `salary_fields_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_files` ADD CONSTRAINT `employee_files_employee_id_employees_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shop_files` ADD CONSTRAINT `shop_files_shop_id_shops_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `employees_branch_idx` ON `employees` (`branchId`);--> statement-breakpoint
CREATE INDEX `employees_shop_idx` ON `employees` (`shopId`);--> statement-breakpoint
CREATE INDEX `payroll_record_idx` ON `payroll_field_value` (`payrollRecordId`);--> statement-breakpoint
CREATE INDEX `payroll_period_idx` ON `payroll_records` (`payrollPeriodId`);--> statement-breakpoint
CREATE INDEX `payroll_record_idx` ON `ot_field_value` (`payrollRecordId`);--> statement-breakpoint
CREATE INDEX `payroll_record_idx` ON `penalty_field_value` (`payrollRecordId`);