document.addEventListener("DOMContentLoaded", () => {
    const errorsCard = document.getElementById("login-failure");
    const loginForm = document.getElementById("login");
    errorsCard.style.setProperty("display", "none");

    async function login(e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        let response = await fetch("/login", {
            method: "POST",
            body: JSON.stringify({ username: username, password: password }),
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        let loginResponse = await response.json();

        if (loginResponse.status == "error") {
            const errors = document.getElementById("login-errors");

            errors.textContent = loginResponse.errors;
            errorsCard.style.setProperty("display", "block");
        }
        else {
            errorsCard.style.setProperty("display", "none");
            window.location.href = "/home";
        }
    }
    loginForm.addEventListener("submit", login);
});