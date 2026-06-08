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
        title: 'Neural Insight',
        category: 'ai',
        year: '2025',
        icon: 'fa-brain',
        role: 'Solo · ML + Full-stack',
        description: 'LLM-powered analytics assistant that turns natural-language questions into live dashboards.',
        tags: ['Python', 'LangChain', 'FastAPI', 'React'],
        problem: 'Non-technical teams waited days on analysts to answer simple data questions, creating a bottleneck around every decision.',
        approach: 'Built a retrieval-augmented agent that maps plain-English questions to validated SQL, runs them against a warehouse, and renders the result as an interactive chart — with guardrails to prevent unsafe queries.',
        result: 'Cut time-to-answer from days to seconds and handled 80%+ of routine analytics requests without an analyst in the loop.',
        github: '#',
        demo: '#'
    },
    {
        title: 'VisionKit',
        category: 'ai',
        year: '2024',
        icon: 'fa-eye',
        role: 'ML Engineer',
        description: 'Real-time object detection and tracking pipeline optimized for edge devices.',
        tags: ['PyTorch', 'OpenCV', 'ONNX'],
        problem: 'A computer-vision model that ran fine on a GPU server was far too heavy to run on the low-power cameras it was meant for.',
        approach: 'Distilled and quantized the detector, exported to ONNX, and rebuilt the tracking loop to run inference on-device with a fixed memory budget.',
        result: 'Achieved real-time 30 FPS detection on edge hardware with a fraction of the original model size and no cloud round-trip.',
        github: '#',
        demo: '#'
    },
    {
        title: 'Studio Portfolio',
        category: 'web',
        year: '2025',
        icon: 'fa-palette',
        role: 'Design + Front-end',
        description: 'A fast, accessible, minimalist portfolio system with a design-token theming engine.',
        tags: ['React', 'TypeScript', 'Vite'],
        problem: 'Creatives needed portfolio sites that looked custom but could be themed and shipped quickly without rebuilding from scratch each time.',
        approach: 'Designed a token-driven theming system so colors, type, and spacing flow from one config, with light/dark support and accessibility baked in.',
        result: 'Reduced new-site setup from days to hours while keeping Lighthouse scores in the high 90s across performance and accessibility.',
        github: '#',
        demo: '#'
    },
    {
        title: 'PromptForge',
        category: 'tools',
        year: '2024',
        icon: 'fa-wand-magic-sparkles',
        role: 'Open Source · Maintainer',
        description: 'A CLI + library for versioning, testing, and evaluating prompts against model suites.',
        tags: ['Python', 'Click', 'Pytest'],
        problem: 'Prompt changes shipped with no tests — a tweak that helped one case silently broke five others, and nobody noticed until production.',
        approach: 'Built a framework to version prompts, define expected-output assertions, and run them as a test suite across multiple models in CI.',
        result: 'Brought regression testing to prompt engineering, catching quality drops before release and making prompt changes reviewable like code.',
        github: '#',
        demo: '#'
    },
    {
        title: 'DataPilot',
        category: 'web',
        year: '2023',
        icon: 'fa-chart-line',
        role: 'Full-stack',
        description: 'Collaborative data-exploration app with real-time charts and sharable notebooks.',
        tags: ['Next.js', 'PostgreSQL', 'WebSockets'],
        problem: 'Teams explored data in scattered, static screenshots that went stale the moment the underlying numbers changed.',
        approach: 'Built a live notebook where queries, charts, and notes update in real time and multiple people can explore the same session together.',
        result: 'Replaced static reporting with a shared live workspace, keeping everyone on the same, current view of the data.',
        github: '#',
        demo: '#'
    },
    {
        title: 'AutoLabel',
        category: 'tools',
        year: '2024',
        icon: 'fa-tags',
        role: 'ML Engineer',
        description: 'Semi-automated dataset labeling tool with active-learning suggestions.',
        tags: ['Python', 'Streamlit', 'scikit-learn'],
        problem: 'Hand-labeling training data was slow, expensive, and the most tedious part of every ML project.',
        approach: 'Built a labeling UI that pre-labels with a lightweight model and uses active learning to surface the most informative, uncertain examples first.',
        result: 'Cut manual labeling effort substantially by focusing human time only where the model was genuinely unsure.',
        github: '#',
        demo: '#'
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
                <a class="pc-link" href="${p.github}" target="_blank" rel="noopener"><i class="fab fa-github"></i> Code</a>
                <a class="pc-link" href="${p.demo}" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square"></i> Demo</a>
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
                <a class="btn btn-primary" href="${p.demo}" target="_blank" rel="noopener">View live <i class="fas fa-arrow-up-right-from-square"></i></a>
                <a class="btn btn-ghost" href="${p.github}" target="_blank" rel="noopener"><i class="fab fa-github"></i> Source code</a>
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
