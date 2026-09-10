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
const jwt = require("jsonwebtoken");

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// JWT AUTHENTICATION MIDDLEWARE
function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied. Please login."
        });
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (error, user) => {

            if (error) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid or expired token"
                });
            }

            req.user = user;

            next();
        }
    );
}

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

        const token = jwt.sign(
    {
        id: user._id,
        name: user.name,
        email: user.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);

res.json({
    success: true,
    message: "Login successful",
    token: token,
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
app.post("/api/blogs", authenticateToken, async (req, res) => {

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

// GET USER'S BLOGS
app.get("/api/blogs", authenticateToken, async (req, res) => {

    try {

        const blogs = await Blog.find({
            authorId: req.user.id
        }).sort({ createdAt: -1 });

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


// UPDATE BLOG
app.put("/api/blogs/:id", authenticateToken, async (req, res) => {

    try {

        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        const updatedBlog = await Blog.findOneAndUpdate(
            {
                _id: req.params.id,
                authorId: req.user.id
            },
            {
                title: title,
                content: content
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found or you are not the owner"
            });
        }

        res.json({
            success: true,
            message: "Blog updated successfully",
            blog: updatedBlog
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});


// DELETE BLOG
app.delete("/api/blogs/:id", authenticateToken, async (req, res) => {

    try {

        const deletedBlog = await Blog.findOneAndDelete({
            _id: req.params.id,
            authorId: req.user.id
        });

        if (!deletedBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found or you are not the owner"
            });
        }

        res.json({
            success: true,
            message: "Blog deleted successfully"
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