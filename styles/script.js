let cart = [];

function addToCart(name, price) {
    const item = { name, price, id: Date.now() };
    cart.push(item);
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

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
                <button onclick="removeFromCart(${item.id})" class="text-red-500 font-bold">✕</button>
            </div>
        `;
        container.appendChild(div);
    });

    totalEl.innerText = total;
}

// Category Switcher
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active-cat'));
        this.classList.add('active-cat');
    });
});