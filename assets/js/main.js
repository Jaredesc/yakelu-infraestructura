/**
 * YAKELU INFRAESTRUCTURA - JavaScript Optimizado
 * =============================================
 */

// Configuration
const CONFIG = {
    animationDuration: 600,
    scrollOffset: 100,
    counters: {
        duration: 2000,
        step: 50
    },
    loading: {
        minDuration: 1000,
        fadeOutDuration: 500
    }
};

// State Management
const state = {
    isLoading: true,
    currentSection: 'home',
    countersAnimated: false,
    isMenuOpen: false,
    lastScrollY: 0,
    isScrolling: false
};

// Utility Functions
const utils = {
    // Throttle function for performance
    throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Get element position relative to viewport
    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top,
            bottom: rect.bottom,
            isVisible: rect.top < window.innerHeight && rect.bottom > 0
        };
    },

    // Smooth scroll to element
    scrollToElement(element, offset = CONFIG.scrollOffset) {
        const elementPosition = element.offsetTop - offset;
        state.isScrolling = true;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
        
        // Reset scrolling state after animation
        setTimeout(() => {
            state.isScrolling = false;
        }, 1000);
    },

    // Format numbers with animation
    animateNumber(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / CONFIG.counters.step);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            
            // Handle special cases for stats
            const suffix = element.dataset.suffix || '';
            const prefix = element.dataset.prefix || '';
            
            if (end === 24) {
                element.textContent = current >= end ? '24/7' : Math.floor(current);
            } else if (end >= 100) {
                element.textContent = prefix + Math.floor(current) + '+' + suffix;
            } else {
                element.textContent = prefix + Math.floor(current) + suffix;
            }
        }, CONFIG.counters.step);
    },

    // Check if element is in viewport
    isInViewport(element, threshold = 0.1) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top <= windowHeight * (1 - threshold) &&
            rect.bottom >= windowHeight * threshold &&
            rect.left <= windowWidth &&
            rect.right >= 0
        );
    }
};

// Loading Screen Management
const loadingManager = {
    init() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.hideLoading();
    },

    hideLoading() {
        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.style.opacity = '0';
                this.loadingScreen.style.visibility = 'hidden';
                state.isLoading = false;
                
                // Initialize other components after loading
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                    document.body.classList.add('loaded');
                }, CONFIG.loading.fadeOutDuration);
            }
        }, CONFIG.loading.minDuration);
    }
};

// Navigation Management
const navigation = {
    init() {
        this.header = document.getElementById('header');
        this.mobileMenuBtn = document.querySelector('.mobile-menu');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.navBrand = document.querySelector('.nav-brand');
        
        this.bindEvents();
        this.handleActiveSection();
    },

    bindEvents() {
        // Mobile menu toggle
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Brand link
        if (this.navBrand) {
            this.navBrand.addEventListener('click', (e) => this.handleNavClick(e));
        }

        // Header scroll effect
        window.addEventListener('scroll', utils.throttle(() => this.handleScroll(), 10));

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => this.handleOutsideClick(e));

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', utils.debounce(() => {
            if (window.innerWidth > 768 && state.isMenuOpen) {
                this.closeMobileMenu();
            }
        }, 250));
    },

    toggleMobileMenu() {
        state.isMenuOpen = !state.isMenuOpen;
        
        this.mobileMenuBtn.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
        
        // Accessibility
        this.mobileMenuBtn.setAttribute('aria-expanded', state.isMenuOpen);
        
        // Focus management
        if (state.isMenuOpen) {
            this.navLinks[0]?.focus();
        }
    },

    closeMobileMenu() {
        state.isMenuOpen = false;
        this.mobileMenuBtn.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
        this.mobileMenuBtn.setAttribute('aria-expanded', false);
    },

    handleNavClick(e) {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            const targetSection = document.querySelector(href);
            if (targetSection) {
                utils.scrollToElement(targetSection);
                this.closeMobileMenu();
                
                // Analytics tracking
                if (typeof analytics !== 'undefined' && analytics.trackEvent) {
                    analytics.trackEvent('Navigation Click', {
                        destination: href
                    });
                }
            }
        }
    },

    handleScroll() {
        if (state.isScrolling) return;
        
        const currentScrollY = window.scrollY;
        
        // Solo actualizar sección activa, sin cambios de header
        this.updateActiveSection();
        
        state.lastScrollY = currentScrollY;
    },

    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionHeight = rect.height;
            const sectionTop = rect.top;
            
            // Check if section is in the center of viewport
            if (sectionTop <= window.innerHeight / 2 && 
                sectionTop + sectionHeight > window.innerHeight / 2) {
                current = section.getAttribute('id');
            }
        });

        if (current && current !== state.currentSection) {
            state.currentSection = current;
            this.updateActiveNavLink(current);
        }
    },

    updateActiveNavLink(currentSection) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    },

    handleActiveSection() {
        this.updateActiveSection();
    },

    handleOutsideClick(e) {
        if (state.isMenuOpen && 
            !this.navMenu.contains(e.target) && 
            !this.mobileMenuBtn.contains(e.target)) {
            this.closeMobileMenu();
        }
    }
};

