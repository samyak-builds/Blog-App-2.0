const express = require("express");

const router = express.Router();


// CREATE BLOG
router.post("/blogs", (req, res) => {

    const { title, content, author } = req.body;

    // Check fields
    if (!title || !content) {
        return res.status(400).json({
            message: "Title and content are required"
        });
    }

    const blogs = req.app.locals.blogs;

    const newBlog = {
        id: blogs.length + 1,
        title,
        content,
        author: author || "Anonymous",
        createdAt: new Date()
    };

    blogs.push(newBlog);

    res.status(201).json({
        message: "Blog created successfully",
        blog: newBlog
    });
});


// GET ALL BLOGS
router.get("/blogs", (req, res) => {

    const blogs = req.app.locals.blogs;

    res.json({
        blogs: blogs
    });
});


module.exports = router;