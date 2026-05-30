-- Setup script for Banking Dashboard Database
-- Run this in MySQL as root or a user with CREATE privileges

-- Create the database
CREATE DATABASE IF NOT EXISTS banking_dashboard;

-- Create the user
CREATE USER IF NOT EXISTS 'bankuser'@'localhost' IDENTIFIED BY 'bankpass123';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON banking_dashboard.* TO 'bankuser'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Use the database
USE banking_dashboard;

-- The tables will be created automatically by Hibernate when the app starts
-- (spring.jpa.hibernate.ddl-auto=update in application.properties)

