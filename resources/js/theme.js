document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggle");
    const saved = localStorage.getItem("dark") === "true";

    if (saved) {
        document.body.classList.add("dark");
        toggle.textContent = "☀️";
    }

    toggle.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark");
        if (isDark) {
            toggle.textContent = "☀️";
        }
        else {
            toggle.textContent = "🌙";
        }

        localStorage.setItem("dark", isDark);
    });
});