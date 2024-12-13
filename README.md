# Book Reviews API

## Overview
The Book Reviews API provides a robust backend solution for managing users, books, and reviews. It includes authentication mechanisms using JWT and offers CRUD operations for books and reviews. The API is designed to be secure, efficient, and scalable.

---

## Features

### **User Management**
- **Register a new user**: `POST /users`
- **Login and generate JWT token**: `POST /users/login`
- **Get logged-in user data (Authenticated)**: `GET /users/me`

### **Book Management**
- **Create a new book**: `POST /books`
- **Retrieve a list of books**: `GET /books`
- **Retrieve detailed information about a specific book**: `GET /books/:id`
- **Update book details**: `PATCH /books/:id`
- **Delete a book**: `DELETE /books/:id`

### **Review Management**
- **Create a review for a specific book (Authenticated)**: `POST /books/:bookId/reviews`
- **Retrieve reviews for a specific book**: `GET /books/:bookId/reviews`
- **Update a review (Authenticated, only by the review author)**: `PATCH /reviews/:id`
- **Delete a review (Authenticated, only by the review author)**: `DELETE /reviews/:id`

---

## Technologies Used

- **Node.js**: JavaScript runtime for building scalable backend services.
- **Express.js**: Framework for building web applications.
- **MongoDB**: NoSQL database for data persistence.
- **Mongoose**: ODM for MongoDB to manage data models.
- **JSON Web Tokens (JWT)**: For authentication and authorization.
- **Swagger**: For API documentation.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/book-reviews-api.git
   ```
2. Navigate to the project directory:
   ```bash
   cd book-reviews-api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```
**Purpose:**
The JWT Secret Key is essential for generating and verifying JSON Web Tokens (JWT). It ensures the integrity and authenticity of the tokens used for authentication and authorization purposes.

**Best Practices:**

   - Use a strong, random string for the secret key.
   - Avoid hardcoding the secret key directly into the codebase or exposing it in version control systems.
   - Store the secret key securely, such as in a secrets management service or environment management solution.
   - Regularly rotate the JWT secret key to maintain security.

**Example:**
```env
JWT_SECRET=2ba0b40e3b4c4b1f8ef81d7b4b41c9eb  
```
This key is used throughout the API for signing and verifying JWT tokens.

5. Start the server:
   ```bash
   npm start
   ```
   or use this if you want to auto-reload the server at changes:
   ```bash
   npm run dev
   ```
---

## API Documentation

The API documentation is available through Swagger UI.

1. Start the server.
2. Open your browser and navigate to:
   ```
   http://localhost:5000/api-docs
   ```

---

