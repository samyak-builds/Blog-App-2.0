const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Temporary storage
// MongoDB will be added in Module 3
const users = [];
const blogs = [];

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

        const existingUser = users.find(
            user => user.email === email.toLowerCase()
        );

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email.toLowerCase(),
            password: hashedPassword
        };

        users.push(newUser);

        res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: newUser.id,
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

        const user = users.find(
            user => user.email === email.toLowerCase()
        );

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
                id: user.id,
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

app.post("/api/blogs", (req, res) => {

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

    const newBlog = {

        id: Date.now().toString(),

        title: title,

        content: content,

        authorId: authorId,

        authorName: authorName || "Anonymous",

        createdAt: new Date().toISOString()

    };

    blogs.push(newBlog);

    res.status(201).json({

        success: true,

        message: "Blog created successfully",

        blog: newBlog

    });

});


// ================================
// GET ALL BLOGS
// ================================

app.get("/api/blogs", (req, res) => {

    res.json({

        success: true,

        blogs: blogs

    });

});


// ================================
// GET SINGLE BLOG
// ================================

app.get("/api/blogs/:id", (req, res) => {

    const blog = blogs.find(
        blog => blog.id === req.params.id
    );

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

});


// ================================
// START SERVER
// ================================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});