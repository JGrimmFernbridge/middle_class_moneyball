# Middle Class Moneyball — The Future Poor edition (deploy package)

A static site. No build step. Everything Netlify needs is in this folder.

## Deploy by drag and drop (about a minute)
1. Unzip this package.
2. Go to https://app.netlify.com/drop (signed in to your Netlify account).
3. Drag the whole `mcm-tfp-deploy` folder onto the page.
4. Netlify gives you a live link. Rename the site under Site configuration > Change site name.

## Deploy from GitHub (auto-updates on every push, like your other course sites)
1. Create a new repository on GitHub (for example `JGrimmFernbridge/middle_class_moneyball`).
2. Upload the contents of this folder to it (index.html at the top level).
3. In Netlify: Add new site > Import an existing project > GitHub > pick the repository.
4. Build command: leave empty. Publish directory: `.`
5. Deploy.

## Editing words (no code)
All text lives in `content.js`. Open it in any text editor, change the words between the quotes, save, and redeploy (drag the folder again, or push to GitHub).
- Your lesson text: replace `"lesson": null` with `"lesson": "Your text here"` in any module.
- Lewis quotes: under `"lewis"`, type his exact line into an entry's `"quote": ""` field.

## What is in the folder
- `index.html` — the page and its styles (The Future Poor brand tokens)
- `app.js` — the app (compiled; you don't need to touch it)
- `content.js` — all course content
- `notes/` — your handwritten pages and the whiteboard frame
- `brand/` — The Future Poor logos and favicon from the brand kit
- `netlify.toml` — Netlify settings
- `source/` — the editable app source, for developers only; not needed to deploy

Fonts (Source Serif 4, Public Sans) load from Google Fonts and React loads from cdnjs, so the site needs an internet connection to display.
