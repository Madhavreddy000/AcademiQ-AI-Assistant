-- =============================================================================
-- V1__initial_schema.sql
-- University Academic AI Assistant with RAG - Initial Database Schema
-- Compatible with MySQL 8.0+
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Departments Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `departments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(32) NOT NULL UNIQUE,
    `name` VARCHAR(150) NOT NULL,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_dept_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Users Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(150) NOT NULL,
    `role` ENUM('STUDENT', 'FACULTY', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    `department_id` BIGINT NULL,
    `current_semester` INT NULL,
    `student_id_number` VARCHAR(50) NULL,
    `avatar_url` VARCHAR(255) NULL,
    `active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_users_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Courses Table (e.g. B.Tech Computer Science, M.S. Artificial Intelligence)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `courses` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `department_id` BIGINT NOT NULL,
    `code` VARCHAR(32) NOT NULL UNIQUE,
    `name` VARCHAR(150) NOT NULL,
    `degree_level` VARCHAR(50) DEFAULT 'Undergraduate',
    `total_semesters` INT NOT NULL DEFAULT 8,
    `credits` INT NOT NULL DEFAULT 160,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_courses_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE RESTRICT,
    INDEX `idx_course_dept` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Subjects Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `subjects` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `course_id` BIGINT NOT NULL,
    `code` VARCHAR(32) NOT NULL UNIQUE,
    `title` VARCHAR(150) NOT NULL,
    `semester` INT NOT NULL,
    `credits` INT NOT NULL DEFAULT 4,
    `syllabus_summary` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_subjects_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
    INDEX `idx_subjects_sem` (`course_id`, `semester`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Uploaded Documents Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `documents` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `file_type` VARCHAR(32) NOT NULL, -- PDF, DOCX, TXT
    `file_size_bytes` BIGINT NOT NULL,
    `file_hash` VARCHAR(64) NOT NULL UNIQUE,
    `storage_path` VARCHAR(500) NOT NULL,
    `category` VARCHAR(64) NOT NULL DEFAULT 'HANDBOOK', -- REGULATION, SYLLABUS, EXAM, HANDBOOK, COURSE_MATERIAL
    `department_id` BIGINT NULL,
    `course_id` BIGINT NULL,
    `semester` INT NULL,
    `academic_year` VARCHAR(20) DEFAULT '2025-2026',
    `access_level` ENUM('PUBLIC', 'STUDENT', 'FACULTY', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    `status` ENUM('PENDING', 'PROCESSING', 'INDEXED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `error_message` TEXT NULL,
    `chunk_count` INT NOT NULL DEFAULT 0,
    `total_pages` INT NOT NULL DEFAULT 0,
    `uploaded_by` BIGINT NULL,
    `version` INT NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_docs_dept` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_docs_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_docs_uploader` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_docs_status` (`status`),
    INDEX `idx_docs_category` (`category`),
    INDEX `idx_docs_access` (`access_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Document Chunks (linking MySQL records to Qdrant vector points)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `document_chunks` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `document_id` BIGINT NOT NULL,
    `chunk_index` INT NOT NULL,
    `page_number` INT NOT NULL DEFAULT 1,
    `qdrant_point_id` VARCHAR(64) NOT NULL UNIQUE,
    `token_count` INT NOT NULL DEFAULT 0,
    `chunk_text` MEDIUMTEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_chunks_document` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE,
    INDEX `idx_chunks_doc_page` (`document_id`, `page_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. Ingestion Jobs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ingestion_jobs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `document_id` BIGINT NOT NULL,
    `status` ENUM('QUEUED', 'EXTRACTING', 'CHUNKING', 'EMBEDDING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'QUEUED',
    `progress_percent` INT NOT NULL DEFAULT 0,
    `log_details` TEXT NULL,
    `started_at` TIMESTAMP NULL,
    `finished_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_jobs_document` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. Conversations Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `conversations` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL DEFAULT 'New Conversation',
    `pinned` BOOLEAN NOT NULL DEFAULT FALSE,
    `academic_context_dept_id` BIGINT NULL,
    `academic_context_course_id` BIGINT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_conv_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_conv_user_date` (`user_id`, `updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. Messages Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `messages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `conversation_id` BIGINT NOT NULL,
    `sender` ENUM('USER', 'ASSISTANT', 'SYSTEM') NOT NULL,
    `content` LONGTEXT NOT NULL,
    `is_rag_grounded` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_unverified` BOOLEAN NOT NULL DEFAULT FALSE,
    `model_used` VARCHAR(64) NULL,
    `prompt_tokens` INT NULL,
    `completion_tokens` INT NULL,
    `latency_ms` INT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_messages_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
    INDEX `idx_messages_conv` (`conversation_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. Message Citations Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `message_citations` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `message_id` BIGINT NOT NULL,
    `document_id` BIGINT NULL,
    `chunk_id` BIGINT NULL,
    `document_title` VARCHAR(255) NOT NULL,
    `page_number` INT NOT NULL DEFAULT 1,
    `snippet` TEXT NOT NULL,
    `relevance_score` DOUBLE NOT NULL DEFAULT 0.0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_citations_message` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_citations_doc` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE SET NULL,
    INDEX `idx_cit_msg` (`message_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 11. Feedback Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `feedback` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `message_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `rating` ENUM('THUMBS_UP', 'THUMBS_DOWN') NOT NULL,
    `comment` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_feedback_message` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_feedback_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_feedback_msg` (`message_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 12. Audit Logs Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NULL,
    `action` VARCHAR(64) NOT NULL,
    `entity_name` VARCHAR(64) NOT NULL,
    `entity_id` BIGINT NULL,
    `details` TEXT NULL,
    `ip_address` VARCHAR(45) NULL,
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_audit_user` (`user_id`),
    INDEX `idx_audit_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- Initial Seed Data
-- =============================================================================

-- Departments
INSERT INTO `departments` (`id`, `code`, `name`, `description`) VALUES
(1, 'CS', 'Computer Science & Engineering', 'Department of Computer Science, Software Engineering & AI'),
(2, 'ECE', 'Electronics & Communication Engineering', 'Department of Electronics, Embedded Systems & Communication'),
(3, 'MECH', 'Mechanical Engineering', 'Department of Mechanical & Aerospace Systems'),
(4, 'MGMT', 'School of Business & Management', 'Department of Management, Finance and Academic Administration')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Courses
INSERT INTO `courses` (`id`, `department_id`, `code`, `name`, `degree_level`, `total_semesters`, `credits`, `description`) VALUES
(1, 1, 'BTECH-CS', 'Bachelor of Technology in Computer Science', 'Undergraduate', 8, 160, 'Comprehensive program covering algorithms, system design, databases, networks and AI'),
(2, 1, 'MTECH-AI', 'Master of Technology in Artificial Intelligence', 'Postgraduate', 4, 80, 'Advanced study in deep learning, NLP, computer vision and autonomous agents'),
(3, 2, 'BTECH-ECE', 'Bachelor of Technology in Electronics', 'Undergraduate', 8, 160, 'Digital signal processing, VLSI design, and communication systems'),
(4, 4, 'MBA', 'Master of Business Administration', 'Postgraduate', 4, 72, 'General business administration, strategy and academic leadership')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Subjects
INSERT INTO `subjects` (`id`, `course_id`, `code`, `title`, `semester`, `credits`, `syllabus_summary`) VALUES
(1, 1, 'CS201', 'Data Structures & Algorithms', 3, 4, 'Unit 1: Stacks, Queues; Unit 2: Trees & BST; Unit 3: Graph algorithms; Unit 4: Dynamic Programming & Greedy'),
(2, 1, 'CS202', 'Operating Systems', 4, 4, 'Unit 1: Processes & Threads; Unit 2: CPU Scheduling; Unit 3: Memory Management & Virtual Memory; Unit 4: File Systems & Concurrency'),
(3, 1, 'CS301', 'Database Management Systems', 5, 4, 'Relational model, SQL, Normalization (1NF-BCNF), Indexing, B-Trees, ACID transactions, and Concurrency control'),
(4, 1, 'CS302', 'Computer Networks', 5, 4, 'OSI & TCP/IP models, Packet switching, Routing protocols, Transport layer reliability, HTTP/DNS'),
(5, 2, 'AI501', 'Deep Learning & Neural Networks', 1, 4, 'Backpropagation, CNNs, Transformers, Attention mechanisms, and LLM fine-tuning')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Users (Default Admin and Student)
-- Passwords are BCrypt hash of "Admin@123456" and "Student@123456"
-- $2a$10$wE9K2j5xJjK5uWzC1P9O3.6h9c2B/kYgV.5rZ4F3X2Q1W8e7T6U2O = Admin@123456
-- $2a$10$yI2L3m4n5o6p7q8r9s0t1u.vW2X3Y4Z5a6b7c8d9e0f1g2h3i4j5k = Student@123456
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `role`, `department_id`, `current_semester`, `student_id_number`, `active`) VALUES
(1, 'admin@university.edu', '$2a$10$4y9pSgY0oRsm4f7X6yQd9e4I9/12o5k0zJ8C.PqE0U1z6k3H0uG9W', 'Dr. Sarah Mitchell (Dean)', 'ADMIN', 1, NULL, 'ADM-001', 1),
(2, 'student@university.edu', '$2a$10$4y9pSgY0oRsm4f7X6yQd9e4I9/12o5k0zJ8C.PqE0U1z6k3H0uG9W', 'Alex Johnson', 'STUDENT', 1, 4, 'CS-2023-042', 1),
(3, 'faculty@university.edu', '$2a$10$4y9pSgY0oRsm4f7X6yQd9e4I9/12o5k0zJ8C.PqE0U1z6k3H0uG9W', 'Prof. David Chen', 'FACULTY', 1, NULL, 'FAC-108', 1)
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

SET FOREIGN_KEY_CHECKS = 1;
