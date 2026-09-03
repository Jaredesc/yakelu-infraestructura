/**
 * YAKELU INFRAESTRUCTURA - JavaScript Completo
 * =============================================
 */

// Variables globales
let isMenuOpen = false;
let mobileMenuBtn = null;
let navMenu = null;

console.log('YAKELU - Iniciando sistema...');

// ====================================
// INICIALIZACIÓN PRINCIPAL
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado - Iniciando componentes...');
    
    initMobileMenu();
    initNavigation();
    initCounters();
    initScrollEffects();
    initNuevoBotónCTA();
    initDownloadButton();
    initBackToTop();
    
    console.log('YAKELU - Sistema iniciado correctamente');
});

// ====================================
// MENÚ MÓVIL - SOLUCIÓN DEFINITIVA
// ====================================
function initMobileMenu() {
    console.log('Inicializando menú móvil...');
    
    mobileMenuBtn = document.querySelector('.mobile-menu');
    navMenu = document.querySelector('.nav-menu');
    
    console.log('- Botón encontrado:', !!mobileMenuBtn);
    console.log('- Menú encontrado:', !!navMenu);
    
    if (!mobileMenuBtn || !navMenu) {
        console.error('Elementos del menú no encontrados');
        return;
    }
    
    // Asegurar que el botón sea clickeable
    mobileMenuBtn.style.pointerEvents = 'auto';
    mobileMenuBtn.style.zIndex = '10001';
    mobileMenuBtn.style.position = 'relative';
    mobileMenuBtn.style.display = 'flex';
    
    console.log('Propiedades del botón aseguradas');
    
    // Event listeners
    mobileMenuBtn.addEventListener('click', handleMenuToggle, true);
    mobileMenuBtn.addEventListener('touchstart', handleMenuToggle, true);
    
    // Fallback onclick directo
    mobileMenuBtn.onclick = handleMenuToggle;
    
    // Cerrar menú al hacer click en links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            console.log('Click en link:', this.textContent);
            if (isMenuOpen) {
                closeMenu();
            }
        });
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function(e) {
        if (isMenuOpen && 
            !navMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            console.log('Click fuera del menú');
            closeMenu();
        }
    });
    
    // Test del botón
    setTimeout(testMobileMenu, 1000);
    
    console.log('Menú móvil inicializado');
}

function handleMenuToggle(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.type === 'touchend' && e.touches && e.touches.length > 0) {
            return;
        }
    }
    
    console.log('Toggle menú. Estado actual:', isMenuOpen);
    
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        openMenu();
    } else {
        closeMenu();
    }
}

function openMenu() {
    console.log('Abriendo menú...');
    
    mobileMenuBtn.classList.add('active');
    navMenu.classList.add('active');
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    navMenu.setAttribute('aria-hidden', 'false');
    
    console.log('Menú ABIERTO');
}

function closeMenu() {
    console.log('Cerrando menú...');
    
    isMenuOpen = false;
    
    mobileMenuBtn.classList.remove('active');
    navMenu.classList.remove('active');
    
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    
    console.log('Menú CERRADO');
}

function testMobileMenu() {
    console.log('Testeando menú móvil...');
    
    if (!mobileMenuBtn) {
        console.error('Botón no encontrado en test');
        return;
    }
    
    const rect = mobileMenuBtn.getBoundingClientRect();
    const styles = window.getComputedStyle(mobileMenuBtn);
    
    console.log('Posición del botón:', {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        visible: rect.width > 0 && rect.height > 0
    });
    
    console.log('Estilos del botón:', {
        display: styles.display,
        visibility: styles.visibility,
        pointerEvents: styles.pointerEvents,
        zIndex: styles.zIndex,
        position: styles.position
    });
    
    const isVisible = mobileMenuBtn.offsetParent !== null;
    const isClickable = styles.pointerEvents !== 'none';
    
    console.log('Resultados del test:');
    console.log('- Botón visible:', isVisible);
    console.log('- Botón clickeable:', isClickable);
    
    if (!isVisible || !isClickable) {
        console.warn('Problema detectado - Aplicando fix de emergencia...');
        emergencyMenuFix();
    } else {
        console.log('Menú móvil funcionando correctamente');
    }
}

function emergencyMenuFix() {
    console.log('Aplicando fix de emergencia...');
    
    if (!mobileMenuBtn) return;
    
    mobileMenuBtn.style.display = 'flex';
    mobileMenuBtn.style.visibility = 'visible';
    mobileMenuBtn.style.opacity = '1';
    mobileMenuBtn.style.pointerEvents = 'auto';
    mobileMenuBtn.style.zIndex = '10001';
    mobileMenuBtn.style.position = 'relative';
    mobileMenuBtn.style.cursor = 'pointer';
    
    if (window.innerWidth <= 768) {
        mobileMenuBtn.style.display = 'flex';
    }
    
    mobileMenuBtn.removeEventListener('click', handleMenuToggle);
    mobileMenuBtn.addEventListener('click', handleMenuToggle, true);
    
    console.log('Fix de emergencia aplicado');
}

