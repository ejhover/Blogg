document.addEventListener("DOMContentLoaded", () => {
    const editButton = document.getElementById("edit-button");
    const deleteButton = document.getElementById("delete-button");
    const commentButton = document.getElementById("comment-button");
    const deleteComment = document.getElementById("delete-comment");
    const errorCard = document.getElementById("admin-failure");
    const errorText = document.getElementById("admin-errors");
    errorCard.style.setProperty("display", "none");

    if (editButton) {
        editButton.addEventListener("click", () => {
            const title = document.querySelector(".post-title");
            const content = document.querySelector(".post-content p");

            const originalTitle = title.textContent;
            const originalContent = content.textContent;

            const titleInput = document.getElementById("edit-title");
            titleInput.value = originalTitle;
            const contentInput = document.getElementById("edit-content");
            contentInput.value = originalContent;

            title.style.setProperty("display", "none");
            content.style.setProperty("display", "none");
            titleInput.style.setProperty("display", "block");
            contentInput.style.setProperty("display", "block");

            const confirmButton = document.getElementById("confirm-button");
            confirmButton.style.setProperty("display", "block");

            confirmButton.addEventListener("click", () => {
                confirmEdit(titleInput.value, contentInput.value);
            });
        });
    }

    if (deleteButton) {
        deleteButton.addEventListener("click", async () => {
            const id = window.location.pathname.split("/")[2];

            const request = await fetch("/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });

            const response = await request.json();

            if (response.status == "error") {
                errorText.textContent = response.errors;
                errorCard.style.setProperty("display", "block");

                return;
            }
            else {
                window.location.href = "/home";
            }
        });
    }

    if (commentButton) {
        commentButton.addEventListener("click", () => {
            document.querySelector(".make-comment").style.setProperty("display", "flex");
            const confirmCommentButton = document.getElementById("confirm-comment");
            confirmCommentButton.style.setProperty("display", "block");
            confirmCommentButton.addEventListener("click", () => {confirmComment()});
        });
    };

    if (deleteComment) {
        deleteComment.addEventListener("click", async () => {
            const commentId = deleteComment.querySelector("#comment-id").textContent;
            const commentOwner = deleteComment.querySelector("#comment-author").textContent;
            const request = await fetch("/delete_comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: commentId, owner: commentOwner })
            });
            const response = await request.json();
            if (response.status == "error") {
                errorText.textContent = response.errors;
                errorCard.style.setProperty("display", "block");
                return;
            }
            else {
                console.log("ressponse", response);
                window.location.href = window.location.pathname;
            }
        });
    };
});

async function confirmEdit(title, content) {
    const id = window.location.pathname.split("/")[2];

    const request = await fetch("/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, title: title, content: content })
    });

    const response = await request.json();

    if (response.status == "error") {
        const errorCard = document.getElementById("admin-failure");
        const errorText = document.getElementById("admin-errors");
        errorText.textContent = response.errors;
        errorCard.style.setProperty("display", "block");
        console.log(response);

        return;
    }
    else {
        window.location.href = window.location.pathname;
    }
}

async function confirmComment() {
    const id = window.location.pathname.split("/")[2];
    const content = document.getElementById("comment-content").value;

    const response = await fetch("/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, content: content })
    });

    if (response.status === "error") {
        const errorCard = document.getElementById("admin-failure");
        const errorText = document.getElementById("admin-errors");
        errorText.textContent = response.errors;
        errorCard.style.setProperty("display", "block");

        return;
    }
    else {
        window.location.href = window.location.pathname;
    }
}