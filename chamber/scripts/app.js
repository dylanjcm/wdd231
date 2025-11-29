// js/app.js
const DATA_PATH = 'data/members.json';

// Directory page
document.addEventListener('DOMContentLoaded', () => {
    const gridBtn = document.getElementById('grid-view');
    const listBtn = document.getElementById('list-view');
    const directoryEl = document.getElementById('directory');
    const filterSelect = document.getElementById('filter-category');

    // Nav toggle for mobile
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const menuIcon = document.getElementById('menu-icon');

    menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        const newState = !expanded;

        // toggle aria
        menuToggle.setAttribute('aria-expanded', String(newState));

        // toggle nav visibility
        mainNav.classList.toggle('open');

        // 🔄 toggle icon
        menuIcon.textContent = newState ? "✖" : "☰";
    });

    // DARK MODE TOGGLE
    const darkToggle = document.getElementById("dark-toggle");
    const darkIcon = document.getElementById("dark-icon");
    const body = document.body;

    // Select all social icons once
    const socialIcons = document.querySelectorAll(".social-icon");

    // Convert icon src to dark version
    function toDark(src) {
        return src.replace(".svg", "-dark.svg");
    }

    // Convert icon src back to light version
    function toLight(src) {
        return src.replace("-dark.svg", ".svg");
    }

    // Update ALL icons based on mode
    function updateIcons() {
        // Dark mode button icon
        if (body.classList.contains("dark-mode")) {
            darkIcon.src = "images/circle-half-dark.svg";

            socialIcons.forEach(icon => {
                icon.src = toDark(icon.src);
            });

        } else {
            darkIcon.src = "images/circle-half.svg";

            socialIcons.forEach(icon => {
                icon.src = toLight(icon.src);
            });
        }
    }

    // Load saved mode on page load
    const savedMode = localStorage.getItem("dark-mode");
    if (savedMode === "enabled") {
        body.classList.add("dark-mode");
    }

    // Update icons on page load
    updateIcons();

    // Toggle dark mode event
    darkToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("dark-mode", "enabled");
        } else {
            localStorage.removeItem("dark-mode");
        }

        updateIcons();
    });

    // Fetch and render members
    async function loadMembers() {
        try {
            const res = await fetch(DATA_PATH);
            if (!res.ok) throw new Error('Failed to fetch members.json');
            const data = await res.json();
            const members = data.members || [];

            // populate category filter
            const categories = Array.from(new Set(members.map(m => m.category))).sort();
            for (const cat of categories) {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                filterSelect.appendChild(option);
            }

            // initial render
            renderMembers(members);

            // filter on change
            filterSelect.addEventListener('change', () => {
                const val = filterSelect.value;
                const filtered = val === 'all' ? members : members.filter(m => m.category === val);
                renderMembers(filtered);
            });

        } catch (err) {
            console.error(err);
            directoryEl.innerHTML = '<p>Unable to load members at this time.</p>';
        }
    }

    function membershipLabel(num) {
        switch (num) {
            case 3: return 'Gold';
            case 2: return 'Silver';
            default: return 'Member';
        }
    }

    function renderMembers(list) {
        directoryEl.innerHTML = '';
        if (!list.length) {
            directoryEl.innerHTML = '<p>No members found.</p>';
            return;
        }

        for (const m of list) {

            const article = document.createElement('article');
            article.className = 'card';

            // IMAGE OR PLACEHOLDER LOGIC
            const imageHTML = m.image && m.image.trim() !== ""
                ? `<img class="member-img" src="${m.image}" alt="${m.name} image" onerror="this.style.display='none'">`
                : `<div class="img-placeholder">Image Placeholder</div>`;

            article.innerHTML = `
            <div class="card-body">

                <!-- 1. BUSINESS NAME -->
                <h3>${m.name}</h3>

                <!-- 2. BUSINESS TAGLINE -->
                <p class="tagline">${m.tagline || m.description || "No tagline available"}</p>

                <!-- 3. IMAGE OR PLACEHOLDER -->
                <span>${imageHTML}</span>

                <!-- 4. ADDRESS -->
                <p class="address"><strong>Address:</strong> ${m.address || "Not provided"}</p>

                <!-- 5. PHONE -->
                <p class="phone"><strong>Phone:</strong> ${m.phone || "Not provided"}</p>

                <!-- 6. WEBSITE -->
                <p class="website">
                    <strong>Website:</strong> 
                    <a href="${m.website}" target="_blank" rel="noopener">
                        ${m.website}
                    </a>
                </p>

            </div>
        `;

            directoryEl.appendChild(article);
        }
    }



    // Toggle view
    gridBtn.addEventListener('click', () => {
        directoryEl.classList.remove('list-view');
        directoryEl.classList.add('grid-view');
        gridBtn.setAttribute('aria-pressed', 'true');
        listBtn.setAttribute('aria-pressed', 'false');
    });
    listBtn.addEventListener('click', () => {
        directoryEl.classList.remove('grid-view');
        directoryEl.classList.add('list-view');
        listBtn.setAttribute('aria-pressed', 'true');
        gridBtn.setAttribute('aria-pressed', 'false');
    });

    // Insert copyright year and last modified
    const cy = document.getElementById('copyright-year');
    const lm = document.getElementById('last-modified');
    if (cy) cy.textContent = new Date().getFullYear();
    if (lm) lm.textContent = document.lastModified || 'unknown';

    // Start
    loadMembers();
});


