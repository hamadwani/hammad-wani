# Hammad Wani — Portfolio

A responsive portfolio built with React, TypeScript, and Vite. It includes the home page, About and Skills sections, selected projects, a searchable project archive, résumé, site-details experiments, and contact form.

## Start the website

1. Open this folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Run `npm install` once, then `npm run dev`.
4. Open the local address printed by Vite (usually `http://localhost:5173`).

To make a production build, run `npm run build`. To preview that build locally, run `npm run preview`.

## Where to make changes

Start with the [beginner project guide](docs/PROJECT_GUIDE.md). It maps the portfolio sections and explains the safest places to update your details and projects.

## Contact form before publishing

The contact form delivers messages through Web3Forms. Create an access key at [web3forms.com](https://web3forms.com/) for `hamadwani885@gmail.com`. Set `VITE_WEB3FORMS_ACCESS_KEY` in a local `.env.local` file and in your hosting provider's build settings. Do not commit `.env.local`; `.env.example` shows the variable name. Without a key, the direct email link remains available and the form reports that it is not connected.

## Main routes

- `/` — portfolio home
- `/projects` — searchable project archive
- `/project/mci-progression` — academic research case study
- `/resume` — résumé page with print and PDF download

The MCI project is academic research only; it is not a clinically validated product and does not use patient data or claim performance results.
