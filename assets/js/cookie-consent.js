// ===== COOKIE CONSENT RGPD =====
// Gestion du consentement cookies conforme RGPD

window.CookieConsent = {
    preferences: JSON.parse(localStorage.getItem('cookie_consent') || 'null'),
    
    hasConsented: function() {
        return this.preferences !== null;
    },
    
    isAccepted: function(category) {
        return this.preferences && this.preferences[category] === true;
    },
    
    loadAnalytics: function() {
        if (!this.isAccepted('analytics')) return;
        
        // Google Analytics 4
        var gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-4NR312F1LS';
        document.head.appendChild(gaScript);
        
        gaScript.onload = function() {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-4NR312F1LS', { 'anonymize_ip': true });
            
            // Déclencher un event custom pour indiquer que GA est prêt
            window.dispatchEvent(new CustomEvent('analyticsReady'));
        };
        
        // Google Tag Manager
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-M6S8GFCV');
    },
    
    loadMarketing: function() {
        if (!this.isAccepted('marketing')) return;
        
        // Trustpilot
        (function(w,d,s,r,n){w.TrustpilotObject=n;w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)};
            a=d.createElement(s);a.async=1;a.src=r;a.type='text/java'+s;f=d.getElementsByTagName(s)[0];
            f.parentNode.insertBefore(a,f)})(window,document,'script', 'https://invitejs.trustpilot.com/tp.min.js', 'tp');
            tp('register', 'MJDBf0lmngxtGzLU');
    },
    
    savePreferences: function(prefs) {
        this.preferences = prefs;
        localStorage.setItem('cookie_consent', JSON.stringify(prefs));
        localStorage.setItem('cookie_consent_date', new Date().toISOString());
        
        // Charger les scripts selon les préférences
        if (prefs.analytics) this.loadAnalytics();
        if (prefs.marketing) this.loadMarketing();
        
        // Déclencher un event custom
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: prefs }));
    },
    
    acceptAll: function() {
        this.savePreferences({
            necessary: true,
            analytics: true,
            marketing: true
        });
    },
    
    rejectAll: function() {
        this.savePreferences({
            necessary: true,
            analytics: false,
            marketing: false
        });
    },
    
    init: function() {
        if (this.hasConsented()) {
            if (this.isAccepted('analytics')) this.loadAnalytics();
            if (this.isAccepted('marketing')) this.loadMarketing();
        }
    }
};

// Initialiser si déjà consenti
CookieConsent.init();

