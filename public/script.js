// Data storage
let categories = JSON.parse(localStorage.getItem('categories')) || [
    { id: 'lanches', name: 'Lanches', color: '#e74c3c' },
    { id: 'extras', name: 'Extras', color: '#f39c12' },
    { id: 'bebidas', name: 'Bebidas', color: '#3498db' },
    { id: 'doces', name: 'Doces', color: '#9b59b6' }
];

let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: 1,
        name: "X-Burger",
        description: "Pão, hambúrguer, queijo, alface, tomate e molho especial",
        price: 15.90,
        category: "lanches",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
    },
    {
        id: 2,
        name: "Batata Frita",
        description: "Porção grande de batata frita crocante",
        price: 8.90,
        category: "extras",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f062?w=400&h=300&fit=crop"
    },
    {
        id: 3,
        name: "Coca-Cola",
        description: "Refrigerante gelado 350ml",
        price: 4.50,
        category: "bebidas",
        image: "https://images.unsplash.com/photo-1543253687-c931c8e01820?w=400&h=300&fit=crop"
    },
    {
        id: 4,
        name: "Sundae",
        description: "Sorvete com calda de chocolate e granulado",
        price: 6.90,
        category: "doces",
        image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop"
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = 'lanches';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
    setupEventListeners();
});

// Event listeners
function setupEventListeners() {
    // Category tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            loadProducts();
        });
    });

    // Cart icon
    document.querySelector('.cart-icon').addEventListener('click', openCart);

    // Admin link
    document.querySelector('.admin-link').addEventListener('click', function(e) {
        e.preventDefault();
        const password = prompt("Digite a senha para acessar o painel administrativo:");
        
        if (password === 'admin123') {
            openAdmin();
        } else {
            alert("Senha incorreta! Acesso negado.");
        }
    });
}

// Product management
function loadProducts() {
    const container = document.getElementById('menu-container');
    const filteredProducts = products.filter(p => p.category === currentCategory);
    
    container.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<p class="no-products">Nenhum produto nesta categoria.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const imageContent = product.image 
        ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 5px;">`
        : `<div class="product-image"><i class="fas fa-hamburger"></i></div>`;
    
    card.innerHTML = `
        ${imageContent}
        <h3 class="product-title">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
        <button class="add-to-cart" onclick="addToCart(${product.id})">
            <i class="fas fa-plus"></i> Adicionar
        </button>
    `;
    
    return card;
}

// Cart management
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} adicionado ao carrinho!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    loadCartItems();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        loadCartItems();
    }
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

function loadCartItems() {
    const container = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Carrinho vazio</p>';
        totalElement.textContent = '0,00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <br>
                <small>R$ ${item.price.toFixed(2).replace('.', ',')} x ${item.quantity}</small>
            </div>
            <div>
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})" style="margin-left: 10px;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        container.appendChild(cartItem);
    });
    
    totalElement.textContent = total.toFixed(2).replace('.', ',');
}

// Admin panel
function openAdmin() {
    document.getElementById('admin-modal').style.display = 'block';
    loadAdminPanel();
}

function closeAdmin() {
    document.getElementById('admin-modal').style.display = 'none';
}

let currentAdminTab = 'products';

function loadAdminPanel() {
    const panel = document.getElementById('admin-panel');
    
    // Adicionar event listeners para as abas
    setTimeout(() => {
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                currentAdminTab = this.dataset.tab;
                loadAdminContent();
            });
        });
    }, 100);
    
    loadAdminContent();
}

