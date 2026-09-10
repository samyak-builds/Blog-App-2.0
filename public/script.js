const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        // Check passwords
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {

            const response = await fetch("/api/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })

            });

            const data = await response.json();

            if (data.success) {

                alert("Registration successful!");

                window.location.href = "login.html";

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error(error);

            alert("Could not connect to the server.");

        }

    });

}
// =====================================
// LOGIN
// =====================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;

        try {

            const response = await fetch("/api/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })

            });

            const data = await response.json();

            if (data.success) {

                localStorage.setItem("token", data.token);

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                alert("Login successful!");

                window.location.href = "dashboard.html";

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error(error);

            alert("Could not connect to the server.");

        }

    });

}
// =====================================
// LOAD BLOGS
// =====================================

const blogContainer =
    document.getElementById("blogContainer");

async function loadBlogs() {

    if (!blogContainer) {
        return;
    }

    try {

        const response = await fetch("/api/blogs", {
    headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
});

        const data = await response.json();

        if (!data.success) {

            blogContainer.innerHTML =
                "<p>Unable to load blogs.</p>";

            return;
        }

        if (data.blogs.length === 0) {

            blogContainer.innerHTML =
                "<p>No blogs created yet.</p>";

            return;
        }

        blogContainer.innerHTML = "";

        data.blogs.forEach(function(blog) {

            const blogCard =
                document.createElement("div");

            blogCard.className = "blog-card";

            blogCard.innerHTML = `

                <h3>${blog.title}</h3>

                <p>${blog.content}</p>

                <small>
                    By ${blog.authorName}
                </small>

                <br><br>

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            `;

            // Open blog details
            blogCard.addEventListener("click", function(event) {

                if (
                    event.target.classList.contains("edit-btn") ||
                    event.target.classList.contains("delete-btn")
                ) {
                    return;
                }

                window.location.href =
                    `blog.html?id=${blog._id}`;

            });

            // Edit button
            const editButton =
                blogCard.querySelector(".edit-btn");

            editButton.addEventListener("click", function() {

                const newTitle =
                    prompt("Enter new title:", blog.title);

                if (!newTitle) {
                    return;
                }

                const newContent =
                    prompt("Enter new content:", blog.content);

                if (!newContent) {
                    return;
                }

                updateBlog(
                    blog._id,
                    newTitle,
                    newContent
                );

            });

            // Delete button
            const deleteButton =
                blogCard.querySelector(".delete-btn");

            deleteButton.addEventListener("click", function() {

                deleteBlog(blog._id);

            });

            blogContainer.appendChild(blogCard);

        });

    } catch (error) {

        console.error(error);

        blogContainer.innerHTML =
            "<p>Could not connect to the server.</p>";

    }

}


// UPDATE BLOG
// UPDATE BLOG
async function updateBlog(id, title, content) {

    try {

        const response = await fetch(`/api/blogs/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },

            body: JSON.stringify({
                title: title,
                content: content
            })

        });

        const data = await response.json();

        if (data.success) {

            alert("Blog updated successfully!");

            loadBlogs();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Could not update blog.");

    }

}


// DELETE BLOG
async function deleteBlog(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this blog?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`/api/blogs/${id}`, {

            method: "DELETE",

            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }

        });

        const data = await response.json();

        if (data.success) {

            alert("Blog deleted successfully!");

            loadBlogs();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Could not delete blog.");

    }

}

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");

const savedUser = localStorage.getItem("user");

if (savedUser) {

    const user = JSON.parse(savedUser);

    if (profileName) {
        profileName.textContent = user.name;
    }

    if (profileEmail) {
        profileEmail.textContent = user.email;
    }

}

// Load blogs
loadBlogs();


// =====================================
// LOGOUT
// =====================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function(event) {

        event.preventDefault();

        console.log("Logout clicked");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        console.log("Token after logout:", localStorage.getItem("token"));

        window.location.href = "login.html";

    });

}


// =====================================
// CREATE BLOG
// =====================================

const blogForm = document.getElementById("blogForm");

if (blogForm) {

    blogForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        // Get logged-in user
        const user = JSON.parse(
            localStorage.getItem("user")
        );


        // Check login
        if (!user) {

            alert("Please login first.");

            window.location.href = "login.html";

            return;

        }


        const title =
            document.getElementById("title").value;

        const content =
            document.getElementById("content").value;

        const statusMsg =
            document.getElementById("statusMsg");


        try {

            statusMsg.textContent =
                "Publishing blog...";


            const response = await fetch("/api/blogs", {

    method: "POST",

    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    },

    body: JSON.stringify({
        title: title,
        content: content,
        authorId: user.id,
        authorName: user.name
    })

});


            const data = await response.json();


            if (data.success) {

                statusMsg.textContent =
                    "Blog published successfully!";


                blogForm.reset();


                setTimeout(function() {

                    window.location.href =
                        "dashboard.html";

                }, 1000);


            } else {

                statusMsg.textContent =
                    data.message;

            }


        } catch (error) {

            console.error(error);

            statusMsg.textContent =
                "Could not connect to the server.";

        }

    });

}