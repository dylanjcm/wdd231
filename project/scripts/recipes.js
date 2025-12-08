// recipes.js (ES Module style)
const dataUrl = 'data/recipes.json';

async function fetchRecipes() {
    try {
        const res = await fetch(dataUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data.recipes || [];
    } catch (err) {
        console.error('Fetch error:', err);
        return []; // graceful fallback
    }
}

function createCard(recipe) {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.setAttribute('role', 'listitem');

    // template literal with at least 4 properties: title, image, category, difficulty
    card.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.title} image" loading="lazy" width="240" height="160">
    <div>
      <h3>${recipe.title}</h3>
      <p class="recipe-meta">${recipe.category} • ${recipe.difficulty} • ${recipe.time} min</p>
      <p>${recipe.description}</p>
      <p><button class="open-btn btn" data-id="${recipe.id}">View</button></p>
    </div>
  `;
    return card;
}

function populateGrid(recipes, container) {
    container.innerHTML = '';
    recipes.forEach(r => container.appendChild(createCard(r)));
}

// Build categories
function buildCategoryOptions(recipes, selectEl) {
    const categories = [...new Set(recipes.map(r => r.category))];
    categories.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c[0].toUpperCase() + c.slice(1);
        selectEl.appendChild(opt);
    });
}

// Modal & favorites
function openModal(recipe) {
    const modal = document.getElementById('recipe-modal') || document.createElement('dialog');
    const body = document.getElementById('modal-body') || modal.querySelector('#modal-body');

    body.innerHTML = `
    <h2 id="modal-title">${recipe.title}</h2>
    <img src="${recipe.image}" alt="${recipe.title} image" loading="lazy" style="max-width:100%;border-radius:6px;">
    <p class="recipe-meta">${recipe.category} • ${recipe.difficulty} • ${recipe.time} min</p>
    <h3>Ingredients</h3>
    <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
    <h3>Instructions</h3>
    <p>${recipe.instructions}</p>
  `;

    // favorite button state
    const favBtn = document.getElementById('toggle-favorite');
    if (favBtn) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        favBtn.textContent = favorites.includes(recipe.id) ? 'Remove Favorite' : 'Save Favorite';
        favBtn.onclick = () => {
            toggleFavorite(recipe.id);
            favBtn.textContent = JSON.parse(localStorage.getItem('favorites') || '[]').includes(recipe.id) ? 'Remove Favorite' : 'Save Favorite';
        };
    }

    // show dialog
    if (!modal.open) {
        modal.showModal();
    }
}

function toggleFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const idx = favorites.indexOf(id);
    if (idx === -1) favorites.push(id);
    else favorites.splice(idx, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function wireUpOpenButtons(container, recipes) {
    container.addEventListener('click', (e) => {
        if (e.target.matches('.open-btn')) {
            const id = e.target.dataset.id;
            const recipe = recipes.find(r => String(r.id) === String(id));
            if (recipe) openModal(recipe);
        }
    });
}

// init on pages (works for index & recipes)
(async function initRecipesPage() {
    const recipes = await fetchRecipes();

    // featured container on index page
    const featuredContainer = document.getElementById('featured-container');
    if (featuredContainer) {
        // show first 3 as featured
        populateGrid(recipes.slice(0, 3), featuredContainer);
    }

    const recipeGrid = document.getElementById('recipe-grid');
    if (!recipeGrid) return; // no recipes page content

    // populate, filter, search
    populateGrid(recipes, recipeGrid);
    buildCategoryOptions(recipes, document.getElementById('categoryFilter'));

    // search and filter
    const search = document.getElementById('search');
    const categoryFilter = document.getElementById('categoryFilter');
    const clearBtn = document.getElementById('clear-filters');

    function applyFilters() {
        const term = search?.value.trim().toLowerCase() || '';
        const cat = categoryFilter?.value || '';
        let filtered = recipes.filter(r => {
            const matchTerm = r.title.toLowerCase().includes(term) || r.description.toLowerCase().includes(term) || r.ingredients.join(' ').toLowerCase().includes(term);
            const matchCat = cat ? r.category === cat : true;
            return matchTerm && matchCat;
        });
        populateGrid(filtered, recipeGrid);
    }

    search?.addEventListener('input', applyFilters);
    categoryFilter?.addEventListener('change', applyFilters);
    clearBtn?.addEventListener('click', () => {
        if (search) search.value = '';
        if (categoryFilter) categoryFilter.value = '';
        populateGrid(recipes, recipeGrid);
    });

    // modal controls
    const modal = document.getElementById('recipe-modal');
    const closeModal = document.getElementById('close-modal');
    closeModal?.addEventListener('click', () => modal.close());

    // wire open buttons
    wireUpOpenButtons(recipeGrid, recipes);
})();
