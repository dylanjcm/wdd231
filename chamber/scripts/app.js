// js/app.js
const DATA_PATH = 'data/members.json';

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
                <span>Image Placeholder${imageHTML}</span>

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


    // ----------------------------------
    // 2) CURRENT WEATHER (fake numbers)
    // ----------------------------------
    const currentWeather = {
        temp: "75°F",
        condition: "Partly Cloudy",
        high: "80°F",
        low: "60°F",
        humidity: "45%",
        sunrise: "6:45 AM",
        sunset: "6:10 PM"
    };

    const currentEl = document.getElementById("current-weather-data");

    currentEl.innerHTML = `
        <p><strong>⛅${currentWeather.temp}</strong></p>
        <p>${currentWeather.condition}</p>
        <p>High: <strong>${currentWeather.high}</strong></p>
        <p>Low: <strong>${currentWeather.low}</strong></p>
        <p>Humidity: <strong>${currentWeather.humidity}</strong></p>
        <p>Sunrise: <strong>${currentWeather.sunrise}</strong></p>
        <p>Sunset: <strong>${currentWeather.sunset}</strong></p>
    `;


    // ----------------------------------
    // 3) WEATHER FORECAST (fake numbers)
    // ----------------------------------
    const forecastData = [
        { day: "Today", temp: "76°F" },
        { day: "Wednesday", temp: "81°F" },
        { day: "Thursday", temp: "79°F" }
    ];

    const forecastEl = document.getElementById("forecast-data");

    forecastEl.innerHTML = forecastData
        .map(item => `<p>${item.day}: <strong>${item.temp}</strong></p>`)
        .join("");

});