// Statistics Counter Animation
const statsCounter = {
    init() {
        this.counters = document.querySelectorAll('.stat-number');
        this.observeCounters();
    },

    observeCounters() {
        if (!this.counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !state.countersAnimated) {
                    this.animateCounters();
                    state.countersAnimated = true;
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });

        this.counters.forEach(counter => observer.observe(counter));
    },

    animateCounters() {
        this.counters.forEach((counter, index) => {
            setTimeout(() => {
                const target = parseInt(counter.dataset.count) || 0;
                utils.animateNumber(counter, 0, target, CONFIG.counters.duration);
                counter.classList.add('counting');
            }, index * 200);
        });
    }
};

// Form Management
const formManager = {
    init() {
        this.contactForm = document.getElementById('contact-form');
        if (this.contactForm) {
            this.bindEvents();
        }
    },

    bindEvents() {
        this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearErrors(e.target));
            
            // Add focus enhancement
            input.addEventListener('focus', (e) => {
                e.target.parentNode.classList.add('focused');
            });
            
            input.addEventListener('blur', (e) => {
                if (!e.target.value) {
                    e.target.parentNode.classList.remove('focused');
                }
            });
        });
    },

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showError('Por favor, corrige los errores en el formulario.');
            return;
        }

        const submitBtn = this.contactForm.querySelector('.submit-btn');
        const originalHTML = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        try {
            const formData = new FormData(this.contactForm);
            
            // Add timestamp and user agent for better tracking
            formData.append('timestamp', new Date().toISOString());
            formData.append('user_agent', navigator.userAgent);
            
            const response = await fetch(this.contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                this.showSuccess();
                this.contactForm.reset();
                
                // Reset form focus states
                const formGroups = this.contactForm.querySelectorAll('.form-group');
                formGroups.forEach(group => group.classList.remove('focused'));
                
                // Analytics tracking
                if (typeof analytics !== 'undefined' && analytics.trackEvent) {
                    analytics.trackEvent('Form Submit', {
                        form_id: 'contact-form',
                        success: true
                    });
                }
            } else {
                throw new Error('Error en el servidor');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente o contáctanos directamente.');
            
            // Analytics tracking for errors
            if (typeof analytics !== 'undefined' && analytics.trackEvent) {
                analytics.trackEvent('Form Submit', {
                    form_id: 'contact-form',
                    success: false,
                    error: error.message
                });
            }
        } finally {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    },

    validateForm() {
        const requiredFields = this.contactForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    },

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearErrors(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'Este campo es obligatorio';
            isValid = false;
        }
        // Email validation
        else if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Por favor, ingresa un email válido';
                isValid = false;
            }
        }
        // Phone validation
        else if (fieldName === 'telefono' && value) {
            const phoneRegex = /^[\+]?[\s\-\(\)]*([0-9][\s\-\(\)]*){10,}$/;
            if (!phoneRegex.test(value)) {
                errorMessage = 'Por favor, ingresa un teléfono válido';
                isValid = false;
            }
        }
        // Name validation
        else if (fieldName === 'nombre' && value) {
            if (value.length < 2) {
                errorMessage = 'El nombre debe tener al menos 2 caracteres';
                isValid = false;
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    },

    showFieldError(field, message) {
        field.classList.add('error');
        field.parentNode.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        
        // Scroll to first error if field is not visible
        if (!utils.isInViewport(field)) {
            setTimeout(() => {
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    },

    clearErrors(field) {
        field.classList.remove('error');
        field.parentNode.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    },

    showSuccess() {
        this.showNotification(
            '¡Mensaje enviado exitosamente! Te contactaremos pronto.', 
            'success'
        );
    },

    showError(message) {
        this.showNotification(message, 'error');
    },

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            this.removeNotification(notification);
        });

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" aria-label="Cerrar notificación">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            background: type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: '10000',
            maxWidth: '400px',
            minWidth: '300px',
            animation: 'slideInRight 0.3s ease forwards',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
        });

        // Add to DOM
        document.body.appendChild(notification);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.removeNotification(notification));

        // Auto remove after 5 seconds
        setTimeout(() => this.removeNotification(notification), 5000);
    },

    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }
};

