// js/app.js
const DATA_PATH = 'data/members.json';

// =========================================================
// GLOBAL CODE (runs on ALL pages)
// =========================================================

// Insert copyright year and last modified on ALL pages
document.addEventListener("DOMContentLoaded", () => {
    const cy = document.getElementById('copyright-year');
    const lm = document.getElementById('last-modified');
    if (cy) cy.textContent = new Date().getFullYear();
    if (lm) lm.textContent = document.lastModified || 'unknown';
});

// MOBILE NAV + DARK MODE must run on ALL pages
document.addEventListener('DOMContentLoaded', () => {

    // Nav toggle for mobile
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const menuIcon = document.getElementById('menu-icon');

    if (menuToggle && mainNav && menuIcon) {
        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            const newState = !expanded;
            menuToggle.setAttribute('aria-expanded', String(newState));
            mainNav.classList.toggle('open');
            menuIcon.textContent = newState ? "✖" : "☰";
        });
    }

    // DARK MODE
    const darkToggle = document.getElementById("dark-toggle");
    const darkIcon = document.getElementById("dark-icon");
    const body = document.body;
    const socialIcons = document.querySelectorAll(".social-icon");

    function toDark(src) { return src.replace(".svg", "-dark.svg"); }
    function toLight(src) { return src.replace("-dark.svg", ".svg"); }

    function updateIcons() {
        if (body.classList.contains("dark-mode")) {
            if (darkIcon) darkIcon.src = "images/circle-half-dark.svg";
            socialIcons.forEach(icon => icon.src = toDark(icon.src));
        } else {
            if (darkIcon) darkIcon.src = "images/circle-half.svg";
            socialIcons.forEach(icon => icon.src = toLight(icon.src));
        }
    }

    const savedMode = localStorage.getItem("dark-mode");
    if (savedMode === "enabled") body.classList.add("dark-mode");
    updateIcons();

    if (darkToggle) {
        darkToggle.addEventListener("click", () => {
            body.classList.toggle("dark-mode");
            if (body.classList.contains("dark-mode")) {
                localStorage.setItem("dark-mode", "enabled");
            } else {
                localStorage.removeItem("dark-mode");
            }
            updateIcons();
        });
    }
});


// =========================================================
// DIRECTORY PAGE — only runs if #directory exists
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    const directoryEl = document.getElementById('directory');
    if (!directoryEl) return; // ⛔ skip if not on directory page

    const gridBtn = document.getElementById('grid-view');
    const listBtn = document.getElementById('list-view');
    const filterSelect = document.getElementById('filter-category');

    async function loadMembers() {
        try {
            const res = await fetch(DATA_PATH);
            const data = await res.json();
            const members = data.members || [];

            const categories = Array.from(new Set(members.map(m => m.category))).sort();
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                filterSelect.appendChild(option);
            });

            renderMembers(members);

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

            const imageHTML = m.image && m.image.trim() !== ""
                ? `<img class="member-img" src="${m.image}" alt="${m.name} image" onerror="this.style.display='none'">`
                : `<div class="img-placeholder">Image Placeholder</div>`;

            article.innerHTML = `
            <div class="card-body">
                <h3>${m.name}</h3>
                <p class="tagline">${m.tagline || m.description || "No tagline available"}</p>
                <span>${imageHTML}</span>
                <p class="address"><strong>Address:</strong> ${m.address || "Not provided"}</p>
                <p class="phone"><strong>Phone:</strong> ${m.phone || "Not provided"}</p>
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

    // grid/list buttons
    if (gridBtn && listBtn) {
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
    }

    loadMembers();
});


// =========================================================
// HOME PAGE — only runs if #current-weather-data exists
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    const currentEl = document.getElementById("current-weather-data");
    if (!currentEl) return; // skip home code on non-home pages

    const eventsContainer = document.querySelector(".events-content");

    const eventsData = [
        { title: "Business Networking Meetup", date: "March 14, 2025" },
        { title: "Tech & Innovation Expo", date: "April 2, 2025" },
        { title: "Small Business Workshop", date: "April 19, 2025" }
    ];

    if (eventsContainer) {
        eventsContainer.innerHTML = eventsData
            .map(event => `<p><strong>${event.title}</strong><br>${event.date}</p>`)
            .join("");
    }

    // WEATHER API
    function toTitleCase(str) {
        return str
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    const API_KEY = "b6cf7594d10bbf6110322d54ed6d99f1";
    const CITY_ID = "3448439";

    async function loadCurrentWeather() {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?id=${CITY_ID}&appid=${API_KEY}&units=metric`;
            const res = await fetch(url);
            const data = await res.json();

            currentEl.innerHTML = `
                <p><strong>${Math.round(data.main.temp)}°C</strong></p>
                <p>${toTitleCase(data.weather[0].description)}</p>
                <p>High: <strong>${Math.round(data.main.temp_max)}°C</strong></p>
                <p>Low: <strong>${Math.round(data.main.temp_min)}°C</strong></p>
                <p>Humidity: <strong>${data.main.humidity}%</strong></p>
                <p>Wind: <strong>${data.wind.speed} m/s</strong></p>
            `;

        } catch (error) {
            currentEl.innerHTML = "<p>Unable to load weather.</p>";
        }
    }

    async function loadForecast() {
        const forecastEl = document.getElementById("forecast-data");
        if (!forecastEl) return;

        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?id=${CITY_ID}&appid=${API_KEY}&units=metric`;
            const res = await fetch(url);
            const data = await res.json();

            forecastEl.innerHTML = "";
            const days = data.list.filter(i => i.dt_txt.includes("12:00:00")).slice(0, 3);

            days.forEach(day => {
                const weekday = new Date(day.dt_txt).toLocaleDateString("en-US", {
                    weekday: "long"
                });
                forecastEl.innerHTML += `<p>${weekday}: <strong>${Math.round(day.main.temp)}°C</strong></p>`;
            });

        } catch (error) {
            forecastEl.innerHTML = "<p>Unable to load forecast.</p>";
        }
    }

    loadCurrentWeather();
    loadForecast();

    // SPOTLIGHTS
    loadSpotlights();
});

// spotlight logic (SHARED)
async function loadSpotlights() {
    const container = document.getElementById("spotlight-container");
    if (!container) return;

    try {
        const res = await fetch(DATA_PATH);
        const data = await res.json();
        const members = data.members || [];

        const filtered = members.filter(m => m.membership === 3 || m.membership === 2);

        const shuffled = filtered.sort(() => 0.5 - Math.random());
        const count = Math.random() < 0.5 ? 2 : 3;
        const selected = shuffled.slice(0, count);

        container.innerHTML = selected
            .map(m => `
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


// =========================================================
// JOIN PAGE — only runs if #timestamp exists
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    const timestampEl = document.getElementById("timestamp");
    if (!timestampEl) return;

    timestampEl.value = new Date().toISOString();

    // JOIN PAGE MODALS
    const openLinks = document.querySelectorAll(".open-modal");
    const dialogs = document.querySelectorAll("dialog");

    openLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            const dlg = document.getElementById(target);
            if (dlg) dlg.showModal();
        });
    });

    document.querySelectorAll(".dialog-close").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest("dialog").close();
        });
    });

    dialogs.forEach(dlg => {
        dlg.addEventListener("click", (e) => {
            const rect = dlg.getBoundingClientRect();
            const inside = e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;
            if (!inside) dlg.close();
        });
    });

    // Animate membership cards
    const cards = document.querySelectorAll(".m-card");
    cards.forEach((card, i) => {
        setTimeout(() => card.classList.add("animated"), i * 150);
    });
});