function loadAdminContent() {
    const panel = document.getElementById('admin-panel');
    
    switch(currentAdminTab) {
        case 'products':
            panel.innerHTML = `
                <div class="admin-section">
                    <h4>Gerenciar Produtos</h4>
                    <button class="btn btn-primary" onclick="showAddProductForm()">Adicionar Novo Produto</button>
                    <div id="product-list" class="product-list">
                        ${generateProductList()}
                    </div>
                </div>
            `;
            break;
            
        case 'categories':
            panel.innerHTML = `
                <div class="admin-section">
                    <h4>Gerenciar Categorias</h4>
                    <button class="btn btn-primary" onclick="showAddCategoryForm()">Adicionar Nova Categoria</button>
                    <div id="category-list" class="category-list">
                        ${generateCategoryList()}
                    </div>
                </div>
            `;
            break;
            
        case 'settings':
            panel.innerHTML = `
                <div class="admin-section">
                    <h4>Configurações</h4>
                    <form id="settings-form" onsubmit="saveSettings(event)">
                        <div class="form-group">
                            <label>Nome da Lanchonete:</label>
                            <input type="text" id="store-name" value="${settings.storeName}" required>
                        </div>
                        <div class="form-group">
                            <label>Telefone para WhatsApp:</label>
                            <input type="text" id="whatsapp-number" value="${settings.whatsappNumber}" required>
                        </div>
                        <div class="form-group">
                            <label>Horário de Funcionamento:</label>
                            <input type="text" id="business-hours" value="${settings.businessHours}" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Salvar Configurações</button>
                    </form>
                    
                    <hr style="margin: 2rem 0;">
                    
                    <h4>Alterar Senha do Admin</h4>
                    <form id="password-form" onsubmit="changePassword(event)">
                        <div class="form-group">
                            <label>Senha Atual:</label>
                            <input type="password" id="current-password" required>
                        </div>
                        <div class="form-group">
                            <label>Nova Senha:</label>
                            <input type="password" id="new-password" required minlength="4">
                        </div>
                        <div class="form-group">
                            <label>Confirmar Nova Senha:</label>
                            <input type="password" id="confirm-password" required minlength="4">
                        </div>
                        <button type="submit" class="btn btn-primary">Alterar Senha</button>
                    </form>
                </div>
            `;
            break;
    }
}

function generateProductList() {
    return products.map(product => `
        <div class="product-item">
            <div>
                <strong>${product.name}</strong> - R$ ${product.price.toFixed(2).replace('.', ',')}
                <br>
                <small>${product.category}</small>
            </div>
            <div>
                <button class="btn btn-success" onclick="editProduct(${product.id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Excluir</button>
            </div>
        </div>
    `).join('');
}

