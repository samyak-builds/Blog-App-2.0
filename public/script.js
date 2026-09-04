// Simple validation for the Create Blog form
sonst blogForm = document.getElementById("blogForm");

if (blogForm) {
    blogForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const title = document.getElementById("title").Value.trim();
        const content = document.getElementById("content").value.trim();
        const statusMsg = document.getElementById("statusMsg");
    
        if (title === "" || content === "") {
          statusMsg.textContent = "Please fill in both field.";
          statusMsg.style.color = "red";
          return;
        }

        statusMsg.textContent ="Blog published successfully!";
        statusMsg.style.color ="green";
        blogForm.reset();
    });
}