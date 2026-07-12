CREATE TABLE IF NOT EXISTS `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('insurance','banking','utilities','telecom','other') NOT NULL,
	`provider` varchar(128) NOT NULL,
	`contractNumber` varchar(128),
	`startDate` timestamp,
	`endDate` timestamp,
	`monthlyAmount` int,
	`status` enum('active','pending','cancelled','expired') NOT NULL DEFAULT 'active',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contracts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `email_verifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`token` varchar(128) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`verifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_verifications_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_verifications_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `insurance_quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`vehicleId` int,
	`quoteType` enum('haftpflicht','teilkasko','vollkasko') NOT NULL,
	`provider` varchar(128),
	`monthlyPremium` int,
	`annualPremium` int,
	`sfKlasse` varchar(16),
	`status` enum('draft','submitted','active','cancelled') NOT NULL DEFAULT 'draft',
	`details` json,
	`idDocUrl` text,
	`idDocKey` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `insurance_quotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(64) NOT NULL,
	`lastName` varchar(64) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`city` varchar(128) NOT NULL,
	`category` enum('insurance','energy','internet','mobile','banking','tax','legal','documents','relocation','other') NOT NULL,
	`details` text,
	`budget` varchar(64),
	`urgency` enum('sofort','diese_woche','diesen_monat','kein_eile') DEFAULT 'diesen_monat',
	`hubspotContactId` varchar(64),
	`hubspotDealId` varchar(64),
	`crmSynced` boolean NOT NULL DEFAULT false,
	`crmSyncedAt` timestamp,
	`assignedPartnerId` int,
	`partnerSentAt` timestamp,
	`status` enum('new','contacted','qualified','offer_sent','negotiating','won','lost','duplicate') NOT NULL DEFAULT 'new',
	`commissionAmount` int,
	`commissionPaid` boolean DEFAULT false,
	`commissionPaidAt` timestamp,
	`gdprConsent` boolean NOT NULL DEFAULT false,
	`affiliateConsent` boolean DEFAULT false,
	`source` varchar(64) DEFAULT 'web_form',
	`utmSource` varchar(128),
	`utmMedium` varchar(128),
	`utmCampaign` varchar(128),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `news_articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`content` text,
	`category` enum('finance','legal','community','insurance','banking','utilities') NOT NULL,
	`imageUrl` text,
	`sourceUrl` text,
	`author` varchar(128),
	`publishedAt` timestamp NOT NULL DEFAULT (now()),
	`featured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `news_articles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`slug` varchar(64) NOT NULL,
	`category` enum('insurance','energy','internet','mobile','banking','tax','legal','documents','relocation','other') NOT NULL,
	`description` text,
	`logoUrl` text,
	`websiteUrl` text,
	`referralLink` text,
	`affiliateLink` text,
	`apiEndpoint` text,
	`webhookUrl` text,
	`integrationMode` enum('referral_link','affiliate','api','webhook','manual') NOT NULL DEFAULT 'manual',
	`commissionType` enum('fixed','percentage','hybrid') DEFAULT 'fixed',
	`commissionValue` int,
	`approvalStatus` enum('pending','approved','rejected','suspended') NOT NULL DEFAULT 'pending',
	`isActive` boolean NOT NULL DEFAULT false,
	`priority` int DEFAULT 0,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partners_id` PRIMARY KEY(`id`),
	CONSTRAINT `partners_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`make` varchar(64) NOT NULL,
	`model` varchar(64) NOT NULL,
	`year` int NOT NULL,
	`licensePlate` varchar(32),
	`vin` varchar(64),
	`color` varchar(32),
	`fuelType` enum('benzin','diesel','elektro','hybrid','gas') DEFAULT 'benzin',
	`annualMileage` int DEFAULT 10000,
	`parkingType` enum('garage','carport','strasse') DEFAULT 'strasse',
	`registrationDocUrl` text,
	`registrationDocKey` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `phone` varchar(32);--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `language` enum('bg','en','de') DEFAULT 'bg' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `darkMode` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `notificationsEnabled` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `city` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `country` varchar(64) DEFAULT 'DE';--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `emailVerified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `emailVerifiedAt` timestamp;--> statement-breakpoint
ALTER TABLE `leads` MODIFY COLUMN `category` enum('insurance','energy','internet','mobile','banking','tax','legal','documents','relocation','other') NOT NULL;--> statement-breakpoint
ALTER TABLE `partners` MODIFY COLUMN `category` enum('insurance','energy','internet','mobile','banking','tax','legal','documents','relocation','other') NOT NULL;