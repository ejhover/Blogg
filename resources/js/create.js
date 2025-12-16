document.addEventListener("DOMContentLoaded", () => {
    const errorsCard = document.getElementById("post-failure");
    const postForm = document.getElementById("post-form");
    errorsCard.style.setProperty("display", "none");

    async function create(e) {
        e.preventDefault();
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;
        let response = await fetch("/create", {
            method: "POST",
            body: JSON.stringify({ title: title, content: content }),
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        let postResponse = await response.json();
        console.log(postResponse);

        if (postResponse.status == "error") {
            const errors = document.getElementById("post-errors");

            errors.textContent = postResponse.errors;
            errorsCard.style.setProperty("display", "block");
        }
        else {
            errorsCard.style.setProperty("display", "none");
            window.location.href = "/home";
        }
    }
    postForm.addEventListener("submit", create);
});