CREATE TABLE `branches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`nameEng` varchar(50) NOT NULL,
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
	`salary` int NOT NULL,
	`bankName` text NOT NULL,
	`bankAccountOwner` text NOT NULL,
	`bankAccountNumber` text NOT NULL,
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
	CONSTRAINT `shops_id` PRIMARY KEY(`id`),
	CONSTRAINT `shops_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `payroll_field_value` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payrollRecordId` int,
	`salaryFieldId` int,
	`value` decimal(10,2) NOT NULL DEFAULT '0.00',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payroll_field_value_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payroll_periods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shopId` int NOT NULL,
	`name` varchar(50) NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`status` enum('DRAFT','FINALIZED','PAID') NOT NULL DEFAULT 'DRAFT',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payroll_periods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payroll_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payrollPeriodId` int NOT NULL,
	`employeeId` int NOT NULL,
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
	`rateOfPay` decimal(10,2),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ot_fields_id` PRIMARY KEY(`id`),
	CONSTRAINT `salary_field_name_id_unique` UNIQUE(`name`,`id`)
);
--> statement-breakpoint
CREATE TABLE `ot_field_value` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payrollRecordId` int,
	`otFieldId` int,
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
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `penalty_fields_id` PRIMARY KEY(`id`),
	CONSTRAINT `salary_field_name_id_unique` UNIQUE(`name`,`id`)
);
--> statement-breakpoint
CREATE TABLE `penalty_field_value` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payrollRecordId` int,
	`penaltyFieldId` int,
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
	`type` enum('INCOME','DEDUCTION') NOT NULL DEFAULT 'INCOME',
	`formular` varchar(255),
	CONSTRAINT `salary_fields_id` PRIMARY KEY(`id`),
	CONSTRAINT `salary_field_name_id_unique` UNIQUE(`name`,`id`)
);
--> statement-breakpoint
ALTER TABLE `branches` ADD CONSTRAINT `branches_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_branchId_branches_id_fk` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shop_owner` ADD CONSTRAINT `shop_owner_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_field_value` ADD CONSTRAINT `payroll_field_value_payrollRecordId_payroll_records_id_fk` FOREIGN KEY (`payrollRecordId`) REFERENCES `payroll_records`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_field_value` ADD CONSTRAINT `payroll_field_value_salaryFieldId_salary_fields_id_fk` FOREIGN KEY (`salaryFieldId`) REFERENCES `salary_fields`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_periods` ADD CONSTRAINT `payroll_periods_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_records` ADD CONSTRAINT `payroll_records_payrollPeriodId_payroll_periods_id_fk` FOREIGN KEY (`payrollPeriodId`) REFERENCES `payroll_periods`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_records` ADD CONSTRAINT `payroll_records_employeeId_employees_id_fk` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ot_fields` ADD CONSTRAINT `ot_fields_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ot_field_value` ADD CONSTRAINT `ot_field_value_payrollRecordId_payroll_records_id_fk` FOREIGN KEY (`payrollRecordId`) REFERENCES `payroll_records`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ot_field_value` ADD CONSTRAINT `ot_field_value_otFieldId_ot_fields_id_fk` FOREIGN KEY (`otFieldId`) REFERENCES `ot_fields`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `penalty_fields` ADD CONSTRAINT `penalty_fields_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `penalty_field_value` ADD CONSTRAINT `penalty_field_value_payrollRecordId_payroll_records_id_fk` FOREIGN KEY (`payrollRecordId`) REFERENCES `payroll_records`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `penalty_field_value` ADD CONSTRAINT `penalty_field_value_penaltyFieldId_penalty_fields_id_fk` FOREIGN KEY (`penaltyFieldId`) REFERENCES `penalty_fields`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `salary_fields` ADD CONSTRAINT `salary_fields_shopId_shops_id_fk` FOREIGN KEY (`shopId`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;