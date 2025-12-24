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
const cartCloseBtn = document.getElementById('cartCloseBtn');
const cartDrawerContent = document.getElementById('cartDrawerContent');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const shippingText = document.getElementById('shippingText');
const shippingBarFill = document.getElementById('shippingBarFill');
const checkoutBtn = document.getElementById('checkoutBtn');
const stickyAddToCart = document.querySelector('.sticky-add-to-cart');

// ===== CART FUNCTIONALITY =====
let cart = [];
const FREE_SHIPPING_THRESHOLD = 49;

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
    
    // Render cart items
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
                    <img src="https://infinitekorea.fr/wp-content/uploads/2025/10/vt-pdrn-capsule-cream-100-50ml-713.jpg" alt="${item.name}">
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
        
        // Add event listeners to cart item buttons
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
    
    // Update total
    cartTotalPrice.textContent = `${total.toFixed(2).replace('.', ',')} EUR €`;
    
    // Update free shipping progress
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
    const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
    
    if (remaining > 0) {
        shippingText.innerHTML = `PLUS QUE <strong>${remaining.toFixed(2).replace('.', ',')}€</strong> POUR LA LIVRAISON OFFERTE`;
    } else {
        shippingText.innerHTML = `🎉 <strong>LIVRAISON OFFERTE !</strong>`;
    }
    shippingBarFill.style.width = `${progress}%`;
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

function addToCart(productId, productName, productPrice, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ 
            id: productId, 
            name: productName,
            price: productPrice,
            quantity: quantity 
        });
    }
    
    updateCartCount();
    openCartDrawer();
}

// Cart drawer events
if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);
if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);

// Main add to cart button
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(qtyInput?.value || 1);
        addToCart(1, 'PDRN Capsule Cream 100', 34.99, quantity);
    });
}

// Sticky add to cart button
if (stickyAddToCart) {
    stickyAddToCart.addEventListener('click', () => {
        addToCart(1, 'PDRN Capsule Cream 100', 34.99, 1);
    });
}

// Checkout button
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Redirection vers le paiement...');
            // Here you would redirect to your checkout page
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
        const price = (34.99 * quantity).toFixed(2).replace('.', ',');
        addToCartBtn.textContent = `Ajouter au panier  ${price}�`;
    }
}

// ===== THUMBNAIL GALLERY =====
const mainProductImage = document.getElementById('mainProductImage');
const mainProductVideo = document.getElementById('mainProductVideo');
const mainImageContainer = document.querySelector('.main-image');
let galleryLoopInterval = null;
let currentThumbnailIndex = 0;

function showThumbnail(index) {
    const allThumbnails = document.querySelectorAll('.thumbnail');
    if (allThumbnails.length === 0) return;
    
    // Wrap around
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

function startGalleryLoop() {
    if (galleryLoopInterval) return;
    galleryLoopInterval = setInterval(() => {
        showThumbnail(currentThumbnailIndex + 1);
    }, 1500); // Change image every 1.5 seconds
}

function stopGalleryLoop() {
    if (galleryLoopInterval) {
        clearInterval(galleryLoopInterval);
        galleryLoopInterval = null;
    }
}

// Hover on main image to start loop
if (mainImageContainer) {
    mainImageContainer.addEventListener('mouseenter', startGalleryLoop);
    mainImageContainer.addEventListener('mouseleave', stopGalleryLoop);
}

thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        stopGalleryLoop();
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
    
    // Toggle dropdown on mobile
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
    
    // Close menu when clicking a link (but not dropdown trigger)
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

// ===== NEWSLETTER FORM =====
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const submitBtn = newsletterForm.querySelector('button');
        
        if (emailInput.value) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = ' Inscrit !';
            submitBtn.style.background = '#4db3a0';
            emailInput.value = '';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
            }, 3000);
        }
    });
}

