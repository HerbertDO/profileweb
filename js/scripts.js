/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

//
// Profile effects: scroll reveal, typed text, card tilt, scroll progress
//
window.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll progress bar and back-to-top button
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    const toTop = document.createElement('button');
    toTop.className = 'to-top';
    toTop.type = 'button';
    toTop.setAttribute('aria-label', 'Back to top');
    toTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
    document.body.append(bar, toTop);
    const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
        toTop.classList.toggle('show', window.scrollY > 600);
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (reduceMotion) {
        return;
    }

    // Reveal elements as they scroll into view
    if ('IntersectionObserver' in window) {
        const groups = [
            '.page-section .text-center > h2, .page-section .text-center > h3',
            '.skill-card',
            '#portfolio .col-lg-4',
            '.timeline > li',
            '.edu-card',
            '.contact-item',
        ];
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
        groups.forEach((selector) => {
            document.querySelectorAll(selector).forEach((el, i) => {
                el.classList.add('reveal');
                el.style.setProperty('--d', (i % 3) * 0.12 + 's');
                observer.observe(el);
            });
        });
    }

    // Typed text in the hero
    const typed = document.getElementById('typed');
    if (typed) {
        const words = typed.dataset.words.split('|');
        let word = 0;
        let char = words[0].length;
        let deleting = true;
        const tick = () => {
            const current = words[word];
            char += deleting ? -1 : 1;
            typed.textContent = current.slice(0, char);
            let delay = deleting ? 45 : 90;
            if (!deleting && char === current.length) {
                deleting = true;
                delay = 1600;
            } else if (deleting && char === 0) {
                deleting = false;
                word = (word + 1) % words.length;
                delay = 350;
            }
            setTimeout(tick, delay);
        };
        setTimeout(tick, 1800);
    }

    // 3D tilt on project cards (pointer devices only)
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('#portfolio .portfolio-item').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = 'perspective(900px) rotateX(' + (-y * 8) + 'deg) rotateY(' + (x * 8) + 'deg) translateY(-6px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
});