// ===== UI DU COOKIE BANNER =====
document.addEventListener('DOMContentLoaded', function() {
    // Créer le HTML du banner
    const bannerHTML = `
    <!-- Cookie Consent Banner -->
    <div class="cookie-consent" id="cookieConsent">
        <div class="cookie-consent-container">
            <div class="cookie-content">
                <h4><span>🍪</span> Nous respectons votre vie privée</h4>
                <p>Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. 
                   <a href="/pages/confidentialite.html">En savoir plus</a></p>
            </div>
            <div class="cookie-buttons">
                <button class="cookie-btn cookie-btn-accept" id="cookieAcceptAll">Tout accepter</button>
                <button class="cookie-btn cookie-btn-customize" id="cookieCustomize">Personnaliser</button>
                <button class="cookie-btn cookie-btn-reject" id="cookieRejectAll">Refuser</button>
            </div>
        </div>
    </div>
    
    <!-- Cookie Settings Modal -->
    <div class="cookie-modal-overlay" id="cookieModalOverlay">
        <div class="cookie-modal">
            <div class="cookie-modal-header">
                <h3>Paramètres des cookies</h3>
                <button class="cookie-modal-close" id="cookieModalClose">&times;</button>
            </div>
            <div class="cookie-modal-body">
                <div class="cookie-category">
                    <div class="cookie-category-header">
                        <h4>🔒 Cookies essentiels</h4>
                        <label class="cookie-toggle">
                            <input type="checkbox" checked disabled>
                            <span class="cookie-toggle-slider"></span>
                        </label>
                    </div>
                    <p>Ces cookies sont indispensables au fonctionnement du site (panier, connexion, sécurité). Ils ne peuvent pas être désactivés.</p>
                </div>
                
                <div class="cookie-category">
                    <div class="cookie-category-header">
                        <h4>📊 Cookies analytiques</h4>
                        <label class="cookie-toggle">
                            <input type="checkbox" id="cookieAnalytics">
                            <span class="cookie-toggle-slider"></span>
                        </label>
                    </div>
                    <p>Ces cookies nous permettent de comprendre comment vous utilisez le site (pages visitées, durée des visites) pour améliorer votre expérience. Google Analytics.</p>
                </div>
                
                <div class="cookie-category">
                    <div class="cookie-category-header">
                        <h4>🎯 Cookies marketing</h4>
                        <label class="cookie-toggle">
                            <input type="checkbox" id="cookieMarketing">
                            <span class="cookie-toggle-slider"></span>
                        </label>
                    </div>
                    <p>Ces cookies sont utilisés pour vous proposer des publicités personnalisées et mesurer l'efficacité de nos campagnes. Trustpilot, réseaux sociaux.</p>
                </div>
            </div>
            <div class="cookie-modal-footer">
                <button class="cookie-btn cookie-btn-customize" id="cookieSaveCustom">Enregistrer mes choix</button>
                <button class="cookie-btn cookie-btn-accept" id="cookieAcceptAllModal">Tout accepter</button>
            </div>
        </div>
    </div>`;
    
    // Injecter le HTML
    document.body.insertAdjacentHTML('beforeend', bannerHTML);
    
    // Récupérer les éléments
    const cookieBanner = document.getElementById('cookieConsent');
    const cookieModal = document.getElementById('cookieModalOverlay');
    const analyticsToggle = document.getElementById('cookieAnalytics');
    const marketingToggle = document.getElementById('cookieMarketing');
    
    // Afficher le banner si pas de consentement
    if (!CookieConsent.hasConsented()) {
        setTimeout(function() {
            cookieBanner.classList.add('show');
        }, 1000);
    }
    
    // Restaurer les préférences dans le modal
    if (CookieConsent.preferences) {
        analyticsToggle.checked = CookieConsent.preferences.analytics || false;
        marketingToggle.checked = CookieConsent.preferences.marketing || false;
    }
    
    function hideBanner() {
        cookieBanner.classList.remove('show');
    }
    
    function hideModal() {
        cookieModal.classList.remove('show');
    }
    
    function showModal() {
        cookieModal.classList.add('show');
    }
    
    // Boutons du banner
    document.getElementById('cookieAcceptAll').addEventListener('click', function() {
        CookieConsent.acceptAll();
        hideBanner();
    });
    
    document.getElementById('cookieRejectAll').addEventListener('click', function() {
        CookieConsent.rejectAll();
        hideBanner();
    });
    
    document.getElementById('cookieCustomize').addEventListener('click', function() {
        showModal();
    });
    
    // Boutons du modal
    document.getElementById('cookieModalClose').addEventListener('click', hideModal);
    
    document.getElementById('cookieModalOverlay').addEventListener('click', function(e) {
        if (e.target === this) hideModal();
    });
    
    document.getElementById('cookieAcceptAllModal').addEventListener('click', function() {
        CookieConsent.acceptAll();
        hideBanner();
        hideModal();
    });
    
    document.getElementById('cookieSaveCustom').addEventListener('click', function() {
        CookieConsent.savePreferences({
            necessary: true,
            analytics: analyticsToggle.checked,
            marketing: marketingToggle.checked
        });
        hideBanner();
        hideModal();
    });
    
    // Permettre de rouvrir le modal via un lien
    document.querySelectorAll('[data-cookie-settings]').forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            showModal();
        });
    });
});