// =========================================================
// THANK YOU PAGE — only runs if #confirmation-list exists
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("confirmation-list");
    if (!output) return;

    const params = new URLSearchParams(window.location.search);

    const requiredFields = [
        { key: "firstName", label: "First Name" },
        { key: "lastName", label: "Last Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Mobile Phone" },
        { key: "organization", label: "Business / Organization" },
        { key: "timestamp", label: "Submitted On" }
    ];

    requiredFields.forEach(field => {
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = field.label;

        let value = params.get(field.key) || "Not provided";

        if (field.key === "timestamp" && value !== "Not provided") {
            try { value = new Date(value).toLocaleString(); }
            catch (e) { }
        }

        dd.textContent = value;
        output.appendChild(dt);
        output.appendChild(dd);
    });
});


// =========================================================
// DISCOVER PAGE — only runs if #places-grid exists
// =========================================================

document.addEventListener("DOMContentLoaded", async () => {
    const gridEl = document.getElementById("places-grid");
    if (!gridEl) return;

    // IMPORT MODULE (your discover page data)
    try {
        const module = await import("../data/places.mjs");
        const places = module.places;

        renderPlaces(places);
        showVisitMessage();
        setupLearnMore();
    } catch (err) {
        console.error("Discover import error:", err);
    }

    function showVisitMessage() {
        const visitMsgEl = document.getElementById("visit-message");
        if (!visitMsgEl) return;

        const key = "discover-last-visit";
        const last = localStorage.getItem(key);
        const now = Date.now();

        if (!last) {
            visitMsgEl.textContent = "Welcome! Let us know if you have any questions.";
        } else {
            const days = Math.floor((now - Number(last)) / (1000 * 60 * 60 * 24));
            if (days < 1) visitMsgEl.textContent = "Back so soon! Awesome!";
            else visitMsgEl.textContent = `You last visited ${days} day${days === 1 ? "" : "s"} ago.`;
        }
        localStorage.setItem(key, String(now));
    }

    function renderPlaces(list) {
        gridEl.innerHTML = "";
        list.forEach(p => {
            const card = document.createElement("article");
            card.className = "place-card";
            card.innerHTML = `
            <h2>${p.title}</h2>

            <img class="place-img" 
            src="${p.img}" 
            alt="${p.title}" 
            width="300" height="200" 
            loading="lazy">

            <address>${p.address}</address>
            <p>${p.description}</p>

            <button class="learn-more" data-id="${p.id}">Learn more</button>
            `;

            gridEl.appendChild(card);
        });
    }

    function setupLearnMore() {
        document.addEventListener("click", async (e) => {
            const btn = e.target.closest(".learn-more");
            if (!btn) return;

            const module = await import("../data/places.mjs");
            const place = module.places.find(p => p.id === btn.dataset.id);
            if (!place) return;

            let dlg = document.getElementById("place-dialog");
            if (!dlg) {
                dlg = document.createElement("dialog");
                dlg.id = "place-dialog";
                dlg.innerHTML = `
                  <div class="dlg-inner"></div>
                  <button class="dlg-close">Close</button>
                `;
                document.body.appendChild(dlg);

                dlg.querySelector(".dlg-close").addEventListener("click", () => dlg.close());
                dlg.addEventListener("click", (ev) => {
                    const rect = dlg.getBoundingClientRect();
                    const inside = ev.clientX >= rect.left &&
                        ev.clientX <= rect.right &&
                        ev.clientY >= rect.top &&
                        ev.clientY <= rect.bottom;
                    if (!inside) dlg.close();
                });
            }

            const inner = dlg.querySelector(".dlg-inner");
            inner.innerHTML = `
              <h2>${place.title}</h2>
              <img src="${place.img}" alt="${place.title}" width="600">
              <address>${place.address}</address>
              <p>${place.description}</p>
            `;

            dlg.showModal();
        });
    }
});

