// Корзина
let cart = JSON.parse(localStorage.getItem('bookCart')) || [];

// Загрузка книг на страницу
function loadBooks() {
    const container = document.getElementById('books-container');
    container.innerHTML = '';

    books.forEach(book => {
        const bookCard = `
            <div class="book-card" data-genre="${book.genre}" data-price="${book.price}">
                <img src="${book.image}" alt="${book.title}" class="book-image" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDE1MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik03NSA1MEM4Mi4zNjA5IDUwIDg4LjM5MDUgNTUuODIxNCA4OC45MDI0IDYzLjA1MjFDODguOTY4MiA2My44Nzc5IDg5IDY0LjcxMTYgODkgNjUuNUM4OSA3NC4wNjA2IDgxLjg3MjEgODEgNzMgODFDNjQuMTI3OSA4MSA1NyA3NC4wNjA2IDU3IDY1LjVDNTcgNjQuNzExNiA1Ny4wMzE4IDYzLjg3NzkgNTcuMDk3NiA2My4wNTIxQzU3LjYwOTUgNTUuODIxNCA2My42MzkxIDUwIDcxIDUwSDc1Wk03NSA1NEM2Ni4xNjcyIDU0IDU5IDYxLjE2NzIgNTkgNzBDNTkgNzguODMyOCA2Ni4xNjcyIDg2IDc1IDg2QzgzLjgzMjggODYgOTEgNzguODMyOCA5MSA3MEM5MSA2MS4xNjcyIDgzLjgzMjggNTQgNzUgNTRaIiBmaWxsPSIjQ0VDRUNFIi8+Cjx0ZXh0IHg9Ijc1IiB5PSIxMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzlBOUE5QSI+📚 Обложка книгиPC90ZXh0Pgo8L3N2Zz4K'">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <span class="book-genre">${book.genre}</span>
                <div class="book-price">${book.price} руб</div>
                <button class="add-to-cart" onclick="addToCart(${book.id})" 
                        ${!book.inStock ? 'disabled' : ''}>
                    ${book.inStock ? '📖 Добавить в корзину' : '❌ Нет в наличии'}
                </button>
                ${!book.inStock ? '<p style="color: #e74c3c; margin-top: 0.5rem;">Скоро поступит</p>' : ''}
            </div>
        `;
        container.innerHTML += bookCard;
    });
}

// Добавление в корзину
function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    const existingItem = cart.find(item => item.id === bookId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...book,
            quantity: 1
        });
    }

    updateCart();
    saveCartToStorage();
    
    // Анимация добавления
    showNotification(`"${book.title}" добавлена в корзину!`);
}

// Удаление из корзины
function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    updateCart();
    saveCartToStorage();
}

// Изменение количества
function updateQuantity(bookId, change) {
    const item = cart.find(item => item.id === bookId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(bookId);
        } else {
            updateCart();
            saveCartToStorage();
        }
    }
}

// Обновление отображения корзины
function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');

    // Обновляем счетчик
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;

    // Обновляем список товаров
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
    } else {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>${item.author}</p>
                    <p>${item.price} руб × ${item.quantity} = ${item.price * item.quantity} руб</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Удалить</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    // Обновляем итоговую сумму
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = totalPrice;
}

// Сохранение корзины в localStorage
function saveCartToStorage() {
    localStorage.setItem('bookCart', JSON.stringify(cart));
}

// Переключение видимости корзины
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Очистка корзины
function clearCart() {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        cart = [];
        updateCart();
        saveCartToStorage();
    }
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }

    const orderDetails = cart.map(item => 
        `• ${item.title} - ${item.quantity} шт. - ${item.price * item.quantity} руб`
    ).join('\n');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const subject = 'Заказ из книжного магазина "Читай-Город"';
    const body = `Здравствуйте! Хочу сделать заказ:\n\n${orderDetails}\n\nИтого: ${total} руб\n\nМои контакты для связи:\nИмя: \nТелефон: \nАдрес доставки: \n\nСпасибо!`;

    window.location.href = `mailto:orders@read-city.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Очистка корзины после заказа
    cart = [];
    updateCart();
    saveCartToStorage();
    toggleCart();
    
    alert('Спасибо за заказ! Проверьте вашу почту для подтверждения.');
}

// Фильтрация книг
function filterBooks() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const genreFilter = document.getElementById('genre-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    
    const bookCards = document.querySelectorAll('.book-card');
    
    bookCards.forEach(card => {
        const title = card.querySelector('.book-title').textContent.toLowerCase();
        const author = card.querySelector('.book-author').textContent.toLowerCase();
        const genre = card.getAttribute('data-genre');
        const price = parseInt(card.getAttribute('data-price'));
        
        const matchesSearch = title.includes(searchTerm) || author.includes(searchTerm);
        const matchesGenre = !genreFilter || genre === genreFilter;
        const matchesPrice = !priceFilter || checkPriceRange(price, priceFilter);
        
        if (matchesSearch && matchesGenre && matchesPrice) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Проверка ценового диапазона
function checkPriceRange(price, range) {
    const [min, max] = range.split('-').map(Number);
    return price >= min && price <= max;
}

// Показать уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Прокрутка к товарам
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    updateCart();
});
