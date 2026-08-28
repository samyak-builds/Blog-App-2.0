const express = require ("express");
const router = express.Router();

let users = [];
let blogs = [];

router.post("/register", ( req, res) => {
     const {name, email, password } = req.body;

     if (!name || !email || !password) {
        return res.status(400). json({ message: "All fields are equired."});
     }
     users.push({name,email,password});
     res.status(201).json({message:"User registered successfully!"});
    });

    router.post("/login", (req, res) => {
        const { email,password} = req.body;
        
        const user = users.find(u=> u.email === email && u.password === password);

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password."});
        }

        res.json ({ message: "Login successful!", user: { name: user.name, email: user.email}});
    });

    router .post("/blogs", (req,res) => {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required."});
        }
        
        const newBlog = { id: blogs.length + 1, title, content};
        blogs.push(newBlog);
        res.status(201).json ({ message: "Blog published!", blog: newBlog});
    });

    router.get("/blogs", (req, res) => {
        res.json(blogs);
    });

    module.exports = router;

