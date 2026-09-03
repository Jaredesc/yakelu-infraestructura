/**
 * YAKELU INFRAESTRUCTURA — dynamic.js
 * Slideshow del hero, animaciones on-scroll, timeline horizontal
 * con flechas, y lightbox para las galerías de servicios.
 * No modifica main.js ni animations.js, sólo se suma.
 */
document.addEventListener('DOMContentLoaded', function () {

    /* ---------- HEADER: sombra al hacer scroll ---------- */
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 40);
        });
    }

    /* ---------- HERO SLIDESHOW (máx. 3 imágenes) ---------- */
    const slides = document.querySelectorAll('.hero-slide');
    const dotsWrap = document.querySelector('.hero-dots');
    if (slides.length > 1) {
        let current = 0;
        slides[0].classList.add('active');

        if (dotsWrap) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', 'Imagen ' + (i + 1));
                dot.addEventListener('click', () => goToSlide(i));
                dotsWrap.appendChild(dot);
            });
        }

        function goToSlide(index) {
            slides[current].classList.remove('active');
            if (dotsWrap) dotsWrap.children[current].classList.remove('active');
            current = index;
            slides[current].classList.add('active');
            if (dotsWrap) dotsWrap.children[current].classList.add('active');
        }

        setInterval(() => {
            goToSlide((current + 1) % slides.length);
        }, 5500);
    } else if (slides.length === 1) {
        slides[0].classList.add('active');
    }

    /* ---------- SCROLL REVEAL genérico (.yk-reveal) ---------- */
    const revealEls = document.querySelectorAll('.yk-reveal');
    if (revealEls.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('yk-in');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    }

    // Delay escalonado para elementos dentro de .yk-reveal-stagger
    document.querySelectorAll('.yk-reveal-stagger').forEach(group => {
        Array.from(group.children).forEach((child, i) => {
            child.style.setProperty('--yk-i', i);
        });
    });

    /* ---------- TIMELINE HORIZONTAL: flechas ---------- */
    const track = document.querySelector('.timeline-scroll');
    const prevBtn = document.querySelector('.timeline-nav .tl-prev');
    const nextBtn = document.querySelector('.timeline-nav .tl-next');
    if (track && prevBtn && nextBtn) {
        const scrollAmount = 280;
        prevBtn.addEventListener('click', () => track.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => track.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
    }

    /* ---------- LIGHTBOX para galerías (.yk-gallery-link) ---------- */
    let lightbox = document.querySelector('.yk-lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'yk-lightbox';
        lightbox.innerHTML = '<button class="yk-lightbox-close" aria-label="Cerrar">&times;</button><img src="" alt="">';
        document.body.appendChild(lightbox);
    }
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.yk-lightbox-close');

    document.querySelectorAll('.yk-gallery-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const fullSrc = this.getAttribute('href') || this.querySelector('img')?.src;
            if (!fullSrc) return;
            lightboxImg.src = fullSrc;
            lightboxImg.alt = this.querySelector('img')?.alt || 'YAKELU INFRAESTRUCTURA';
            lightbox.classList.add('open');
        });
    });

    function closeLightbox() { lightbox.classList.remove('open'); lightboxImg.src = ''; }
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
});
