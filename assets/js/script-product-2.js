// ===== DOM ELEMENTS =====
const cartBtn = document.querySelector('.cart-btn');
const cartCount = document.querySelector('.cart-count');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navbar = document.querySelector('.navbar');
const addToCartBtn = document.querySelector('.add-to-cart-btn');
const qtyInput = document.querySelector('.qty-input');
const qtyMinusBtn = document.querySelector('.qty-btn.minus');
const qtyPlusBtn = document.querySelector('.qty-btn.plus');
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.querySelector('.main-image img');

// Cart Drawer Elements
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartCloseBtn = document.getElementById('cartClose');
const cartDrawerContent = document.getElementById('cartDrawerContent');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');
const stickyAddToCart = document.querySelector('.sticky-add-to-cart');

// ===== CART FUNCTIONALITY =====
let cart = [];

function openCartDrawer() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCartDrawer();
}

function closeCartDrawer() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
    }, 200);
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function renderCartDrawer() {
    const total = getCartTotal();
    
    if (cart.length === 0) {
        cartDrawerContent.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <p>Votre panier est vide</p>
            </div>
        `;
    } else {
        cartDrawerContent.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <a href="#" class="cart-item-name">${item.name}</a>
                    <span class="cart-item-price">${item.price.toFixed(2).replace('.', ',')}€</span>
                    <div class="cart-item-quantity">
                        <button class="cart-qty-btn minus" data-id="${item.id}">−</button>
                        <input type="text" class="cart-qty-input" value="${item.quantity}" readonly>
                        <button class="cart-qty-btn plus" data-id="${item.id}">+</button>
                        <button class="cart-item-delete" data-id="${item.id}">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <span class="cart-item-total">${(item.price * item.quantity).toFixed(2).replace('.', ',')}€</span>
            </div>
        `).join('');
        
        cartDrawerContent.querySelectorAll('.cart-qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', () => updateCartItemQuantity(parseInt(btn.dataset.id), -1));
        });
        cartDrawerContent.querySelectorAll('.cart-qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', () => updateCartItemQuantity(parseInt(btn.dataset.id), 1));
        });
        cartDrawerContent.querySelectorAll('.cart-item-delete').forEach(btn => {
            btn.addEventListener('click', () => removeCartItem(parseInt(btn.dataset.id)));
        });
    }
    
    cartTotalPrice.textContent = `${total.toFixed(2).replace('.', ',')} EUR €`;
}

function updateCartItemQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeCartItem(itemId);
        } else {
            updateCartCount();
            renderCartDrawer();
        }
    }
}

function removeCartItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartCount();
    renderCartDrawer();
}

function addToCart(productId, productName, productPrice, quantity = 1, productImage = '') {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ 
            id: productId, 
            name: productName,
            price: productPrice,
            quantity: quantity,
            image: productImage
        });
    }
    
    updateCartCount();
    openCartDrawer();
}

// Cart drawer events
if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);
if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);

// Main add to cart button - PRODUCT 2: Vita C Collagen Cream
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(qtyInput?.value || 1);
        addToCart(2, 'Vita C Collagen Cream', 19.99, quantity, 'assets/images/produit%202/S0f86d7e353f6494e8389df31299e6eb5a.jpg_960x960q75.jpg_.png');
    });
}

// Sticky add to cart button
if (stickyAddToCart) {
    stickyAddToCart.addEventListener('click', () => {
        addToCart(2, 'Vita C Collagen Cream', 19.99, 1, 'assets/images/produit%202/S0f86d7e353f6494e8389df31299e6eb5a.jpg_960x960q75.jpg_.png');
    });
}

// Checkout button
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Redirection vers le paiement...');
        }
    });
}

// ===== QUANTITY CONTROLS =====
if (qtyMinusBtn && qtyPlusBtn && qtyInput) {
    qtyMinusBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
            updateAddToCartPrice();
        }
    });

    qtyPlusBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue < 10) {
            qtyInput.value = currentValue + 1;
            updateAddToCartPrice();
        }
    });

    qtyInput.addEventListener('change', () => {
        let value = parseInt(qtyInput.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 10) value = 10;
        qtyInput.value = value;
        updateAddToCartPrice();
    });
}

