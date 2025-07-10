/**
 * YAKELU INFRAESTRUCTURA - Enhanced JavaScript
 * ==========================================
 */

// Configuration
const CONFIG = {
    animationDuration: 600,
    scrollOffset: 80,
    counters: {
        duration: 2000,
        step: 50
    },
    loading: {
        minDuration: 1500,
        fadeOutDuration: 500
    }
};

// State Management
const state = {
    isLoading: true,
    currentSection: 'home',
    countersAnimated: false,
    isMenuOpen: false,
    lastScrollY: 0
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
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
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
    }
};

// Loading Screen Management
const loadingManager = {
    init() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.hideLoading();
    },

    hideLoading() {
        // Ensure minimum loading time for better UX
        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.classList.add('hidden');
                state.isLoading = false;
                
                // Initialize animations after loading
                setTimeout(() => {
                    AOS.init({
                        duration: CONFIG.animationDuration,
                        once: true,
                        offset: 100,
                        easing: 'ease-out-cubic'
                    });
                }, CONFIG.loading.fadeOutDuration);
            }
        }, CONFIG.loading.minDuration);
    }
};

// Navigation Management
const navigation = {
    init() {
        this.header = document.getElementById('header');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a');
        
        this.bindEvents();
        this.handleActiveSection();
    },

    bindEvents() {
        // Mobile menu toggle
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

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
    },

    toggleMobileMenu() {
        state.isMenuOpen = !state.isMenuOpen;
        this.mobileMenuBtn.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
        
        // Accessibility
        this.mobileMenuBtn.setAttribute('aria-expanded', state.isMenuOpen);
    },

    closeMobileMenu() {
        state.isMenuOpen = false;
        this.mobileMenuBtn.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
        this.mobileMenuBtn.setAttribute('aria-expanded', false);
    },

    handleNavClick(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        
        if (href.startsWith('#')) {
            const targetSection = document.querySelector(href);
            if (targetSection) {
                utils.scrollToElement(targetSection);
                this.closeMobileMenu();
            }
        }
    },

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Header background effect
        if (currentScrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        // Update active section
        this.updateActiveSection();
        
        state.lastScrollY = currentScrollY;
    },

    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= CONFIG.scrollOffset && rect.bottom >= CONFIG.scrollOffset) {
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
        // Set initial active section based on scroll position
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
        this.counters.forEach(counter => {
            const target = parseInt(counter.dataset.count) || 0;
            utils.animateNumber(counter, 0, target, CONFIG.counters.duration);
        });
    }
};

// Projects Filter
const projectsFilter = {
    init() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        
        this.bindEvents();
    },

    bindEvents() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
    },

    handleFilter(e) {
        const filterValue = e.target.dataset.filter;
        
        // Update active button
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter projects
        this.projectCards.forEach(card => {
            if (filterValue === 'all' || card.classList.contains(filterValue)) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
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
        });
    },

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const submitBtn = this.contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(this.contactForm);
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
            } else {
                throw new Error('Error en el servidor');
            }
        } catch (error) {
            this.showError('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
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

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    },

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.color = 'var(--error-color)';
        errorElement.style.fontSize = '0.9rem';
        errorElement.style.marginTop = '0.5rem';
    },

    clearErrors(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    },

    showSuccess() {
        this.showNotification('¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'success');
    },

    showError(message) {
        this.showNotification(message, 'error');
    },

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Cerrar">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            background: type === 'success' ? 'var(--success-color)' : 'var(--error-color)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow-heavy)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease forwards'
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
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

// Performance Optimizations
const performance = {
    init() {
        this.preloadCriticalResources();
        this.lazyLoadImages();
        this.optimizeAnimations();
    },

    preloadCriticalResources() {
        // Preload critical fonts and images
        const criticalResources = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            link.href = resource;
            document.head.appendChild(link);
        });
    },

    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    },

    optimizeAnimations() {
        // Reduce animations for users who prefer reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduce-motion');
        }
    }
};

