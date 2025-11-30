CREATE TABLE `managers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `managers_id` PRIMARY KEY(`id`),
	CONSTRAINT `managers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`language` enum('ar','en','ml','ne') NOT NULL,
	`name` varchar(255) NOT NULL,
	`company` varchar(255) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`email` varchar(320) NOT NULL,
	`rating1` int NOT NULL,
	`rating2` int NOT NULL,
	`rating3` int NOT NULL,
	`rating4` int NOT NULL,
	`rating5` int NOT NULL,
	`rating6` int NOT NULL,
	`suggestions` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `responses_id` PRIMARY KEY(`id`)
);