function updateAddToCartPrice() {
    if (addToCartBtn && qtyInput) {
        const quantity = parseInt(qtyInput.value);
        const price = (19.99 * quantity).toFixed(2).replace('.', ',');
        addToCartBtn.textContent = `\u{1F6D2} COMMANDER \u2014 ${price}\u20AC`;
    }
}

// ===== THUMBNAIL GALLERY =====
const mainProductImage = document.getElementById('mainProductImage');
const mainProductVideo = document.getElementById('mainProductVideo');
let currentThumbnailIndex = 0;

function showThumbnail(index) {
    const allThumbnails = document.querySelectorAll('.thumbnail');
    if (allThumbnails.length === 0) return;
    
    if (index >= allThumbnails.length) index = 0;
    if (index < 0) index = allThumbnails.length - 1;
    currentThumbnailIndex = index;
    
    const thumbnail = allThumbnails[index];
    allThumbnails.forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
    
    const type = thumbnail.dataset.type;
    const src = thumbnail.dataset.src;
    
    if (type === 'video') {
        if (mainProductImage) mainProductImage.style.display = 'none';
        if (mainProductVideo) {
            mainProductVideo.src = src;
            mainProductVideo.style.display = 'block';
            mainProductVideo.play();
        }
    } else {
        if (mainProductVideo) {
            mainProductVideo.pause();
            mainProductVideo.style.display = 'none';
        }
        if (mainProductImage) {
            mainProductImage.style.display = 'block';
            mainProductImage.src = src;
        }
    }
}

thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        showThumbnail(index);
    });
});

// ===== MOBILE MENU =====
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    const navDropdown = navLinks.querySelector('.nav-dropdown');
    const dropdownTrigger = navLinks.querySelector('.nav-dropdown-trigger');
    
    if (dropdownTrigger && navDropdown) {
        dropdownTrigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 968) {
                e.preventDefault();
                navDropdown.classList.toggle('open');
            }
        });
    }
    
    navLinks.querySelectorAll('a:not(.nav-dropdown-trigger)').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            if (navDropdown) navDropdown.classList.remove('open');
        });
    });
}

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .ingredient-card, .testimonial-card, .routine-step').forEach(el => {
    observer.observe(el);
});

// ===== STICKY CTA FUNCTIONALITY =====
const stickyCta = document.querySelector('.sticky-cta');
const productSection = document.querySelector('.product-section');