// ====================================
// NAVEGACIÓN GENERAL
// ====================================
function initNavigation() {
    console.log('Inicializando navegación...');
    
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                smoothScrollTo(targetElement);
                if (isMenuOpen) {
                    closeMenu();
                }
            }
        });
    });
    
    console.log('Navegación inicializada');
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
    console.log('Inicializando contadores...');
    
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length === 0) {
        console.log('- No hay contadores para animar');
        return;
    }
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    counters.forEach(function(counter) {
        observer.observe(counter);
    });
    
    console.log(counters.length + ' contadores configurados');
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count) || 0;
    const duration = 2000;
    const step = target / (duration / 50);
    let current = 0;
    
    const timer = setInterval(function() {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (target === 24) {
            element.textContent = current >= target ? '24/7' : Math.floor(current);
        } else if (target === 20) {
            element.textContent = current >= target ? '20+' : Math.floor(current);
        } else if (target === 100) {
            element.textContent = current >= target ? '100+' : Math.floor(current);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 50);
}

// ====================================
// EFECTOS DE SCROLL
// ====================================
function initScrollEffects() {
    console.log('Inicializando efectos de scroll...');
    
    window.addEventListener('scroll', throttle(updateActiveSection, 100));
    
    const animatedElements = document.querySelectorAll('.service-card, .value-item, .timeline-item');
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
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
        
        animatedElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
        
        console.log(animatedElements.length + ' elementos con animación configurados');
    }
}

function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    
    sections.forEach(function(section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ====================================
// BOTÓN CTA PRINCIPAL
// ====================================
function initNuevoBotónCTA() {
    console.log('Inicializando botón CTA...');
    
    const nuevoCTA = document.getElementById('yakelu-cta-nuevo');
    
    if (!nuevoCTA) {
        console.log('- Botón CTA no encontrado');
        return;
    }
    
    function scrollSuaveAContacto(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const contactSection = document.getElementById('contact');
        
        if (!contactSection) {
            console.error('Sección contacto no encontrada');
            return;
        }
        
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        nuevoCTA.style.transform = 'scale(0.95)';
        setTimeout(function() {
            nuevoCTA.style.transform = '';
        }, 150);
    }
    
    nuevoCTA.addEventListener('click', scrollSuaveAContacto, true);
    nuevoCTA.addEventListener('touchstart', scrollSuaveAContacto, true);
    nuevoCTA.onclick = scrollSuaveAContacto;
    
    console.log('Botón CTA configurado');
}

// ====================================
// BOTÓN DESCARGA DOSSIER EN HEADER
// ====================================
function initDownloadButton() {
    console.log('Inicializando botón de descarga en header...');
    
    // NUEVO ID para el botón en header
    const downloadBtn = document.getElementById('download-dossier-header');
    
    if (!downloadBtn) {
        console.log('- Botón de descarga en header no encontrado');
        return;
    }
    
    downloadBtn.addEventListener('click', function(e) {
        // Agregar efecto visual de descarga
        this.classList.add('downloading');
        
        // Cambiar el icono temporalmente
        const icon = this.querySelector('i');
        const originalIcon = icon.className;
        icon.className = 'fas fa-spinner';
        
        // Mostrar notificación de descarga
        showNotification('📄 Iniciando descarga del dossier empresarial...', 'success');
        
        // Cerrar menú móvil si está abierto
        if (isMenuOpen) {
            closeMenu();
        }
        
        // Tracking de descarga (opcional)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download', {
                'event_category': 'Documents',
                'event_label': 'Dossier Empresarial YAKELU Header',
                'value': 1
            });
        }
        
        // Restaurar estado después de 2 segundos
        setTimeout(() => {
            this.classList.remove('downloading');
            icon.className = originalIcon;
            showNotification('✅ ¡Descarga completada! Revisa tu carpeta de descargas.', 'success');
        }, 2000);
        
        console.log('Descarga de dossier iniciada desde header');
    });
    
    // Agregar efecto hover adicional solo en desktop
    if (window.innerWidth > 768) {
        downloadBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        downloadBtn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }
    
    console.log('Botón de descarga en header configurado');
}   
// ====================================
// FUNCIÓN PARA MOSTRAR NOTIFICACIONES
// ====================================
function showNotification(message, type = 'success') {
    // Remover notificaciones existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.remove();
        }
    });
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
}

// ====================================
// BOTÓN VOLVER ARRIBA
// ====================================
function initBackToTop() {
    console.log('Inicializando botón volver arriba...');
    
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (!backToTopBtn) {
        console.log('- Botón back-to-top no encontrado');
        return;
    }
    
    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Función de scroll hacia arriba
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    console.log('Botón volver arriba configurado');
}

// ====================================
// UTILIDADES
// ====================================
function throttle(func, wait) {
    let timeout;
    return function executedFunction() {
        const args = arguments;
        const later = function() {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ====================================
// INICIALIZACIÓN FINAL
// ====================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    setTimeout(function() {
        if (window.innerWidth <= 768) {
            testMobileMenu();
        }
    }, 2000);
    
    console.log('YAKELU INFRAESTRUCTURA - Sitio web cargado completamente');
});

// ====================================
// MANEJO DE ERRORES
// ====================================
window.addEventListener('error', function(e) {
    console.error('Error en el sitio:', e.error);
});

// ====================================
// MANEJO DE REDIMENSIONADO
// ====================================
window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && isMenuOpen) {
        closeMenu();
    }
});

// ====================================
// EXPORT PARA DEBUGGING
// ====================================
window.YakeluApp = {
    isMenuOpen: isMenuOpen,
    openMenu: openMenu,
    closeMenu: closeMenu,
    testMobileMenu: testMobileMenu,
    emergencyMenuFix: emergencyMenuFix,
    showNotification: showNotification
};

console.log('Main.js cargado completamente');