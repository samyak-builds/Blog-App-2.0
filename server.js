const express = require("express");
const cors = require("cors");
const app = express();

const blogRoutes = require("./routes/blogRoutes");

app.use(cors());
app.use(express.json());
app.use(express.static("./")); // server index.html, login.html,etc.

app.use("/api",blogRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server run   ning on http://localhost:${PORT}`);  
});
