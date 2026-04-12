-- Run this in phpMyAdmin SQL tab
CREATE DATABASE IF NOT EXISTS librarydb;
USE librarydb;

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(150) NOT NULL,
  genre VARCHAR(100),
  quantity INT DEFAULT 1,
  published_year INT
);

CREATE TABLE members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address VARCHAR(255),
  joined_date DATE DEFAULT (CURDATE())
);

CREATE TABLE borrows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  book_id INT NOT NULL,
  borrow_date DATE,
  due_date DATE,
  return_date DATE,
  status ENUM('borrowed', 'returned') DEFAULT 'borrowed',
  FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Sample data
INSERT INTO books (title, author, genre, quantity, published_year) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 3, 1925),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', 2, 1960),
('1984', 'George Orwell', 'Dystopian', 4, 1949),
('Clean Code', 'Robert C. Martin', 'Technology', 2, 2008);

INSERT INTO members (name, email, phone, address) VALUES
('Ali Khan', 'ali@example.com', '0300-1234567', 'Rawalpindi'),
('Sara Ahmed', 'sara@example.com', '0311-9876543', 'Islamabad');
