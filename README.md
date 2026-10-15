# AE — Creative Studio

The English and French website for Adam Hammoud and Elliott Huber, published at https://aecompany.tech/. The approved Alpine redesign combines the seven-second opening animation, locally hosted typography, gold-accented service and package sections, interactive project previews, and the existing enquiry form.

## Save and upload to GitHub

1. Extract `AE-website-github.zip`.
2. Open the extracted `ae-website` folder.
3. Add the contents of that folder to your GitHub repository so `index.html` is at the repository root. Keep the `assets` folder beside it.

Uploading the ZIP itself to a repository stores the archive; extract it first to work with the website files.

## Preview locally

Open a terminal in the `ae-website` folder and run:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Press Control+C in the terminal to stop the server. You can also open `index.html` directly for a simple preview.

## Edit the website

- `index.html` and `fr.html` — English and French content, contact details, and image references.
- `design.css` — base layout, colours, glass effects, and responsive styles.
- `refinements.css` — local typography, final section geometry, and gold accents below the opening.
- `site.js` — video behaviour, navigation, disclosures, and pointer interactions.
- `contact-form.js` and `ad-player.js` — enquiry submission and the bilingual advertising film player.
- `assets/` — the logo, photos, licensed fonts, and responsive Alpine videos and posters.
- `docs/` — media sources and the business-card image-edit prompt.

This is a static HTML/CSS/JavaScript site. No npm install, build command, database, API key, or server-side application is required. The site files are ready for a static host; publishing is separate from storing the files in GitHub.

Fonts are served locally, with their licenses in `assets/fonts/`. The enquiry form uses the existing FormSubmit endpoint; direct contact, feedback and partnership links also open an email application. Feedback is published manually after permission. Reduced-motion preferences and data-saving mode use a static Alpine image. Video playback is muted, pauses offscreen, and uses a resolution suited to the device.

## Publish

GitHub Pages publishes the repository's `main` branch. Push the complete site, including new assets, and wait for the Pages deployment to finish. Preserve `CNAME` so the existing `aecompany.tech` domain continues to work. Check both languages and mobile layouts after deployment.

## Media

The supplied AE logo and existing business-card visual are retained. The opening uses the approved Alpine animation and its still-image fallback. Existing media and their source records remain in the repository for compatibility. The current visual system and typography references are documented in `docs/DESIGN-REFERENCES.md`.
