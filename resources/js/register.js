document.addEventListener("DOMContentLoaded", () => {
    const errorsCard = document.getElementById("signup-failure");
    const signupButton = document.getElementById("sign-up");
    errorsCard.style.setProperty("display", "none");

    async function signUp(e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        let response = await fetch("/register", {
            method: "POST",
            body: JSON.stringify({ username: username, password: password }),
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        let signupResponse = await response.json();

        if (!response.body || (!signupResponse.ok && signupResponse.errors)) {
            const errors = document.getElementById("signup-errors");

            errors.textContent = signupResponse.errors;
            errorsCard.style.setProperty("display", "block");
        }
        else {
            errorsCard.style.setProperty("display", "none");
            let response = await fetch("/login", {
                method: "POST",
                body: JSON.stringify({ username: username, password: password }),
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            let login = await response.json();
            if (!login.ok && login.errors) {
                const errors = document.getElementById("signup-errors");

                errors.textContent = "Username taken";
                errorsCard.style.setProperty("display", "block");
            }
            else {
                window.location.href = "/home";
            }
        }
    }
    signupButton.addEventListener("click", signUp);
});