/**
 * YAKELU INFRAESTRUCTURA - Animations & Effects
 * =============================================
 */

// Animation configuration
const ANIMATION_CONFIG = {
    duration: 600,
    easing: 'ease-out',
    staggerDelay: 100,
    threshold: 0.15
};

/**
 * Initialize all animations when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    initCounterAnimations();
    initTypewriterEffect();
    initHoverEffects();
    initFloatingElements();
    addCustomAnimationStyles();
    
    console.log('YAKELU Animations initialized');
});

/**
 * Counter Animation for Stats
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = element.textContent;
    const isNumber = /^\d+\+?$/.test(target);
    
    if (!isNumber) return;
    
    const finalNumber = parseInt(target.replace('+', ''));
    const hasPlus = target.includes('+');
    const duration = 2000;
    const startTime = performance.now();
    
    // Store original text
    element.dataset.originalText = target;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentNumber = Math.floor(finalNumber * easeOut);
        element.textContent = currentNumber + (hasPlus ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target; // Ensure final value is exact
        }
    }
    
    // Add counter animation class
    element.classList.add('counting');
    requestAnimationFrame(updateCounter);
    
    // Remove class after animation
    setTimeout(() => {
        element.classList.remove('counting');
    }, duration + 100);
}

/**
 * Typewriter Effect for Hero Text
 */
function initTypewriterEffect() {
    const heroTagline = document.querySelector('.hero-tagline');
    
    if (!heroTagline) return;
    
    const text = heroTagline.textContent;
    const typingSpeed = 100;
    const startDelay = 1000;
    
    // Clear text initially
    heroTagline.textContent = '';
    heroTagline.style.borderRight = '2px solid var(--secondary-color)';
    
    setTimeout(() => {
        typeText(heroTagline, text, typingSpeed);
    }, startDelay);
}

function typeText(element, text, speed) {
    let index = 0;
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else {
            // Remove cursor after typing
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    type();
}

/**
 * Enhanced Hover Effects
 */
function initHoverEffects() {
    // Service cards tilt effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        addTiltEffect(card);
    });
    
    // Button ripple effect
    const buttons = document.querySelectorAll('.cta-button, .submit-btn');
    buttons.forEach(button => {
        addRippleEffect(button);
    });
    
    // Timeline items pulse effect
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        addPulseEffect(item);
    });
}

function addTiltEffect(element) {
    element.addEventListener('mousemove', function(e) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    element.addEventListener('mouseleave', function() {
        element.style.transform = '';
    });
}

function addRippleEffect(button) {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

function addPulseEffect(element) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('pulse-once');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(element);
}

/**
 * Floating Elements Animation
 */
function initFloatingElements() {
    // Add floating animation to service icons
    const serviceIcons = document.querySelectorAll('.service-icon');
    serviceIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.2}s`;
        icon.classList.add('float');
    });
    
    // Add floating animation to value icons
    const valueIcons = document.querySelectorAll('.value-icon');
    valueIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.3}s`;
        icon.classList.add('float-alt');
    });
}

/**
 * Scroll-triggered Animations
 */
function addScrollTriggeredAnimations() {
    const elements = document.querySelectorAll([
        '.about-text',
        '.contact-info',
        '.contact-form'
    ].join(','));
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('slide-in-up');
                }, index * 200);
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    elements.forEach(el => {
        el.classList.add('animate-on-scroll');
        scrollObserver.observe(el);
    });
}

/**
 * Page Transition Effects
 */
function addPageTransitions() {
    // Fade in page content
    document.body.style.opacity = '0';
    
    window.addEventListener('load', function() {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });
    
    // Smooth page exit for internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Add exit animation to current section
                const currentSection = getCurrentSection();
                if (currentSection) {
                    currentSection.classList.add('section-exit');
                }
                
                // Scroll to target with delay
                setTimeout(() => {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Add enter animation to target section
                    setTimeout(() => {
                        target.classList.add('section-enter');
                        if (currentSection) {
                            currentSection.classList.remove('section-exit');
                        }
                    }, 200);
                }, 100);
            }
        });
    });
}

function getCurrentSection() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    for (let section of sections) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
            return section;
        }
    }
    return null;
}

/**
 * Custom Animation Styles
 */
function addCustomAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Counter Animation */
        .stat-number.counting {
            color: var(--secondary-color);
            transform: scale(1.1);
            transition: all 0.3s ease;
        }
        
        /* Typewriter Cursor */
        .hero-tagline {
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 50% { border-color: var(--secondary-color); }
            51%, 100% { border-color: transparent; }
        }
        
        /* Ripple Animation */
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        /* Floating Animations */
        .float {
            animation: float 3s ease-in-out infinite;
        }
        
        .float-alt {
            animation: float-alt 4s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes float-alt {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            33% { transform: translateY(-8px) rotate(2deg); }
            66% { transform: translateY(-4px) rotate(-2deg); }
        }
        
        /* Pulse Animation */
        .pulse-once {
            animation: pulse-once 1s ease;
        }
        
        @keyframes pulse-once {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        /* Scroll Animations */
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }
        
        .slide-in-up {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Section Transitions */
        .section-exit {
            opacity: 0.8;
            transform: scale(0.98);
            transition: all 0.3s ease;
        }
        
        .section-enter {
            opacity: 1;
            transform: scale(1);
            transition: all 0.5s ease;
        }
        
        /* Hover Glow Effects */
        .service-card:hover .service-icon,
        .value-icon:hover {
            box-shadow: 0 0 20px rgba(230, 126, 34, 0.4);
            transition: box-shadow 0.3s ease;
        }
        
        /* Timeline Animation */
        .timeline-item:nth-child(odd) {
            animation-delay: 0.2s;
        }
        
        .timeline-item:nth-child(even) {
            animation-delay: 0.4s;
        }
        
        /* Loading Animation */
        .loading {
            position: relative;
            overflow: hidden;
        }
        
        .loading::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        /* Gradient Animations */
        .hero {
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
        }
        
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        /* Performance optimizations */
        .service-card,
        .value-item,
        .timeline-item,
        .stat-item {
            will-change: transform, opacity;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            .float,
            .float-alt,
            .hero {
                animation: none !important;
            }
            
            .service-card:hover {
                transform: none !important;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize scroll-triggered animations
document.addEventListener('DOMContentLoaded', function() {
    addScrollTriggeredAnimations();
    addPageTransitions();
});

/**
 * Export functions for external use
 */
window.YAKELUAnimations = {
    animateCounter,
    addTiltEffect,
    addRippleEffect,
    typeText
};