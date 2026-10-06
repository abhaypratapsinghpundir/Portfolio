/* =========================================================
   Abhay · Portfolio interactions
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNav();
    initReveal();
    renderProjects();
    initFilters();
    initContactForm();
    document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- Theme toggle (persisted) ---------- */
function initTheme() {
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
    });
}

/* ---------- Navigation: scrolled state, active link, mobile menu ---------- */
function initNav() {
    const nav = document.getElementById('nav');
    const burger = document.getElementById('navBurger');
    const navLinks = document.getElementById('navLinks');
    const links = Array.from(document.querySelectorAll('.nav-link'));
    // Only in-page (#hash) links map to sections; skip external/file links like Résumé.
    const sections = links
        .map(l => l.getAttribute('href'))
        .filter(h => h && h.startsWith('#'))
        .map(h => document.querySelector(h))
        .filter(Boolean);

    // Frosted border once scrolled
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile menu
    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });
    links.forEach(link => link.addEventListener('click', () => {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
    }));

    // Highlight the section currently in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = '#' + entry.target.id;
                links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => observer.observe(s));
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach(i => i.classList.add('in'));
        return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    items.forEach(i => observer.observe(i));
}

/* ---------- Projects data + rendering ---------- */
/* Edit this array to manage your projects. Each entry powers both the
   card and the detail modal (problem / approach / result case study). */
const PROJECTS = [
    {
        title: 'Papped.co',
        category: 'web',
        year: '2026',
        icon: 'fa-camera',
        role: 'Full-stack + Quality Engineering',
        description: 'Camera-first event media platform that sends guest photos and video clips to a shared live gallery.',
        tags: ['React', 'TypeScript', 'Cloudflare Workers', 'PostgreSQL', 'Playwright'],
        problem: 'Event guests needed a fast way to contribute photos and video without installing an app, while organizers needed a reliable shared gallery.',
        approach: 'Built a mobile-first PWA with an in-browser camera, offline-capable uploads, WebGL compositing, and a serverless API with JWT auth, validated requests, presigned uploads, and CORS hardening.',
        result: 'Shipped a staging-gated workflow with Playwright and Vitest coverage, Sentry monitoring, and product analytics across the web and API.',
        github: null,
        demo: null
    },
    {
        title: 'Compliance Test Automation',
        category: 'testing',
        year: '2026',
        icon: 'fa-vial',
        role: 'Program Analyst Trainee · Cognizant',
        description: 'Quality engineering for a financial compliance platform handling SEC insider-filing workflows.',
        tags: ['Java', 'Spring Boot', 'Selenium', 'TestNG', 'BDD'],
        problem: 'Filing workflows need dependable validation and regression coverage because small defects can affect deadline-driven regulatory work.',
        approach: 'Contributed to Java/Spring Boot services, SQL data models, filing validation rules, code reviews, and automated regression checks across the filing pipeline.',
        result: 'Automated 70+ regression checks, reduced manual verification effort by 15%, and helped reduce bugs by 20%.',
        github: null,
        demo: null
    },
    {
        title: 'Portfolio',
        category: 'web',
        year: '2026',
        icon: 'fa-laptop-code',
        role: 'Personal project',
        description: 'A lightweight, responsive portfolio for sharing projects, experience, and contact links.',
        tags: ['HTML', 'CSS', 'JavaScript', 'Accessibility'],
        problem: 'A public profile should make current work easy to understand without hiding the details behind a framework or build step.',
        approach: 'Built a dependency-free static site with a light/dark theme, responsive navigation, project case-study modals, accessible interactions, and SEO metadata.',
        result: 'Created a fast, maintainable home for current work and a direct résumé download.',
        github: 'https://github.com/abhaypratapsinghpundir/Portfolio',
        demo: 'https://abhaypratapsinghpundir.github.io/Portfolio/'
    },
    {
        title: 'FindMyLand',
        category: 'web',
        year: '2024',
        icon: 'fa-house',
        role: 'Full-stack project',
        description: 'A platform exploring how rural homes can become more discoverable and available to a global audience.',
        tags: ['JavaScript', 'Node.js', 'React', 'REST API'],
        problem: 'Rural homes and land can be difficult to discover outside local networks and traditional listings.',
        approach: 'Built a web application with separate client and API layers, iterating on features and resolving bugs as the product developed.',
        result: 'Published a working project with a live deployment and an extensible full-stack structure.',
        github: 'https://github.com/abhaypratapsinghpundir/FindMyLand',
        demo: 'https://findmyland.onrender.com/'
    },
    {
        title: 'GitHub Actions Course',
        category: 'tools',
        year: '2025',
        icon: 'fa-gears',
        role: 'Learning project',
        description: 'Examples and notes for building CI/CD workflows with GitHub Actions.',
        tags: ['GitHub Actions', 'CI/CD', 'YAML'],
        problem: 'Reliable delivery depends on making build, test, and release checks repeatable and visible to the team.',
        approach: 'Collected hands-on examples and notes while learning the building blocks of GitHub Actions workflows.',
        result: 'Created a reusable reference for experimenting with automation and improving delivery pipelines.',
        github: 'https://github.com/abhaypratapsinghpundir/gh-actions-course',
        demo: null
    }
];