function showAddProductForm() {
    const panel = document.getElementById('admin-panel');
    panel.innerHTML = `
        <div class="admin-section">
            <h4>Adicionar Novo Produto</h4>
            <form id="product-form" onsubmit="saveProduct(event)">
                <div class="form-group">
                    <label>Nome:</label>
                    <input type="text" id="product-name" required>
                </div>
                <div class="form-group">
                    <label>Descrição:</label>
                    <textarea id="product-description" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label>Preço:</label>
                    <input type="number" id="product-price" step="0.01" min="0" required>
                </div>
                <div class="form-group">
                    <label>Categoria:</label>
                    <select id="product-category" required>
                        <option value="lanches">Lanches</option>
                        <option value="extras">Extras</option>
                        <option value="bebidas">Bebidas</option>
                        <option value="doces">Doces</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Imagem do Produto:</label>
                    <div class="image-upload-container">
                        <div class="upload-options">
                            <label class="upload-option">
                                <input type="radio" name="image-source" value="file" checked onchange="toggleImageSource()">
                                <span>Upload do Dispositivo</span>
                            </label>
                            <label class="upload-option">
                                <input type="radio" name="image-source" value="url" onchange="toggleImageSource()">
                                <span>URL da Imagem</span>
                            </label>
                        </div>
                        
                        <div id="file-upload-section">
                            <div class="file-upload-area" onclick="document.getElementById('product-image-file').click()">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>Clique para selecionar uma imagem</p>
                                <small>ou arraste e solte aqui</small>
                                <input type="file" id="product-image-file" accept="image/*" onchange="handleImageUpload(event)" style="display: none;">
                            </div>
                            <div id="image-preview" class="image-preview" style="display: none;">
                                <img id="preview-image" src="" alt="Preview">
                                <button type="button" class="remove-image" onclick="removeImage()">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div id="url-upload-section" style="display: none;">
                            <input type="url" id="product-image-url" placeholder="https://exemplo.com/imagem.jpg">
                        </div>
                    </div>
                    <input type="hidden" id="product-image" value="">
                </div>
                <button type="submit" class="btn btn-primary">Salvar Produto</button>
                <button type="button" class="btn btn-secondary" onclick="loadAdminPanel()">Cancelar</button>
            </form>
        </div>
    `;
    
    // Add drag and drop functionality
    setTimeout(() => {
        setupDragAndDrop();
    }, 100);
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const panel = document.getElementById('admin-panel');
    panel.innerHTML = `
        <div class="admin-section">
            <h4>Editar Produto</h4>
            <form id="product-form" onsubmit="updateProduct(event, ${productId})">
                <div class="form-group">
                    <label>Nome:</label>
                    <input type="text" id="product-name" value="${product.name}" required>
                </div>
                <div class="form-group">
                    <label>Descrição:</label>
                    <textarea id="product-description" rows="3" required>${product.description}</textarea>
                </div>
                <div class="form-group">
                    <label>Preço:</label>
                    <input type="number" id="product-price" step="0.01" min="0" value="${product.price}" required>
                </div>
                <div class="form-group">
                    <label>Categoria:</label>
                    <select id="product-category" required>
                        <option value="lanches" ${product.category === 'lanches' ? 'selected' : ''}>Lanches</option>
                        <option value="extras" ${product.category === 'extras' ? 'selected' : ''}>Extras</option>
                        <option value="bebidas" ${product.category === 'bebidas' ? 'selected' : ''}>Bebidas</option>
                        <option value="doces" ${product.category === 'doces' ? 'selected' : ''}>Doces</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Imagem do Produto:</label>
                    <div class="image-upload-container">
                        <div class="upload-options">
                            <label class="upload-option">
                                <input type="radio" name="image-source" value="file" ${!product.image || !product.image.startsWith('http') ? 'checked' : ''} onchange="toggleImageSource()">
                                <span>Upload do Dispositivo</span>
                            </label>
                            <label class="upload-option">
                                <input type="radio" name="image-source" value="url" ${product.image && product.image.startsWith('http') ? 'checked' : ''} onchange="toggleImageSource()">
                                <span>URL da Imagem</span>
                            </label>
                        </div>
                        
                        <div id="file-upload-section" style="${product.image && product.image.startsWith('http') ? 'display: none;' : ''}">
                            <div class="file-upload-area" onclick="document.getElementById('product-image-file').click()">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>Clique para selecionar uma imagem</p>
                                <small>ou arraste e solte aqui</small>
                                <input type="file" id="product-image-file" accept="image/*" onchange="handleImageUpload(event)" style="display: none;">
                            </div>
                            <div id="image-preview" class="image-preview" style="${product.image && !product.image.startsWith('http') ? 'display: block;' : 'display: none;'}">
                                <img id="preview-image" src="${product.image || ''}" alt="Preview">
                                <button type="button" class="remove-image" onclick="removeImage()">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div id="url-upload-section" style="${product.image && product.image.startsWith('http') ? 'display: block;' : 'display: none;'}">
                            <input type="url" id="product-image-url" value="${product.image || ''}" placeholder="https://exemplo.com/imagem.jpg">
                        </div>
                    </div>
                    <input type="hidden" id="product-image" value="${product.image || ''}">
                </div>
                <button type="submit" class="btn btn-primary">Atualizar Produto</button>
                <button type="button" class="btn btn-secondary" onclick="loadAdminPanel()">Cancelar</button>
            </form>
        </div>
    `;
    
    // Add drag and drop functionality
    setTimeout(() => {
        setupDragAndDrop();
    }, 100);
}

function saveProduct(event) {
    event.preventDefault();
    
    const newProduct = {
        id: Date.now(),
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        image: ""
    };
    
    products.push(newProduct);
    saveProducts();
    loadProducts();
    loadAdminPanel();
    showNotification('Produto adicionado com sucesso!');
}

function updateProduct(event, productId) {
    event.preventDefault();
    
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return;
    
    products[productIndex] = {
        ...products[productIndex],
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value
    };
    
    saveProducts();
    loadProducts();
    loadAdminPanel();
    showNotification('Produto atualizado com sucesso!');
}

function deleteProduct(productId) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        loadProducts();
        loadAdminPanel();
        showNotification('Produto excluído com sucesso!');
    }
}

