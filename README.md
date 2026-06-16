# ERP Backend API

Backend API for an ERP (Enterprise Resource Planning) system built with Node.js, Express, and MongoDB. 
This project provides authentication, user management, and a scalable structure for future ERP modules such as inventory, 
finance, and sales.

## Features

- User authentication (JWT)
- User CRUD operations
- Password hashing with bcrypt
- Role-based access support (admin/user)
- Middleware-based validation
- RESTful API structure
- Centralized error handling
- Scalable modular architecture (MVC)

## Tech Stack
 
- Node.js
- Express.js 
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt.js
- dotenv

## Project Structure

```text
src/
├── config/
├── controllers/
├── database/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
└── app.js