// Back to Top Button
const backToTop = {
    init() {
        this.button = document.getElementById('back-to-top');
        if (this.button) {
            this.bindEvents();
        }
    },

    bindEvents() {
        this.button.addEventListener('click', () => this.scrollToTop());
        window.addEventListener('scroll', utils.throttle(() => this.handleScroll(), 100));
    },

    handleScroll() {
        if (window.scrollY > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    },

    scrollToTop() {
        utils.scrollToElement(document.body, 0);
    }
};

// Performance Optimizations
const performance = {
    init() {
        this.optimizeImages();
        this.addIntersectionObserver();
        this.optimizeAnimations();
    },

    optimizeImages() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window && images.length > 0) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    },

    addIntersectionObserver() {
        // Animate elements when they come into view
        const animatedElements = document.querySelectorAll(
            '.service-card, .value-item, .timeline-item, .stat-item'
        );

        if ('IntersectionObserver' in window && animatedElements.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => observer.observe(el));
        }
    },

    optimizeAnimations() {
        // Reduce animations for users who prefer reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--transition-duration', '0.01ms');
        }
    }
};

// Error Handling
const errorHandler = {
    init() {
        window.addEventListener('error', (e) => this.handleError(e));
        window.addEventListener('unhandledrejection', (e) => this.handlePromiseRejection(e));
    },

    handleError(error) {
        console.error('JavaScript Error:', error);
        // In production, send to error tracking service
    },

    handlePromiseRejection(event) {
        console.error('Unhandled Promise Rejection:', event.reason);
        // In production, send to error tracking service
    }
};

// Main Application Class
class YakeluApp {
    constructor() {
        this.modules = [
            loadingManager,
            navigation,
            statsCounter,
            formManager,
            backToTop,
            performance,
            errorHandler
        ];
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeModules());
        } else {
            this.initializeModules();
        }
    }

    initializeModules() {
        try {
            this.modules.forEach(module => {
                if (typeof module.init === 'function') {
                    module.init();
                }
            });

            this.addGlobalEventListeners();
            this.addCustomStyles();
            
            console.log('🚀 YAKELU INFRAESTRUCTURA - Website initialized successfully');
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    }

    addGlobalEventListeners() {
        // Handle external links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[target="_blank"]')) {
                // Add rel="noopener noreferrer" for security
                if (!e.target.rel.includes('noopener')) {
                    e.target.rel += ' noopener noreferrer';
                }
            }
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            formManager.showNotification('Conexión restablecida', 'success');
        });

        window.addEventListener('offline', () => {
            formManager.showNotification(
                'Sin conexión a internet. Algunas funciones pueden no estar disponibles.', 
                'error'
            );
        });

        // Add touch support for iOS
        document.addEventListener('touchstart', () => {}, { passive: true });
    }

    addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Animation keyframes */
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @keyframes fadeInUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            /* Loading screen styles */
            .loading-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                transition: opacity 0.5s ease, visibility 0.5s ease;
            }
            
            .loading-spinner {
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            
            .loading-logo {
                width: 120px;
                height: auto;
                margin-bottom: 30px;
                filter: brightness(0) invert(1);
                display: block;
                margin-left: auto;
                margin-right: auto;
                animation: pulse 2s ease-in-out infinite;
            }
            
            .spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255,255,255,0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Enhanced form styles */
            .form-group {
                position: relative;
                margin-bottom: 1.5rem;
            }
            
            .form-group.error input,
            .form-group.error textarea {
                border-color: #ef4444;
                box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
            }
            
            .error-message {
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
            
            .error-message::before {
                content: "⚠";
                font-size: 1rem;
            }
            
            #header {
                transition: all 0.3s ease;
            }
            
            #header.scrolled {
                background: rgba(45, 90, 107, 0.95);
                backdrop-filter: blur(10px);
                box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            }
            
            /* Animate elements */
            .animate-in {
                animation: fadeInUp 0.6s ease forwards;
            }
            
            /* Back to top button */
            .back-to-top {
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: var(--secondary-color);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            }
            
            .back-to-top.visible {
                opacity: 1;
                visibility: visible;
            }
            
            .back-to-top:hover {
                background: #d35400;
                transform: translateY(-2px);
            }
            
            /* WhatsApp button enhancements */
            .whatsapp-float {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.3s ease;
            }
            
            .whatsapp-float:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 25px rgba(37, 211, 102, 0.6);
            }
            
            /* Brand text styling */
            .brand-text {
                display: flex;
                flex-direction: column;
                line-height: 1;
            }
            
            .brand-main {
                font-size: 1.2em;
                font-weight: 700;
            }
            
            .brand-sub {
                font-size: 0.8em;
                font-weight: 500;
                opacity: 0.9;
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
                .loading-logo {
                    width: 60px;
                }
                
                .back-to-top {
                    bottom: 70px;
                    right: 15px;
                    width: 45px;
                    height: 45px;
                }
                
                .whatsapp-text {
                    display: none;
                }
                
                .brand-text {
                    display: none;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Initialize the application
const app = new YakeluApp();
app.init();

// Export for external access
window.YakeluApp = app;