if (stickyCta) {
    let stickyCtaVisible = false;
    let stickyCtaManuallyHidden = false;
    let lastScrollY = window.scrollY;
    let touchStartY = 0;
    let touchEndY = 0;
    const swipeThreshold = 50; // Minimum swipe distance
    const scrollThreshold = 10; // Minimum scroll to trigger
    
    // Function to show sticky CTA with animation
    function showStickyCta() {
        if (!stickyCtaVisible && !stickyCtaManuallyHidden) {
            stickyCtaVisible = true;
            stickyCta.classList.remove('hidden');
            stickyCta.classList.add('visible');
        }
    }
    
    // Function to hide sticky CTA with animation
    function hideStickyCta() {
        if (stickyCtaVisible) {
            stickyCtaVisible = false;
            stickyCta.classList.remove('visible');
            stickyCta.classList.add('hidden');
        }
    }
    
    // Scroll event - show on scroll down, hide on scroll up
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;
        
        if (window.innerWidth <= 968) {
            // Scrolling down - show CTA immediately
            if (scrollDelta > scrollThreshold && currentScrollY > 50) {
                stickyCtaManuallyHidden = false;
                showStickyCta();
            }
            // Scrolling up - hide CTA
            else if (scrollDelta < -scrollThreshold) {
                hideStickyCta();
                stickyCtaManuallyHidden = true;
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Touch events for swipe detection on mobile
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        if (window.innerWidth > 968) return;
        
        touchEndY = e.changedTouches[0].screenY;
        const swipeDistance = touchStartY - touchEndY;
        
        // Swipe up (finger moves up) - hide CTA
        if (swipeDistance > swipeThreshold) {
            hideStickyCta();
            stickyCtaManuallyHidden = true;
        }
        // Swipe down (finger moves down) - show CTA
        else if (swipeDistance < -swipeThreshold) {
            stickyCtaManuallyHidden = false;
            showStickyCta();
        }
    }, { passive: true });
    
    const stickyBtn = stickyCta.querySelector('.btn');
    if (stickyBtn && productSection) {
        stickyBtn.addEventListener('click', () => {
            productSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// ===== PRELOADER =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===== IMAGE LIGHTBOX FOR REVIEWS =====
function initReviewLightbox() {
    // Create lightbox elements if they don't exist
    if (!document.getElementById('reviewLightbox')) {
        const lightboxHTML = `
            <div class="review-lightbox" id="reviewLightbox">
                <div class="lightbox-overlay"></div>
                <div class="lightbox-content">
                    <button class="lightbox-close">&times;</button>
                    <img src="" alt="Avis client" id="lightboxImage">
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }
    
    const lightbox = document.getElementById('reviewLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    
    // Add click event to all review images
    const reviewImages = document.querySelectorAll('.review-image img, .photo-review img');
    reviewImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            lightboxImage.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Initialize lightbox when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReviewLightbox);
} else {
    initReviewLightbox();
}

// ===== PRODUCT ACCORDIONS =====
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close all accordions
        document.querySelectorAll('.accordion-item').forEach(acc => {
            acc.classList.remove('active');
        });
        
        // Open clicked one if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== CONSOLE BRANDING =====
console.log('%cNYVEX', 'font-size: 48px; font-family: serif; font-weight: bold; color: #d4a853;');
console.log('%cVita C Collagen Cream - Glass Skin', 'font-size: 14px; color: #6b6b6b;');

// ===== REVIEW FORM =====
function toggleReviewForm() {
    const container = document.getElementById('reviewFormContainer');
    if (container) {
        if (container.style.display === 'none') {
            container.style.display = 'block';
            container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            container.style.display = 'none';
        }
    }
}

function previewPhoto(input) {
    const preview = document.getElementById('photoPreview');
    const placeholder = document.getElementById('uploadPlaceholder');
    const previewImg = document.getElementById('previewImg');
    
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Vérifier la taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('La photo est trop volumineuse. Maximum 5MB.');
            input.value = '';
            return;
        }
        
        // Vérifier le type
        if (!file.type.startsWith('image/')) {
            alert('Veuillez sélectionner une image valide.');
            input.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

function removePhoto() {
    const input = document.getElementById('reviewPhoto');
    const preview = document.getElementById('photoPreview');
    const placeholder = document.getElementById('uploadPlaceholder');
    
    input.value = '';
    preview.style.display = 'none';
    placeholder.style.display = 'flex';
}

function validateReviewForm(event) {
    const orderNumber = document.getElementById('orderNumber').value.trim();
    const reviewText = document.getElementById('reviewText').value.trim();
    const rating = document.querySelector('input[name="rating"]:checked');
    
    // Vérifier le numéro de commande
    if (orderNumber.length < 5) {
        alert('Veuillez entrer un numéro de commande ou de suivi valide.');
        event.preventDefault();
        return false;
    }
    
    // Vérifier la note
    if (!rating) {
        alert('Veuillez sélectionner une note.');
        event.preventDefault();
        return false;
    }
    
    // Vérifier l'avis
    if (reviewText.length < 20) {
        alert('Votre avis doit contenir au moins 20 caractères.');
        event.preventDefault();
        return false;
    }
    
    // Google Analytics event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'review_submitted', {
            rating: rating.value,
            order_number: orderNumber.substring(0, 3) + '***',
            has_photo: document.getElementById('reviewPhoto').files.length > 0 ? 'yes' : 'no'
        });
    }
    
    return true;
}






