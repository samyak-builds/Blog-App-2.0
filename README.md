📝 Full Stack Blog Application

A full-stack blog application built as an internship project using modern web development technologies. The application allows users to register, log in securely, create and manage their own blog posts, and view their personalized dashboard.

🚀 Features

- User registration and login
- Secure password hashing using bcrypt
- JWT-based authentication
- Protected dashboard and blog creation pages
- Create, read, update, and delete blog posts
- User-specific blog dashboard
- Blog ownership protection
- User profile information
- Logout functionality
- Responsive design for desktop and mobile devices
- MongoDB Atlas database integration

🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (JSON Web Token)
- bcrypt
- REST API

📂 Project Structure

Blog-App/
├── models/
│   ├── User.js
│   └── Blog.js
├── public/
│   ├── index.html
│   ├── blog.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── createblog.html
│   ├── script.js
│   └── style.css
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md

⚙️ Installation & Setup

1. Clone the repository

git clone YOUR_GITHUB_REPOSITORY_URL

2. Open the project

cd Blog-App

3. Install dependencies

npm install

4. Configure environment variables

Create a ".env" file and add:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

«Never share your ".env" file or database credentials publicly.»

5. Start the server

node server.js

The application will run at:

http://localhost:5000

🔐 Authentication

The application uses JWT authentication to protect private features. Passwords are securely hashed using bcrypt before being stored in the database.

📊 Database

The application uses MongoDB Atlas with Mongoose for database management.

The database stores:

- User information
- Blog posts
- Blog ownership information

📱 Responsive Design

The application is designed to work across:

- 💻 Desktop
- 📱 Mobile
- 📟 Tablet

🎯 Internship Modules Completed

- Module 1: Frontend Development
- Module 2: Backend Development
- Module 3: Database Integration
- Module 4: CRUD Operations
- Module 5: Authentication & Dashboard
- Module 6: Final Project & Deployment

👨‍💻 Author

Samyak Khirale

Built as part of a full-stack web development internship project.