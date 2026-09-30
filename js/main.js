(function () {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spinner = document.querySelector('#spinner');
    const navbar = document.querySelector('.navbar');
    const backToTop = document.querySelector('.back-to-top');

    const dismissSpinner = () => {
        if (spinner) {
            window.setTimeout(() => spinner.classList.remove('show'), 120);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', dismissSpinner, { once: true });
    } else {
        dismissSpinner();
    }

    const updateScrollState = () => {
        const isScrolled = window.scrollY > 45;
        navbar?.classList.toggle('sticky-top', isScrolled);
        navbar?.classList.toggle('shadow-sm', isScrolled);
        backToTop?.classList.toggle('is-visible', window.scrollY > 320);
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    if (backToTop) {
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
        });
    }

    const revealItems = [...document.querySelectorAll('.wow')];
    if (reducedMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach((item) => item.classList.add('animated'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const delay = Number.parseFloat(entry.target.dataset.wowDelay || '0');
                entry.target.style.animationDelay = `${delay}s`;
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

        revealItems.forEach((item) => revealObserver.observe(item));
    }

    const counters = [...document.querySelectorAll('[data-toggle="counter-up"]')];
    const animateCounter = (counter) => {
        const target = Number.parseInt(counter.textContent.replaceAll(',', ''), 10);
        if (!Number.isFinite(target)) return;
        if (reducedMotion) {
            counter.textContent = target.toLocaleString();
            return;
        }

        const startedAt = performance.now();
        const duration = 1100;
        const tick = (now) => {
            const progress = Math.min((now - startedAt) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(target * eased).toLocaleString();
            if (progress < 1) window.requestAnimationFrame(tick);
        };

        window.requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.65 });
        counters.forEach((counter) => counterObserver.observe(counter));
    } else {
        counters.forEach(animateCounter);
    }

    const $ = window.jQuery;
    if (!$ || !$.fn.owlCarousel) return;

    $('.testimonial-carousel').owlCarousel({
        autoplay: !reducedMotion,
        smartSpeed: 700,
        dots: true,
        loop: true,
        center: true,
        responsive: { 0: { items: 1 }, 768: { items: 2 }, 992: { items: 3 } }
    });

    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 32,
        dots: false,
        autoplay: !reducedMotion,
        smartSpeed: 700,
        responsive: { 0: { items: 2 }, 576: { items: 4 }, 992: { items: 6 } }
    });
})();

