# AE — Creative Studio

Website for Adam Hammoud and Elliott Huber. This export contains the current website, including the updated business-card photo with the connected AE logo, the skyline video, liquid-glass styling, animations, contact links, and reviews section.

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

- `index.html` — text, sections, contact details, and image references.
- `styles.css` — layout, colors, typography, glass effects, and responsive styles.
- `site.js` — video behavior, scroll animations, and pointer interactions.
- `assets/` — the logo, photos, and background video used by the website.
- `docs/` — media sources and the business-card image-edit prompt.

This is a static HTML/CSS/JavaScript site. No npm install, build command, database, API key, or server-side application is required. The site files are ready for a static host; publishing is separate from storing the files in GitHub.

The fonts load from Google Fonts and need internet access. Contact and review links open the visitor's email application. Reviews are added manually after permission; this version does not store or automatically publish comments.

## Media

The supplied AE logo is included. The business-card visual was edited with the built-in image-generation tool to match it. The laptop photograph is credited to Carlos Muza / Unsplash on the page. The skyline video is credited to Yura Forrat / Pexels in `docs/VIDEO-SOURCE.md`. Keep the included media-source records with the project.
