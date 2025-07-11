/**
 * YAKELU INFRAESTRUCTURA - JavaScript Simplificado para Railway
 * ==========================================================
 */

// Variables globales
let isMenuOpen = false;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initCounters();
    initScrollEffects();
    console.log('✅ YAKELU - Sistema iniciado correctamente');
});

// ====================================
// NAVEGACIÓN
// ====================================
function initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Menú móvil
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (isMenuOpen && !navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
    
    // Navegación suave
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                smoothScrollTo(targetElement);
                closeMobileMenu();
            }
        });
    });
    
    // Botón CTA
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                smoothScrollTo(contactSection);
            }
        });
    }
}

function toggleMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    isMenuOpen = !isMenuOpen;
    
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    
    mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen);
}

function closeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    isMenuOpen = false;
    mobileMenuBtn.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
    mobileMenuBtn.setAttribute('aria-expanded', false);
}

function smoothScrollTo(element) {
    const headerHeight = 100;
    const elementPosition = element.offsetTop - headerHeight;
    
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}

// ====================================
// CONTADORES ANIMADOS
// ====================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count) || 0;
    const duration = 2000;
    const step = target / (duration / 50);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Formatear según el tipo
        if (target === 24) {
            element.textContent = current >= target ? '24/7' : Math.floor(current);
        } else if (target >= 100) {
            element.textContent = Math.floor(current) + '+';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 50);
}

// ====================================
// EFECTOS DE SCROLL
// ====================================
function initScrollEffects() {
    // Sección activa en navegación
    window.addEventListener('scroll', throttle(updateActiveSection, 100));
    
    // Animaciones al aparecer
    const animatedElements = document.querySelectorAll('.service-card, .value-item, .timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ====================================
// UTILIDADES
// ====================================
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ====================================
// INICIALIZACIÓN GLOBAL
// ====================================
window.addEventListener('load', function() {
    // Asegurar que todo esté cargado
    document.body.classList.add('loaded');
    
    // Mostrar mensaje de confirmación en consola
    console.log('🚀 YAKELU INFRAESTRUCTURA - Sitio web cargado completamente');
});

// Manejar errores globales
window.addEventListener('error', function(e) {
    console.error('Error en el sitio:', e.error);
});

// Export para uso externo si es necesario
window.YakeluApp = {
    toggleMobileMenu,
    closeMobileMenu,
    smoothScrollTo
};