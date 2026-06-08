# Abhay · Portfolio

A minimalist, Apple-inspired personal portfolio for **Abhay — AI Software Engineer**.
Built as a fast, dependency-free static site (HTML + CSS + vanilla JS).

🔗 **Live (local):** open `index.html`, or serve it with `npx serve`.

## Features

- **Minimalist Apple-style design** — clean typography, generous whitespace, frosted-glass nav.
- **Light / Dark theme toggle** — persists via `localStorage`, respects system preference, no flash on load.
- **Sections** — Hero, About (skills + stats), Projects, Contact.
- **Data-driven projects** — every card is generated from the `PROJECTS` array in `scripts/main.js`; add/remove projects by editing that array.
- **Project case-study modals** — click any card for a Problem → Approach → Result write-up.
- **Filterable project grid** — All / AI·ML / Web / Tools.
- **Contact form** — client-side validation, submits via `mailto:`.
- **SEO ready** — Open Graph + Twitter cards, JSON-LD `Person` schema, favicon.
- **Accessible & responsive** — keyboard-navigable, reduced-motion support, mobile menu.

## Tech stack

Plain **HTML5**, **CSS3** (custom properties / design tokens), and **vanilla JavaScript** — no framework, no build step. Icons via Font Awesome, type via Inter (Google Fonts).

## Project structure

```
.
├── index.html          # markup + meta
├── styles/main.css     # design tokens + all styling
├── scripts/main.js     # theme, nav, projects data, modal, contact form
└── assests/            # images, favicon, (résumé pdf)
```

## Run locally

```bash
# any static server works, e.g.:
npx serve .
# then open the printed http://localhost:... URL
```

Or simply double-click `index.html`.

## Customizing

- **Projects:** edit the `PROJECTS` array in `scripts/main.js`.
- **Theme colors / spacing:** edit the CSS variables at the top of `styles/main.css`.
- **Résumé:** drop your PDF at `assests/Abhay_Resume.pdf`.

## Contact

- Email — pundirabhay963@gmail.com
- GitHub — [@abhaypratapsinghpundir](https://github.com/abhaypratapsinghpundir)
- LinkedIn — [abhay-pratap-singh-pundir](https://www.linkedin.com/in/abhay-pratap-singh-pundir/)
- X — [@OneEyedAbhay](https://x.com/OneEyedAbhay)
