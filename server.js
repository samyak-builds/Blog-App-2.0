require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/User');
const Blog = require('./models/Blog');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.log('❌ Connection Error:', err.message));

const app = express();

// Rest of your code...
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Temporary storage
// MongoDB will be added in Module 3


// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Test API
app.get("/api", (req, res) => {
    res.json({
        message: "Blog App Backend is working!"
    });
});

// ================================
// REGISTER USER
// ================================

app.post("/api/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});


// ================================
// LOGIN USER
// ================================

app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});


// ================================
// CREATE BLOG
// ================================

// CREATE BLOG
app.post("/api/blogs", async (req, res) => {

    try {

        const {
            title,
            content,
            authorId,
            authorName
        } = req.body;

        if (!title || !content || !authorId) {
            return res.status(400).json({
                success: false,
                message: "Title, content and author are required"
            });
        }

        const newBlog = await Blog.create({
            title: title,
            content: content,
            authorId: authorId,
            authorName: authorName || "Anonymous"
        });

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog: newBlog
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});

// ================================
// GET ALL BLOGS
// ================================

app.get("/api/blogs", async (req, res) => {

    try {

        const blogs = await Blog.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            blogs: blogs
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});


// ================================
// GET SINGLE BLOG
// ================================
// GET SINGLE BLOG
app.get("/api/blogs/:id", async (req, res) => {

    try {

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.json({
            success: true,
            blog: blog
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});



// ================================
// START SERVER
// ================================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});