let cart = [];
let allPlants = [];

// Show Loading Spinner
function showSpinner(show) {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = show ? 'block' : 'none';
}

// Add to Cart
function addToCart(name, price, id) {
    const item = { id, name, price };
    cart.push(item);
    updateCartUI();
    alert(`${name} added to cart!`);
}

// Remove from Cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// Update Cart UI
function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-xs text-center italic">No items added yet</p>`;
        totalEl.innerText = "0";
        return;
    }

    container.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price;
        const div = document.createElement('div');
        div.className = "flex justify-between items-center text-xs bg-gray-50 p-2 rounded border";
        div.innerHTML = `
            <span>${item.name}</span>
            <div class="flex items-center gap-2">
                <span>৳${item.price}</span>
                <button onclick="removeFromCart(${item.id})" class="text-red-500 font-bold text-lg leading-none">✕</button>
            </div>
        `;
        container.appendChild(div);
    });
    totalEl.innerText = total;
}

// Create Tree Card
function createTreeCard(plant) {
    const card = document.createElement('div');
    card.className = "tree-card bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition";
    
    card.innerHTML = `
        <img src="${plant.image}" alt="${plant.name}" class="w-full h-40 object-cover rounded-lg mb-4">
        <h5 onclick="showPlantModal(${plant.id})" class="font-bold text-sm mb-1 hover:text-green-600">${plant.name}</h5>
        <p class="text-[11px] text-gray-500 mb-3 line-clamp-2">${plant.description}</p>
        <div class="flex justify-between items-center mb-4">
            <span class="bg-green-50 text-green-600 text-[10px] px-2 py-1 rounded border">${plant.category}</span>
            <span class="font-bold text-xs">৳ ${plant.price}</span>
        </div>
        <button onclick="event.stopImmediatePropagation(); addToCart('${plant.name}', ${plant.price}, ${plant.id})" 
                class="w-full bg-[#3d7a44] text-white py-2 rounded-lg text-xs font-bold">
            Add to Cart
        </button>
    `;
    return card;
}

async function showPlantModal(id) {
    showSpinner(true);
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
        const data = await res.json();
        const plant = data.plant;

        const modalHTML = `
            <div id="plant-modal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
                <div class="bg-white rounded-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-auto">
                    <div class="p-6">
                        <img src="${plant.image}" alt="${plant.name}" class="w-full h-64 object-cover rounded-xl mb-6">
                        <h2 class="text-2xl font-bold mb-2">${plant.name}</h2>
                        <p class="text-green-600 font-medium mb-4">${plant.category}</p>
                        <p class="text-gray-600 leading-relaxed mb-6">${plant.description}</p>
                        <div class="flex justify-between items-center text-xl font-bold">
                            <span>Price:</span>
                            <span>৳ ${plant.price}</span>
                        </div>
                    </div>
                    <div class="border-t p-4 flex gap-3">
                        <button onclick="addToCart('${plant.name}', ${plant.price}, ${plant.id}); closeModal()" 
                                class="flex-1 bg-[#3d7a44] text-white py-3 rounded-xl font-bold">
                            Add to Cart
                        </button>
                        <button onclick="closeModal()" 
                                class="flex-1 border border-gray-300 py-3 rounded-xl font-bold">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    } catch (err) {
        alert("Failed to load plant details");
    } finally {
        showSpinner(false);
    }
}

function closeModal() {
    const modal = document.getElementById('plant-modal');
    if (modal) modal.remove();
}

// Load Categories Dynamically
async function loadCategories() {
    showSpinner(true);
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/categories');
        const data = await res.json();
        
        const container = document.getElementById('category-container');
        container.innerHTML = `<button class="cat-btn active-cat" data-id="all">All Trees</button>`;

        data.categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = "cat-btn";
            btn.textContent = cat.category_name;
            btn.dataset.id = cat.id;
            container.appendChild(btn);
        });

        // Add click listeners
        document.querySelectorAll('.cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active-cat'));
                btn.classList.add('active-cat');
                loadPlants(btn.dataset.id);
            });
        });

    } catch (err) {
        console.error(err);
    } finally {
        showSpinner(false);
    }
}

async function loadPlants(categoryId = "all") {
    showSpinner(true);
    const grid = document.getElementById('tree-grid');
    grid.innerHTML = '';

    try {
        let url = 'https://openapi.programming-hero.com/api/plants';
        
        if (categoryId !== "all") {
            url = `https://openapi.programming-hero.com/api/category/${categoryId}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        
        const plants = categoryId === "all" ? data.plants : data.plants;

        plants.forEach(plant => {
            const card = createTreeCard(plant);
            grid.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        grid.innerHTML = `<p class="text-red-500 col-span-3 text-center">Failed to load trees</p>`;
    } finally {
        showSpinner(false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Add spinner element
    const spinnerHTML = `
        <div id="loading-spinner" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', spinnerHTML);

    loadCategories();
    loadPlants();
    updateCartUI();
});