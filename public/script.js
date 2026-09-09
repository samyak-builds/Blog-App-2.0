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

                alert("Login successful!");

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

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

        const response = await fetch("/api/blogs");

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

            `;


            blogContainer.appendChild(blogCard);

        });

    } catch (error) {

        console.error(error);

        blogContainer.innerHTML =
            "<p>Could not connect to the server.</p>";

    }

}


// Load blogs
loadBlogs();


// =====================================
// LOGOUT
// =====================================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function(event) {

        event.preventDefault();

        localStorage.removeItem("user");

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

                    "Content-Type": "application/json"

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