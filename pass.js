const passwordHistoryKey = "passwordHistory";
let passwordHistory = [];

// Load password history from local storage
function loadHistoryFromLocalStorage() {
    const savedHistory = localStorage.getItem(passwordHistoryKey);
    if (savedHistory) {
        passwordHistory = JSON.parse(savedHistory);
        renderHistory();
    }
}

// Save password history to local storage
function saveHistoryToLocalStorage() {
    localStorage.setItem(passwordHistoryKey, JSON.stringify(passwordHistory));
}

function renderHistory() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = ""; // Clear the list

    passwordHistory.forEach((pw) => {
        const li = document.createElement("li");
        li.classList.add("history-item");

        // Add password text
        const passwordText = document.createElement("span");
        passwordText.textContent = pw;
        passwordText.classList.add("password-text");

        // Add copy icon
        const copyIcon = document.createElement("i");
        copyIcon.className = "fa-solid fa-copy copy-icon"; // Use Font Awesome class
        copyIcon.title = "Copy to clipboard";
        copyIcon.addEventListener("click", () => {
            copyToClipboard(pw);
        });

        li.appendChild(passwordText);
        li.appendChild(copyIcon);
        historyList.appendChild(li);
    });
}


// Add a password to the history
function updateHistory(password) {
    passwordHistory.unshift(password); // Add to the start of the array
    if (passwordHistory.length > 10) {
        passwordHistory.pop(); // Remove the oldest password
    }
    renderHistory();
    saveHistoryToLocalStorage(); // Save updated history to local storage
}

// Show a toast notification
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 5000);
}

// Copy password to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => showToast("Password copied to clipboard!"))
        .catch(() => showToast("Failed to copy password."));
}

// Event listeners
document.getElementById("generateButton").addEventListener("click", function () {
    const password = generatePassword();
    document.getElementById("passwordLabel").textContent = password;
    updateHistory(password);
});

document.getElementById("copyIcon").addEventListener("click", function () {
    const currentPassword = document.getElementById("passwordLabel").textContent;
    if (currentPassword && currentPassword !== "Password") {
        copyToClipboard(currentPassword);
    } else {
        showToast("No password to copy!");
    }
});

document.getElementById("historyIcon").addEventListener("click", function () {
    const historyPanel = document.getElementById("historyPanel");
    historyPanel.classList.toggle("show"); // Toggle the panel's visibility
});

document.getElementById("closePanelButton").addEventListener("click", function () {
    const historyPanel = document.getElementById("historyPanel");
    historyPanel.classList.remove("show"); // Close the panel
});

// Generate a password
function generatePassword() {
    const vowels = "aeiouy";
    const consonants = "bcdfghjklmnpqrstvwxz";
    const specials = "!@#$%^&*()_+-=";

    const getRandom = (str) => str[Math.floor(Math.random() * str.length)];

    const password = `${getRandom(consonants).toUpperCase()}${getRandom(vowels)}${getRandom(consonants)}${getRandom(vowels)}${getRandom(consonants)}${getRandom(specials)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
    return password;
}

// Load history on page load
document.addEventListener("DOMContentLoaded", loadHistoryFromLocalStorage);
