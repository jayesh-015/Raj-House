
// Raj House - Login and Registration System

const USERS_KEY = "rajHouseUsers";
const CURRENT_USER_KEY = "rajHouseUser";

// Get registered users
function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

// Save registered users
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Registration
const registerForm = document.getElementById("register-form");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("register-name").value.trim();
        const email = document.getElementById("register-email").value.trim().toLowerCase();
        const password = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const message = document.getElementById("register-message");

        message.textContent = "";
        message.className = "auth-message";

        if (password.length < 8) {
            message.textContent = "Password must contain at least 8 characters.";
            message.classList.add("error-message");
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            message.classList.add("error-message");
            return;
        }

        const users = getUsers();

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            message.textContent = "This email is already registered. Please login.";
            message.classList.add("error-message");
            return;
        }

        const newUser = {
            name: name,
            email: email,
            password: password
        };

        users.push(newUser);
        saveUsers(users);

        message.textContent = "Account created successfully! Redirecting to login...";
        message.classList.add("success-message");

        registerForm.reset();

        setTimeout(function () {
            window.location.href = "login.html";
        }, 1500);
    });
}

// Login
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("login-email").value.trim().toLowerCase();
        const password = document.getElementById("login-password").value;
        const message = document.getElementById("login-message");

        message.textContent = "";
        message.className = "auth-message";

        const users = getUsers();

        const user = users.find(function (item) {
            return item.email === email && item.password === password;
        });

        if (!user) {
            message.textContent = "Invalid email or password. Please try again.";
            message.classList.add("error-message");
            return;
        }

        const loggedInUser = {
            name: user.name,
            email: user.email
        };

        localStorage.setItem(
            CURRENT_USER_KEY,
            JSON.stringify(loggedInUser)
        );

        message.textContent = "Login successful! Welcome, " + user.name + ".";
        message.classList.add("success-message");

        setTimeout(function () {
            window.location.href = "index.html";
        }, 1000);
    });
}

// Show or hide password
document.querySelectorAll(".password-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
        const targetId = button.getAttribute("data-target");
        const passwordInput = document.getElementById(targetId);

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            button.textContent = "Hide";
        } else {
            passwordInput.type = "password";
            button.textContent = "Show";
        }
    });
});

// Update footer year
const footerYear = document.getElementById("footer-year");

if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}

// Logout function
function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
    alert("You have been logged out successfully.");
    window.location.href = "account.html";
}
