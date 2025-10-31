# Backend Mini Project - User API

A simple REST API built with **Node.js**, **Express**, and **MongoDB** that performs full **CRUD operations** for user management.  
Developed as part of my backend internship task.

---

## Features

- Register new users  
- Fetch user profile  
- Update user details  
- Delete user account  

---

## Technologies Used

Node.js | Express.js | MongoDB | Mongoose | JWT | bcryptjs | dotenv | cors | nodemon

---

## API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/users/register` | Register a user |
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| DELETE | `/api/users/profile` | Delete user |

---

## Setup Instructions

1. Clone the repo  
   ```bash
   git clone https://github.com/emanqamar17/backend-mini-project.git
Install dependencies

bash
Copy code
npm install
Add .env file

ini
Copy code
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
Start the server

bash
Copy code
npm start
API runs on: http://localhost:5000

Postman Testing
All endpoints were tested successfully using Postman:

User registration

Profile retrieval

Profile update

User deletion

(Screenshots included in the screenshots/ folder)


## Author

**Eman Qamar**  
Full Stack Web Development Intern  
[GitHub Profile](https://github.com/emanqamar17)  
[Project Repository](https://github.com/emanqamar17/backend-mini-project)