// Analytics and Tracking
const analytics = {
    init() {
        this.trackUserInteractions();
        this.trackScrollDepth();
    },

    trackUserInteractions() {
        // Track CTA button clicks
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('click', () => {
                this.trackEvent('CTA Click', {
                    button_text: button.textContent.trim(),
                    button_location: this.getElementLocation(button)
                });
            });
        });

        // Track form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                this.trackEvent('Form Submit', {
                    form_id: form.id || 'unknown'
                });
            });
        });

        // Track navigation clicks
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('Navigation Click', {
                    destination: link.getAttribute('href')
                });
            });
        });
    },

    trackScrollDepth() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 100];
        const tracked = [];

        window.addEventListener('scroll', utils.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                milestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !tracked.includes(milestone)) {
                        tracked.push(milestone);
                        this.trackEvent('Scroll Depth', {
                            percentage: milestone
                        });
                    }
                });
            }
        }, 500));
    },

    trackEvent(eventName, properties = {}) {
        // Send to analytics service (Google Analytics, etc.)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Console log for development
        console.log(`Analytics Event: ${eventName}`, properties);
    },

    getElementLocation(element) {
        const section = element.closest('section');
        return section ? section.id : 'unknown';
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
        // Send to error tracking service
        this.reportError(error);
    },

    handlePromiseRejection(event) {
        console.error('Unhandled Promise Rejection:', event.reason);
        this.reportError(event.reason);
    },

    reportError(error) {
        // Send to error tracking service (Sentry, LogRocket, etc.)
        // For now, just log to console
        console.error('Error reported:', error);
    }
};

// Accessibility Enhancements
const accessibility = {
    init() {
        this.enhanceKeyboardNavigation();
        this.addSkipLink();
        this.improveScreenReaderSupport();
    },

    enhanceKeyboardNavigation() {
        // Add visible focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Trap focus in mobile menu
        const mobileMenu = document.querySelector('.nav-menu');
        if (mobileMenu) {
            mobileMenu.addEventListener('keydown', (e) => {
                if (e.key === 'Tab' && state.isMenuOpen) {
                    this.trapFocus(e, mobileMenu);
                }
            });
        }
    },

    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
        }
    },

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Saltar al contenido principal';
        skipLink.className = 'skip-link';
        
        // Add styles for skip link
        Object.assign(skipLink.style, {
            position: 'absolute',
            top: '-40px',
            left: '6px',
            background: 'var(--primary-color)',
            color: 'white',
            padding: '8px',
            textDecoration: 'none',
            borderRadius: '0 0 4px 4px',
            zIndex: '10001'
        });

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    },

    improveScreenReaderSupport() {
        // Add aria-live regions for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        
        Object.assign(liveRegion.style, {
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: '0',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap',
            border: '0'
        });

        document.body.appendChild(liveRegion);

        // Announce page changes
        window.addEventListener('popstate', () => {
            this.announcePageChange();
        });
    },

    announcePageChange() {
        const liveRegion = document.getElementById('live-region');
        const currentSection = document.querySelector(`#${state.currentSection}`);
        const heading = currentSection ? currentSection.querySelector('h2') : null;
        
        if (liveRegion && heading) {
            liveRegion.textContent = `Navegaste a la sección: ${heading.textContent}`;
        }
    }
};

// Main Application Initialization
class YakeluApp {
    constructor() {
        this.modules = [
            loadingManager,
            navigation,
            statsCounter,
            projectsFilter,
            formManager,
            backToTop,
            performance,
            analytics,
            errorHandler,
            accessibility
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

            // Add global event listeners
            this.addGlobalEventListeners();
            
            console.log('🚀 YAKELU INFRAESTRUCTURA - Website initialized successfully');
        } catch (error) {
            console.error('Error initializing application:', error);
            errorHandler.reportError(error);
        }
    }

    addGlobalEventListeners() {
        // Handle external links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[target="_blank"]')) {
                // Add analytics tracking for external links
                analytics.trackEvent('External Link Click', {
                    url: e.target.href,
                    text: e.target.textContent.trim()
                });
            }
        });

        // Handle service worker registration for PWA capabilities
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                this.registerServiceWorker();
            });
        }

        // Handle online/offline status
        window.addEventListener('online', () => {
            this.handleConnectionChange(true);
        });

        window.addEventListener('offline', () => {
            this.handleConnectionChange(false);
        });
    }

    async registerServiceWorker() {
        try {
            if ('serviceWorker' in navigator) {
                // Service worker would be registered here for PWA capabilities
                console.log('Service Worker support detected');
            }
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    }

    handleConnectionChange(isOnline) {
        const message = isOnline ? 
            'Conexión restablecida' : 
            'Sin conexión a internet. Algunas funciones pueden no estar disponibles.';
        
        formManager.showNotification(message, isOnline ? 'success' : 'warning');
    }
}

// Initialize the application
const app = new YakeluApp();
app.init();

// Export for external access if needed
window.YakeluApp = app;

// Add CSS animations that couldn't be included in the CSS file
const additionalStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;