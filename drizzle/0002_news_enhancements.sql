-- Add news tracking columns to news_articles table
ALTER TABLE `news_articles` 
ADD COLUMN `rssSource` varchar(256),
ADD COLUMN `rssGuid` varchar(512) UNIQUE,
ADD COLUMN `isTranslated` boolean DEFAULT false NOT NULL,
ADD COLUMN `originalLanguage` ENUM('de', 'en', 'bg') DEFAULT 'de' NOT NULL,
ADD COLUMN `importance` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium' NOT NULL,
ADD COLUMN `pushNotificationSent` boolean DEFAULT false NOT NULL,
ADD COLUMN `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL;

-- Create news_sources table
CREATE TABLE IF NOT EXISTS `news_sources` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `slug` varchar(64) NOT NULL UNIQUE,
  `name` varchar(128) NOT NULL,
  `rssUrl` text NOT NULL,
  `category` ENUM('finance', 'legal', 'community', 'insurance', 'banking', 'utilities', 'government', 'employment', 'energy', 'transport') NOT NULL,
  `language` ENUM('de', 'en') DEFAULT 'de' NOT NULL,
  `isActive` boolean DEFAULT true NOT NULL,
  `lastFetchedAt` timestamp,
  `fetchIntervalMinutes` int DEFAULT 720 NOT NULL,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- Create index for efficient deduplication
CREATE INDEX `idx_rssGuid` ON `news_articles`(`rssGuid`);
CREATE INDEX `idx_importance` ON `news_articles`(`importance`);
CREATE INDEX `idx_featured` ON `news_articles`(`featured`);
CREATE INDEX `idx_publishedAt` ON `news_articles`(`publishedAt`);