// ===== SALES NOTIFICATIONS =====
const salesNotification = document.getElementById('salesNotification');
if (salesNotification) {
    const buyers = [
        { name: 'Marie de Paris', action: "vient d'acheter ce produit" },
        { name: 'Sophie de Lyon', action: "vient d'acheter ce produit" },
        { name: 'Emma de Marseille', action: "vient d'acheter ce produit" },
        { name: 'Julie de Bordeaux', action: "vient d'acheter ce produit" },
        { name: 'Camille de Toulouse', action: "vient d'acheter ce produit" },
        { name: 'Léa de Nice', action: "vient d'acheter ce produit" },
        { name: 'Chloé de Nantes', action: "vient d'acheter ce produit" }
    ];
    let buyerIndex = 0;

    function showNotification() {
        const buyer = buyers[buyerIndex];
        salesNotification.querySelector('.notification-name').textContent = buyer.name;
        salesNotification.querySelector('.notification-action').textContent = buyer.action;
        salesNotification.classList.add('show');
        
        setTimeout(() => {
            salesNotification.classList.remove('show');
        }, 5000);
        
        buyerIndex = (buyerIndex + 1) % buyers.length;
    }
    
    setTimeout(showNotification, 8000);
    setInterval(showNotification, 35000);
}

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

// Observe elements for animation
document.querySelectorAll('.feature-card, .ingredient-card, .testimonial-card, .routine-step').forEach(el => {
    observer.observe(el);
});

// ===== STICKY CTA FUNCTIONALITY =====
const stickyCta = document.querySelector('.sticky-cta');
const productSection = document.querySelector('.product-section');

if (stickyCta && productSection) {
    window.addEventListener('scroll', () => {
        const productRect = productSection.getBoundingClientRect();
        
        // Show sticky CTA when product section is out of view on mobile
        if (window.innerWidth <= 968) {
            if (productRect.bottom < 0 || productRect.top > window.innerHeight) {
                stickyCta.style.transform = 'translateY(0)';
            } else {
                stickyCta.style.transform = 'translateY(100%)';
            }
        }
    });
    
    // Add click handler for sticky CTA button
    const stickyBtn = stickyCta.querySelector('.btn');
    if (stickyBtn) {
        stickyBtn.addEventListener('click', () => {
            productSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// ===== PROMO POPUP =====
const promoPopup = document.getElementById('promoPopup');
const promoOverlay = document.getElementById('promoOverlay');
const promoClose = document.getElementById('promoClose');
const copyBtn = document.getElementById('copyBtn');
const promoCode = document.getElementById('promoCode');

function showPromoPopup() {
    if (promoPopup && promoOverlay) {
        // Check if popup was already shown in this session
        if (localStorage.getItem('promoShown')) return;
        
        promoPopup.classList.add('active');
        promoOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        localStorage.setItem('promoShown', 'true');
    }
}

// Make closePromoPopup global for onclick
window.closePromoPopup = function() {
    if (promoPopup && promoOverlay) {
        promoPopup.classList.remove('active');
        promoOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Show popup after 12 seconds on page or when user scrolls 50% of page
if (promoPopup) {
    let promoShown = false;
    
    // Time-based trigger (12 seconds)
    setTimeout(() => {
        if (!promoShown && !localStorage.getItem('promoShown')) {
            promoShown = true;
            showPromoPopup();
        }
    }, 12000);
    
    // Scroll-based trigger (50% of page)
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 50 && !promoShown && !localStorage.getItem('promoShown')) {
            promoShown = true;
            showPromoPopup();
        }
    });
}

if (promoClose) promoClose.addEventListener('click', window.closePromoPopup);
if (promoOverlay) promoOverlay.addEventListener('click', window.closePromoPopup);

// Copy promo code
if (copyBtn && promoCode) {
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(promoCode.textContent).then(() => {
            copyBtn.textContent = 'Copié !';
            copyBtn.style.background = '#27ae60';
            setTimeout(() => {
                copyBtn.textContent = 'Copier';
                copyBtn.style.background = '';
            }, 2000);
        });
    });
}

// ===== PRELOADER (Optional) =====
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

// ===== CONSOLE BRANDING =====
console.log('%cNOVA', 'font-size: 48px; font-family: serif; font-weight: bold; color: #4db3a0;');
console.log('%cTeint Glassy - Glass Skin', 'font-size: 14px; color: #6b6b6b;');

