DROP DATABASE IF EXISTS employee_tracker;
CREATE database employee_tracker;

USE employee_tracker;

CREATE TABLE `department` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(30) NOT NULL
);


CREATE TABLE `role` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(30) NOT NULL,
  `salary` VARCHAR(45) NOT NULL,
  `department_id` INT NOT NULL
);

CREATE TABLE `employee` (
    `id` INT UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR(30) NOT NULL,
    `last_name` VARCHAR(30) NOT NULL,
    `role` INT NOT NULL,
    `manager` INT NOT NULL
);