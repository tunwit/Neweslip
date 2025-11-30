CREATE TABLE `employee_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int NOT NULL,
	`key` varchar(500) NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`tag` varchar(100),
	`mime_type` varchar(100),
	`size` int,
	`uploaded_by` int,
	`metadata` json,
	`uploaded_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employee_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `employee_files` ADD CONSTRAINT `employee_files_employee_id_employees_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE no action;