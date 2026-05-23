# Library Management System

# Project Description

A Library Management System built using NestJS, Prisma, PostgreSQL, and JWT Authentication.

This system allows librarians to manage books, members, rentals, and book availability.

## User Roles & Access Flow

## Librarian

The librarian is the only authenticated user in the system.

After logging in, the librarian can:

- Add new books
- Update existing books
- Delete books
- Register new members
- Manage member details
- Rent books to members
- Accept returned books
- Track rented and available books
- Maintain rental records

---

## Member Registration Process

- A member must be registered in the system before renting any book.
- Only the librarian can register/add a member.
- After successful registration, the system generates a unique Member ID.
- The generated Member ID is used for:
  - Renting books
  - Returning books
  - Tracking rental history

## Member

Members do not have login access to the application.

A member can:

- View available books
- Provide their Member ID to rent a book
- Return borrowed books using their Member ID

Members are maintained as library records managed by the librarian.

# Access Control

- Authentication and login access are available only for librarians.
- Members are not authenticated users of the system.
- A book can only be rented if:
  - The member is already registered
  - The Member ID is valid
  - The book is currently available
- A book cannot be rented by multiple members at the same time.
- Rental and return operations are fully managed by the librarian.

## Features

- librarians Authentication & Authorization
- Role Based Access ( Librarian, )
- Add / Update / Delete Books
- Manage Members
- Rent & Return Books
- Book Availability Tracking
- Swagger API Documentation
- Prisma ORM Integration
- JWT Authentication

## Tech Stack

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger
- TypeScript

# Installation & Setup

## Prerequisites

Make sure the following tools are installed on your system:

- Node.js
- npm
- PostgreSQL
- Git

## Clone Repository

````bash
git clone https://github.com/SANDEEPMALVIYA63/library-management-system.git


## Move to Project Folder

cd library-management-system


## Install Dependencies

npm install


# Environment Variables

Create a `.env` file in the root directory and add:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/library_management"
JWT_SECRET="your_jwt_secret"
PORT=9001
````

# Prisma Commands

## Run Database Migration

npx prisma migrate dev

## Generate Prisma Client

npx prisma generate

# Run Application

## Development Mode

npm run start:dev

# API Documentation

Swagger API Documentation:

```bash
http://localhost:9001/api
```

## 📚 Book Module — `/book`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/book` | Add a new book to the library | Librarian |
| GET | `/book` | Get all books with copy counts | Librarian |
| GET | `/book/:id` | Get a specific book by ID | Librarian |
| PATCH | `/book/:id` | Update book details | Librarian |
| DELETE | `/book/:id` | Delete a book from the library | Librarian |
| POST | `/book/:id` | Add more physical copies of a book | Librarian |



## 👤 Member Module — `/member`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/member` | Add a new member | Librarian |
| GET | `/member` | Get all members | Librarian |
| GET | `/member/:id` | Get a specific member by ID | Librarian |
| PATCH | `/member/:id` | Update member profile | Librarian |
| DELETE | `/member/:id` | Delete a member | Librarian |

---

## 🔄 Rental Module — `/rental`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/rental` | Rent a book to a member | Librarian |
| POST | `/rental/:id` | Return a rented book by rental ID | Librarian |
| GET | `/rental/rented-books` | Get all currently rented books | Librarian |
| GET | `/rental/available-books` | Get all currently available books | Librarian |
| GET | `/rental/book/:bookId/renter` | Get who rented a specific book | Librarian |








## Author

Sandeep Malviya

```

```