// Cart modal functions
function openCart() {
    document.getElementById('cart-modal').style.display = 'block';
    loadCartItems();
    setupCheckoutForm();
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

function setupCheckoutForm() {
    // Payment method change handler
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const changeSection = document.getElementById('change-section');
            if (this.value === 'money') {
                changeSection.style.display = 'block';
            } else {
                changeSection.style.display = 'none';
            }
        });
    });
}

function loadCartItems() {
    const container = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const finalTotalElement = document.getElementById('final-total');
    const btnTotalElement = document.getElementById('btn-total');
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Carrinho vazio</h3>
                <p>Adicione itens ao seu carrinho</p>
            </div>
        `;
        subtotalElement.textContent = '0,00';
        finalTotalElement.textContent = '5,00';
        btnTotalElement.textContent = 'R$ 5,00';
        return;
    }
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        container.appendChild(cartItem);
    });
    
    const deliveryFee = 5.00;
    const finalTotal = subtotal + deliveryFee;
    
    subtotalElement.textContent = subtotal.toFixed(2).replace('.', ',');
    finalTotalElement.textContent = finalTotal.toFixed(2).replace('.', ',');
    btnTotalElement.textContent = `R$ ${finalTotal.toFixed(2).replace('.', ',')}`;
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!');
        return;
    }
    
    // Validate address
    const fullAddress = document.getElementById('full-address').value;
    
    if (!fullAddress || fullAddress.trim() === '') {
        showNotification('Por favor, digite seu endereço completo!');
        return;
    }
    
    // Get payment method
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    let paymentInfo = '';
    
    if (paymentMethod === 'money') {
        const changeAmount = document.getElementById('change-amount').value;
        paymentInfo = changeAmount ? `Precisa de troco para R$ ${parseFloat(changeAmount).toFixed(2).replace('.', ',')}` : 'Sem troco';
    } else if (paymentMethod === 'card') {
        paymentInfo = 'Pagamento no cartão';
    } else if (paymentMethod === 'pix') {
        paymentInfo = 'Pagamento via Pix';
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 5.00;
    const finalTotal = subtotal + deliveryFee;
    
    const message = `🍔 *NOVO PEDIDO* 🍔
    
*Itens do pedido:*
${cart.map(item => 
    `• ${item.name} - ${item.quantity}x R$ ${item.price.toFixed(2).replace('.', ',')}`
).join('\n')}

*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}
*Taxa de entrega:* R$ ${deliveryFee.toFixed(2).replace('.', ',')}
*Total:* R$ ${finalTotal.toFixed(2).replace('.', ',')}

*Endereço de entrega:*
${fullAddress}

