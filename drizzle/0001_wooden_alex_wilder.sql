DROP TABLE `owners`;--> statement-breakpoint
ALTER TABLE `shop_owner` DROP FOREIGN KEY `shop_owner_ownerId_owners_id_fk`;
--> statement-breakpoint
ALTER TABLE `shop_owner` MODIFY COLUMN `ownerId` varchar(255) NOT NULL;