function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    grid.innerHTML = PROJECTS.map((p, i) => `
        <article class="project-card" data-category="${p.category}" data-index="${i}" tabindex="0" role="button" aria-label="View case study: ${p.title}">
            <div class="pc-top">
                <div class="pc-icon"><i class="fas ${p.icon}"></i></div>
                <span class="pc-year">${p.year}</span>
            </div>
            <h3 class="pc-title">${p.title}</h3>
            <p class="pc-desc">${p.description}</p>
            <div class="pc-tags">
                ${p.tags.map(t => `<span class="pc-tag">${t}</span>`).join('')}
            </div>
            <div class="pc-links">
                <span class="pc-link pc-casestudy">Case study <i class="fas fa-arrow-right"></i></span>
                ${p.github ? `<a class="pc-link" href="${p.github}" target="_blank" rel="noopener"><i class="fab fa-github"></i> Code</a>` : ''}
                ${p.demo ? `<a class="pc-link" href="${p.demo}" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square"></i> Demo</a>` : ''}
            </div>
        </article>
    `).join('');

    initProjectModal();
}

/* ---------- Project detail modal ---------- */
function initProjectModal() {
    const grid = document.getElementById('projectsGrid');
    const modal = document.getElementById('projectModal');
    const content = document.getElementById('modalContent');
    if (!grid || !modal || !content) return;

    let lastFocused = null;

    const open = (p) => {
        content.innerHTML = `
            <div class="modal-head">
                <div class="pc-icon"><i class="fas ${p.icon}"></i></div>
                <div>
                    <h3 class="modal-title" id="modalTitle">${p.title}</h3>
                    <p class="modal-meta">${p.role} · ${p.year}</p>
                </div>
            </div>
            <div class="modal-tags">
                ${p.tags.map(t => `<span class="pc-tag">${t}</span>`).join('')}
            </div>
            <div class="modal-section">
                <h4>The problem</h4>
                <p>${p.problem}</p>
            </div>
            <div class="modal-section">
                <h4>My approach</h4>
                <p>${p.approach}</p>
            </div>
            <div class="modal-section">
                <h4>The result</h4>
                <p>${p.result}</p>
            </div>
            <div class="modal-actions">
                ${p.demo ? `<a class="btn btn-primary" href="${p.demo}" target="_blank" rel="noopener">View live <i class="fas fa-arrow-up-right-from-square"></i></a>` : ''}
                ${p.github ? `<a class="btn btn-ghost" href="${p.github}" target="_blank" rel="noopener"><i class="fab fa-github"></i> Source code</a>` : ''}
            </div>
        `;
        lastFocused = document.activeElement;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        modal.querySelector('.modal-close').focus();
    };

    const close = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    };

    // Open from a card (but not when clicking the real Code/Demo links)
    const openFromCard = (card) => {
        const idx = Number(card.dataset.index);
        if (!Number.isNaN(idx) && PROJECTS[idx]) open(PROJECTS[idx]);
    };
    grid.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; // let Code/Demo links work normally
        const card = e.target.closest('.project-card');
        if (card) openFromCard(card);
    });
    grid.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const card = e.target.closest('.project-card');
        if (card) { e.preventDefault(); openFromCard(card); }
    });

    modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });
}

/* ---------- Project filters ---------- */
function initFilters() {
    const filters = document.getElementById('filters');
    if (!filters) return;
    const buttons = filters.querySelectorAll('.filter');

    filters.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter');
        if (!btn) return;

        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(card => {
            const match = filter === 'all' || card.dataset.category === filter;
            card.classList.toggle('hide', !match);
            if (match) {
                card.classList.remove('entering');
                // restart entry animation
                void card.offsetWidth;
                card.classList.add('entering');
            }
        });
    });
}

/* ---------- Contact form -> mailto ---------- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const note = document.getElementById('formNote');
    const RECIPIENT = 'pundirabhay963@gmail.com';

    const setError = (name, msg) => {
        const field = form.querySelector(`#${name}`).closest('.field');
        field.classList.toggle('invalid', !!msg);
        form.querySelector(`[data-error="${name}"]`).textContent = msg || '';
    };

    const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const message = form.querySelector('#message').value.trim();

        let ok = true;
        if (!name) { setError('name', 'Please enter your name.'); ok = false; } else setError('name', '');
        if (!email) { setError('email', 'Please enter your email.'); ok = false; }
        else if (!isEmail(email)) { setError('email', 'That email doesn\'t look right.'); ok = false; }
        else setError('email', '');
        if (!message) { setError('message', 'Please write a short message.'); ok = false; } else setError('message', '');

        if (!ok) return;

        const subject = encodeURIComponent(`Portfolio message from ${name}`);
        const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
        window.location.href = `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;

        note.hidden = false;
        note.textContent = 'Opening your email app… if nothing happens, write to ' + RECIPIENT;
        form.reset();
    });
}