*Forma de pagamento:* ${paymentInfo}`;

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    cart = [];
    saveCart();
    updateCartCount();
    closeCart();
    showNotification('Pedido enviado via WhatsApp! 🎉');
}

// Utility functions
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Category management functions
function generateCategoryList() {
    return categories.map(category => `
        <div class="category-item">
            <div>
                <strong>${category.name}</strong>
                <div style="display: inline-block; width: 20px; height: 20px; background-color: ${category.color}; border-radius: 3px; margin-left: 10px;"></div>
                <br>
                <small>ID: ${category.id}</small>
            </div>
            <div>
                <button class="btn btn-success" onclick="editCategory('${category.id}')">Editar</button>
                <button class="btn btn-danger" onclick="deleteCategory('${category.id}')">Excluir</button>
            </div>
        </div>
    `).join('');
}

function showAddCategoryForm() {
    const panel = document.getElementById('admin-panel');
    panel.innerHTML = `
        <div class="admin-section">
            <h4>Adicionar Nova Categoria</h4>
            <form id="category-form" onsubmit="saveCategory(event)">
                <div class="form-group">
                    <label>Nome da Categoria:</label>
                    <input type="text" id="category-name" required>
                </div>
                <div class="form-group">
                    <label>ID da Categoria (sem espaços):</label>
                    <input type="text" id="category-id" required pattern="[a-z0-9-]+" title="Use apenas letras minúsculas, números e hífens">
                </div>
                <div class="form-group">
                    <label>Cor da Categoria:</label>
                    <input type="color" id="category-color" value="#3498db">
                </div>
                <button type="submit" class="btn btn-primary">Salvar Categoria</button>
                <button type="button" class="btn btn-secondary" onclick="loadAdminPanel()">Cancelar</button>
            </form>
        </div>
    `;
}

function editCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    const panel = document.getElementById('admin-panel');
    panel.innerHTML = `
        <div class="admin-section">
            <h4>Editar Categoria</h4>
            <form id="category-form" onsubmit="updateCategory(event, '${categoryId}')">
                <div class="form-group">
                    <label>Nome da Categoria:</label>
                    <input type="text" id="category-name" value="${category.name}" required>
                </div>
                <div class="form-group">
                    <label>ID da Categoria (não pode ser alterado):</label>
                    <input type="text" value="${category.id}" disabled>
                </div>
                <div class="form-group">
                    <label>Cor da Categoria:</label>
                    <input type="color" id="category-color" value="${category.color}">
                </div>
                <button type="submit" class="btn btn-primary">Atualizar Categoria</button>
                <button type="button" class="btn btn-secondary" onclick="loadAdminPanel()">Cancelar</button>
            </form>
        </div>
    `;
}

function saveCategory(event) {
    event.preventDefault();
    
    const categoryId = document.getElementById('category-id').value;
    const categoryName = document.getElementById('category-name').value;
    const categoryColor = document.getElementById('category-color').value;
    
    // Check if ID already exists
    if (categories.some(c => c.id === categoryId)) {
        alert('Este ID de categoria já existe. Por favor, escolha outro.');
        return;
    }
    
    const newCategory = {
        id: categoryId,
        name: categoryName,
        color: categoryColor
    };
    
    categories.push(newCategory);
    saveCategories();
    updateCategoryTabs();
    loadAdminPanel();
    showNotification('Categoria adicionada com sucesso!');
}

function updateCategory(event, categoryId) {
    event.preventDefault();
    
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) return;
    
    categories[categoryIndex] = {
        ...categories[categoryIndex],
        name: document.getElementById('category-name').value,
        color: document.getElementById('category-color').value
    };
    
    saveCategories();
    updateCategoryTabs();
    loadAdminPanel();
    showNotification('Categoria atualizada com sucesso!');
}

function deleteCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    // Check if there are products in this category
    const productsInCategory = products.filter(p => p.category === categoryId);
    
    if (productsInCategory.length > 0) {
        const confirmDelete = confirm(`Esta categoria contém ${productsInCategory.length} produto(s). Se você excluir esta categoria, os produtos serão movidos para a categoria padrão "lanches". Deseja continuar?`);
        
        if (!confirmDelete) return;
        
        // Move products to default category
        products.forEach(product => {
            if (product.category === categoryId) {
                product.category = 'lanches';
            }
        });
        saveProducts();
    }
    
    categories = categories.filter(c => c.id !== categoryId);
    saveCategories();
    updateCategoryTabs();
    loadAdminPanel();
    showNotification('Categoria excluída com sucesso!');
}

function updateCategoryTabs() {
    // Update category tabs in main menu
    const tabsContainer = document.querySelector('.category-tabs');
    if (tabsContainer) {
        tabsContainer.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'tab-button';
            button.dataset.category = category.id;
            button.textContent = category.name;
            button.style.borderColor = category.color;
            button.style.color = category.color;
            
            if (category.id === currentCategory) {
                button.classList.add('active');
                button.style.backgroundColor = category.color;
                button.style.color = 'white';
            }
            
            button.addEventListener('click', function() {
                document.querySelectorAll('.tab-button').forEach(b => {
                    b.classList.remove('active');
                    b.style.backgroundColor = 'white';
                    b.style.color = b.style.borderColor;
                });
                this.classList.add('active');
                this.style.backgroundColor = category.color;
                this.style.color = 'white';
                currentCategory = this.dataset.category;
                loadProducts();
            });
            
            tabsContainer.appendChild(button);
        });
    }
}

// Update product form to use dynamic categories
function getCategoryOptions(selectedCategory = '') {
    return categories.map(category => 
        `<option value="${category.id}" ${category.id === selectedCategory ? 'selected' : ''}>${category.name}</option>`
    ).join('');
}

// Update existing functions to use dynamic categories
function showAddProductForm() {
    const panel = document.getElementById('admin-panel');
    panel.innerHTML = `
        <div class="admin-section">
            <h4>Adicionar Novo Produto</h4>
            <form id="product-form" onsubmit="saveProduct(event)">
                <div class="form-group">
                    <label>Nome:</label>
                    <input type="text" id="product-name" required>
                </div>
                <div class="form-group">
                    <label>Descrição:</label>
                    <textarea id="product-description" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label>Preço:</label>
                    <input type="number" id="product-price" step="0.01" min="0" required>
                </div>
                <div class="form-group">
                    <label>Categoria:</label>
                    <select id="product-category" required>
                        ${getCategoryOptions()}
                    </select>
                </div>
                <div class="form-group">
                    <label>Imagem do Produto:</label>
                    <div class="image-upload-container">
                        <div class="upload-options">
                            <label class="upload-option">
                                <input type="radio" name="image-source" value="file" checked onchange="toggleImageSource()">
                                <span>Upload do Dispositivo</span>
                            </label>
                            <label class="upload-option">
                                <input type="radio" name="image-source" value="url" onchange="toggleImageSource()">
                                <span>URL da Imagem</span>
                            </label>
                        </div>
                        
                        <div id="file-upload-section">
                            <div class="file-upload-area" onclick="document.getElementById('product-image-file').click()">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>Clique para selecionar uma imagem</p>
                                <small>ou arraste e solte aqui</small>
                                <input type="file" id="product-image-file" accept="image/*" onchange="handleImageUpload(event)" style="display: none;">
                            </div>
                            <div id="image-preview" class="image-preview" style="display: none;">
                                <img id="preview-image" src="" alt="Preview">
                                <button type="button" class="remove-image" onclick="removeImage()">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div id="url-upload-section" style="display: none;">
                            <input type="url" id="product-image-url" placeholder="https://exemplo.com/imagem.jpg">
                        </div>
                    </div>
                    <input type="hidden" id="product-image" value="">
                </div>
                <button type="submit" class="btn btn-primary">Salvar Produto</button>
                <button type="button" class="btn btn-secondary" onclick="loadAdminPanel()">Cancelar</button>
            </form>
        </div>
    `;
    
    // Add drag and drop functionality
    setTimeout(() => {
        setupDragAndDrop();
    }, 100);
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const panel = document.getElementById('admin-panel');
    panel.innerHTML = `
        <div class="admin-section">
            <h4>Editar Produto</h4>
            <form id="product-form" onsubmit="updateProduct(event, ${productId})">
                <div class="form-group">
                    <label>Nome:</label>
                    <input type="text" id="product-name" value="${product.name}" required>
                </div>
                <div class="form-group">
                    <label>Descrição:</label>
                    <textarea id="product-description" rows="3" required>${product.description}</textarea>
                </div>
                <div class="form-group">
                    <label>Preço:</label>
                    <input type="number" id="product-price" step="0.01" min="0" value="${product.price}" required>
                </div>
                <div class="form-group">
                    <label>Categoria:</label>
                    <select id="product-category" required>
                        ${getCategoryOptions(product.category)}
                    </select>
                </div>
                <div class="form-group">
                    <label>Imagem do Produto:</label>
                    <div class="image-upload-container">
                        <div class="upload-options">
                            <label class="upload-option">
                                <input type="radio" name="image-source" value="file" ${!product.image || !product.image.startsWith('http') ? 'checked' : ''} onchange="toggleImageSource()">
                                <span>Upload do Dispositivo</span>
                            </label>
                            <label class="upload-option">
                                <input type="radio" name="image-source" value="url" ${product.image && product.image.startsWith('http') ? 'checked' : ''} onchange="toggleImageSource()">
                                <span>URL da Imagem</span>
                            </label>
                        </div>
                        
                        <div id="file-upload-section" style="${product.image && product.image.startsWith('http') ? 'display: none;' : ''}">
                            <div class="file-upload-area" onclick="document.getElementById('product-image-file').click()">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>Clique para selecionar uma imagem</p>
                                <small>ou arraste e solte aqui</small>
                                <input type="file" id="product-image-file" accept="image/*" onchange="handleImageUpload(event)" style="display: none;">
                            </div>
                            <div id="image-preview" class="image-preview" style="${product.image && !product.image.startsWith('http') ? 'display: block;' : 'display: none;'}">
                                <img id="preview-image" src="${product.image || ''}" alt="Preview">
                                <button type="button" class="remove-image" onclick="removeImage()">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div id="url-upload-section" style="${product.image && product.image.startsWith('http') ? 'display: block;' : 'display: none;'}">
                            <input type="url" id="product-image-url" value="${product.image || ''}" placeholder="https://exemplo.com/imagem.jpg">
                        </div>
                    </div>
                    <input type="hidden" id="product-image" value="${product.image || ''}">
                </div>
                <button type="submit" class="btn btn-primary">Atualizar Produto</button>
                <button type="button" class="btn btn-secondary" onclick="loadAdminPanel()">Cancelar</button>
            </form>
        </div>
    `;
    
    // Add drag and drop functionality
    setTimeout(() => {
        setupDragAndDrop();
    }, 100);
}

// Initialize category tabs on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCategoryTabs();
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 3000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

// Close modals when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cart-modal');
    const adminModal = document.getElementById('admin-modal');
    
    if (event.target === cartModal) {
        closeCart();
    }
    if (event.target === adminModal) {
        closeAdmin();
    }
}

// Image upload functions
function toggleImageSource() {
    const source = document.querySelector('input[name="image-source"]:checked').value;
    const fileSection = document.getElementById('file-upload-section');
    const urlSection = document.getElementById('url-upload-section');
    
    if (source === 'file') {
        fileSection.style.display = 'block';
        urlSection.style.display = 'none';
    } else {
        fileSection.style.display = 'none';
        urlSection.style.display = 'block';
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem válido.');
        return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('A imagem não pode ter mais que 2MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('image-preview');
        const previewImage = document.getElementById('preview-image');
        const imageInput = document.getElementById('product-image');
        
        previewImage.src = e.target.result;
        preview.style.display = 'block';
        imageInput.value = e.target.result;
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    const preview = document.getElementById('image-preview');
    const previewImage = document.getElementById('preview-image');
    const imageInput = document.getElementById('product-image');
    const fileInput = document.getElementById('product-image-file');
    
    preview.style.display = 'none';
    previewImage.src = '';
    imageInput.value = '';
    fileInput.value = '';
}

function setupDragAndDrop() {
    const uploadArea = document.querySelector('.file-upload-area');
    if (!uploadArea) return;
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#3498db';
        uploadArea.style.backgroundColor = '#f8f9fa';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.backgroundColor = '#fafafa';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.backgroundColor = '#fafafa';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const fileInput = document.getElementById('product-image-file');
            fileInput.files = files;
            handleImageUpload({ target: { files: files } });
        }
    });
}

// Update saveProduct and updateProduct functions to handle image properly
function saveProduct(event) {
    event.preventDefault();
    
    const source = document.querySelector('input[name="image-source"]:checked').value;
    let imageUrl = '';
    
    if (source === 'file') {
        imageUrl = document.getElementById('product-image').value;
    } else {
        imageUrl = document.getElementById('product-image-url').value;
    }
    
    const newProduct = {
        id: Date.now(),
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        image: imageUrl
    };
    
    products.push(newProduct);
    saveProducts();
    loadProducts();
    loadAdminPanel();
    showNotification('Produto adicionado com sucesso!');
}

function updateProduct(event, productId) {
    event.preventDefault();
    
    const source = document.querySelector('input[name="image-source"]:checked').value;
    let imageUrl = '';
    
    if (source === 'file') {
        imageUrl = document.getElementById('product-image').value;
    } else {
        imageUrl = document.getElementById('product-image-url').value;
    }
    
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return;
    
    products[productIndex] = {
        ...products[productIndex],
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        image: imageUrl
    };
    
    saveProducts();
    loadProducts();
    loadAdminPanel();
    showNotification('Produto atualizado com sucesso!');
}
