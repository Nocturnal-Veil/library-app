# Library Management System
React + Express + MySQL

## Setup

### 1. Database
- Open phpMyAdmin
- Click SQL tab
- Paste contents of schema.sql and click Go

### 2. Backend
```
cd backend
npm install
node index.js
```
Server runs on http://localhost:5000

### 3. Frontend
```
cd frontend
npm install
npm run dev
```
App runs on http://localhost:5173

## Modules
- Books (Add, Edit, Delete, View)
- Members (Add, Edit, Delete, View)
- Borrow Records (Borrow book, Return book, Delete record)

## Test Cases (15)
1. Add a new book with all fields
2. Add a book with only required fields (title, author)
3. Try adding a book without title - should fail
4. Edit an existing book
5. Delete a book
6. Add a new member with all fields
7. Add a member with only required fields
8. Try adding member with duplicate email - should fail
9. Edit a member
10. Delete a member
11. Borrow a book (creates record, reduces quantity)
12. Try borrowing a book with quantity 0 - should fail
13. Return a borrowed book (updates status, increases quantity)
14. Try returning an already returned book - should fail
15. Delete a borrow record
