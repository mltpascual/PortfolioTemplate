CREATE TABLE `experiences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`role` varchar(300) NOT NULL,
	`company` varchar(300) NOT NULL,
	`period` varchar(100) NOT NULL,
	`description` text,
	`tags` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `experiences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(200) NOT NULL DEFAULT 'Alex Chen',
	`title` varchar(300) NOT NULL DEFAULT 'Full-stack Software Engineer',
	`bio` text,
	`heroTagline` varchar(500) NOT NULL DEFAULT 'Crafting digital experiences with purpose.',
	`heroSubtitle` text,
	`avatarUrl` text,
	`resumeUrl` text,
	`githubUrl` varchar(500) DEFAULT '',
	`linkedinUrl` varchar(500) DEFAULT '',
	`twitterUrl` varchar(500) DEFAULT '',
	`profileEmail` varchar(320) DEFAULT '',
	`phone` varchar(50) DEFAULT '',
	`location` varchar(200) DEFAULT '',
	`yearsExperience` varchar(20) DEFAULT '5+',
	`projectsDelivered` varchar(20) DEFAULT '30+',
	`openSourceContributions` varchar(20) DEFAULT '15+',
	`clientSatisfaction` varchar(20) DEFAULT '99%',
	`availableForWork` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profile_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(300) NOT NULL,
	`description` text,
	`imageUrl` text,
	`liveUrl` varchar(500) DEFAULT '',
	`githubUrl` varchar(500) DEFAULT '',
	`tags` text,
	`featured` int NOT NULL DEFAULT 0,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skillCategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`icon` varchar(50) NOT NULL DEFAULT 'Code2',
	`skills` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skillCategories_id` PRIMARY KEY(`id`)
);