//  Home page
document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------
    // 1) EVENTS (fake example data)
    // -----------------------------
    const eventsData = [
        { title: "Business Networking Meetup", date: "March 14, 2025" },
        { title: "Tech & Innovation Expo", date: "April 2, 2025" },
        { title: "Small Business Workshop", date: "April 19, 2025" }
    ];

    const eventsContainer = document.querySelector(".events-content");
    eventsContainer.innerHTML = eventsData
        .map(event => `
            <p><strong>${event.title}</strong><br>${event.date}</p>
        `)
        .join("");
    // -----------------------------
    // REAL WEATHER USING OPENWEATHER
    // -----------------------------



    // TitleCase function for weather descriptions
    function toTitleCase(str) {
        return str
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    // Weather API
    const API_KEY = "b6cf7594d10bbf6110322d54ed6d99f1";
    const CITY_ID = "3448439"; // São Paulo

    async function loadCurrentWeather() {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?id=${CITY_ID}&appid=${API_KEY}&units=metric`;
            const res = await fetch(url);
            const data = await res.json();

            const currentEl = document.getElementById("current-weather-data");

            currentEl.innerHTML = `
                    <p><strong>${Math.round(data.main.temp)}°C</strong></p>
                    <p>${toTitleCase(data.weather[0].description)}</p>
                    <p>High: <strong>${Math.round(data.main.temp_max)}°C</strong></p>
                    <p>Low: <strong>${Math.round(data.main.temp_min)}°C</strong></p>
                    <p>Humidity: <strong>${data.main.humidity}%</strong></p>
                    <p>Wind: <strong>${data.wind.speed} m/s</strong></p>
                `;
        } catch (error) {
            console.error("Weather error:", error);
            document.getElementById("current-weather-data").innerHTML =
                "<p>Unable to load weather.</p>";
        }
    }

    async function loadForecast() {
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?id=${CITY_ID}&appid=${API_KEY}&units=metric`;
            const res = await fetch(url);
            const data = await res.json();

            const forecastEl = document.getElementById("forecast-data");
            forecastEl.innerHTML = "";

            // Choose the next 3 days at 12:00:00
            const days = data.list.filter(i => i.dt_txt.includes("12:00:00")).slice(0, 3);

            days.forEach(day => {
                const date = new Date(day.dt_txt).toLocaleDateString("en-US", {
                    weekday: "long"
                });

                forecastEl.innerHTML += `
                        <p>${date}: <strong>${Math.round(day.main.temp)}°C</strong></p>
                    `;
            });
        } catch (error) {
            console.error("Forecast error:", error);
            document.getElementById("forecast-data").innerHTML =
                "<p>Unable to load forecast.</p>";
        }
    }

    // Run weather functions
    loadCurrentWeather();
    loadForecast();
});

document.addEventListener("DOMContentLoaded", () => {
    loadSpotlights();
});

async function loadSpotlights() {
    try {
        const res = await fetch(DATA_PATH);
        const data = await res.json();
        const members = data.members || [];

        // Gold = 3, Silver = 2
        const filtered = members.filter(m => m.membership === 3 || m.membership === 2);

        // Shuffle randomly
        const shuffled = filtered.sort(() => 0.5 - Math.random());

        // Pick random 2 or 3
        const count = Math.random() < 0.5 ? 2 : 3;
        const selected = shuffled.slice(0, count);

        const container = document.getElementById("spotlight-container");

        container.innerHTML = selected.map(m => `
            <div class="spotlight-card">
                
                ${m.image && m.image !== "" 
                    ? `<img src="${m.image}" alt="${m.name} logo" class="spotlight-img">`
                    : `<div class="img-placeholder">Image Placeholder</div>`
                }

                <h3>${m.name}</h3>

                <p><strong>Address:</strong> ${m.address}</p>
                <p><strong>Phone:</strong> ${m.phone}</p>

                <p><a href="${m.website}" target="_blank">Visit Website</a></p>

                <p class="member-level">
                    <strong>${m.membership === 3 ? "Gold Member" : "Silver Member"}</strong>
                </p>
            </div>
        `).join("");
        
    } catch (err) {
        console.error("Spotlight error:", err);
    }
}

// join page

// timestamp
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("timestamp").value = new Date().toISOString();
});

// MODALS
const openLinks = document.querySelectorAll(".open-modal");
const dialogs = document.querySelectorAll("dialog");

openLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.dataset.target;
        const dlg = document.getElementById(target);
        dlg.showModal();
    });
});

// Close buttons
document.querySelectorAll(".dialog-close").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.closest("dialog").close();
    });
});

// Outside click close
dialogs.forEach(dlg => {
    dlg.addEventListener("click", (e) => {
        const rect = dlg.getBoundingClientRect();
        if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
        ) {
            dlg.close();
        }
    });
});

// Make cards animate on load
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".m-card");
    cards.forEach((card, i) => {
        setTimeout(() => card.classList.add("animated"), i * 150);
    });
});


// thankyou page
// Read GET parameters
const params = new URLSearchParams(window.location.search);

const requiredFields = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Mobile Phone" },
    { key: "organization", label: "Business / Organization" },
    { key: "timestamp", label: "Submitted On" }
];

const output = document.getElementById("confirmation-list");

// Fill the confirmation list
requiredFields.forEach(field => {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");

    dt.textContent = field.label;

    let value = params.get(field.key) || "Not provided";

    // Convert timestamp to readable format
    if (field.key === "timestamp" && value !== "Not provided") {
        try {
            value = new Date(value).toLocaleString();
        } catch(e) { /* fallback */ }
    }

    dd.textContent = value;

    output.appendChild(dt);
    output.appendChild(dd);
});


