// Herbert Do - profile page interactions
document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

    // Live Sydney clock
    const clock = document.getElementById('clock');
    if (clock) {
        const format = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit', hour12: false });
        const tick = () => { clock.textContent = format.format(new Date()); };
        tick();
        setInterval(tick, 20000);
    }

    // Split the giant name into letters so they can rise in one by one
    if (!reduceMotion) {
        let index = 0;
        $$('.giant .word').forEach((word) => {
            const letters = word.textContent.split('');
            word.textContent = '';
            letters.forEach((letter) => {
                const span = document.createElement('span');
                span.className = 'ch';
                span.style.setProperty('--i', index++);
                span.textContent = letter;
                word.append(span);
            });
        });
    }

    // Rotating words in the hero
    const swap = document.getElementById('swap');
    if (swap && !reduceMotion) {
        const words = swap.dataset.words.split('|');
        let word = 0;
        let char = words[0].length;
        let deleting = true;
        const type = () => {
            char += deleting ? -1 : 1;
            swap.textContent = words[word].slice(0, char);
            let delay = deleting ? 40 : 85;
            if (!deleting && char === words[word].length) {
                deleting = true;
                delay = 1700;
            } else if (deleting && char === 0) {
                deleting = false;
                word = (word + 1) % words.length;
                delay = 300;
            }
            setTimeout(type, delay);
        };
        setTimeout(type, 2200);
    }

    // Draggable stickers
    $$('.sticker').forEach((sticker) => {
        let startX = 0;
        let startY = 0;
        let x = 0;
        let y = 0;
        sticker.addEventListener('pointerdown', (e) => {
            sticker.setPointerCapture(e.pointerId);
            sticker.classList.add('drag');
            startX = e.clientX - x;
            startY = e.clientY - y;
        });
        sticker.addEventListener('pointermove', (e) => {
            if (!sticker.classList.contains('drag')) {
                return;
            }
            x = e.clientX - startX;
            y = e.clientY - startY;
            sticker.style.setProperty('--x', x + 'px');
            sticker.style.setProperty('--y', y + 'px');
        });
        const drop = () => sticker.classList.remove('drag');
        sticker.addEventListener('pointerup', drop);
        sticker.addEventListener('pointercancel', drop);
    });

    // Reveal on scroll
    if (!reduceMotion && 'IntersectionObserver' in window) {
        const revealer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    revealer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px' });
        ['.section-head', '.card', '.skill-rows li', '.log li', '.contact > *'].forEach((selector) => {
            $$(selector).forEach((el, i) => {
                el.classList.add('rv');
                el.style.setProperty('--d', (i % 4) * 0.08 + 's');
                if (el.classList.contains('card')) {
                    el.style.setProperty('--rr', (i % 2 ? 2 : -2) + 'deg');
                }
                revealer.observe(el);
            });
        });
    }

    // Projects: the sticky phone shows the project currently in view
    const projects = $$('.project');
    const screens = $$('.phone-screen img');
    const stage = document.querySelector('.stage-inner');
    const phone = document.querySelector('.phone');
    const counter = document.getElementById('stage-n');
    projects.forEach((project) => project.style.setProperty('--pc', project.dataset.color));
    const showProject = (i) => {
        projects.forEach((project, n) => project.classList.toggle('on', n === i));
        screens.forEach((screen, n) => screen.classList.toggle('on', n === i));
        if (stage) {
            stage.style.setProperty('--stage', projects[i].dataset.color);
            phone.style.setProperty('--tilt', (i % 2 ? 5 : -5) + 'deg');
            counter.textContent = String(i + 1).padStart(2, '0');
        }
    };
    if (projects.length && 'IntersectionObserver' in window) {
        const watcher = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    showProject(projects.indexOf(entry.target));
                }
            });
        }, { rootMargin: '-45% 0px -45% 0px' });
        projects.forEach((project) => watcher.observe(project));
        showProject(0);
    } else {
        projects.forEach((project) => project.classList.add('on'));
    }

    // Dock: highlight the section in view
    const links = $$('.dock a');
    const sections = links.map((link) => document.querySelector(link.getAttribute('href')));
    if ('IntersectionObserver' in window) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const i = sections.indexOf(entry.target);
                    links.forEach((link, n) => link.classList.toggle('active', n === i));
                }
            });
        }, { rootMargin: '-50% 0px -50% 0px' });
        sections.forEach((section) => section && spy.observe(section));
    }

    // Copy email
    const copy = document.getElementById('copy');
    if (copy) {
        copy.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(copy.dataset.email);
                copy.textContent = 'Copied!';
            } catch (err) {
                copy.textContent = copy.dataset.email;
            }
            setTimeout(() => { copy.textContent = 'Copy email'; }, 1800);
        });
    }

    // Custom cursor
    const cursor = document.querySelector('.cursor');
    if (cursor && finePointer && !reduceMotion) {
        let x = 0;
        let y = 0;
        let cx = 0;
        let cy = 0;
        document.addEventListener('mousemove', (e) => {
            x = e.clientX;
            y = e.clientY;
            cursor.classList.add('on');
        });
        document.addEventListener('mouseleave', () => cursor.classList.remove('on'));
        const follow = () => {
            cx += (x - cx) * 0.2;
            cy += (y - cy) * 0.2;
            cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
            requestAnimationFrame(follow);
        };
        follow();
        $$('a, button, .sticker, .card, .skill-rows li').forEach((el) => {
            el.addEventListener('mouseenter', () => cursor.classList.add('big'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
        });
    }
});
