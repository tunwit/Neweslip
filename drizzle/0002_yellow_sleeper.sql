CREATE TABLE `invitations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(50) NOT NULL,
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
