# Journey to the East 

To view the game, visit this link: https://sara-k03.github.io/journey-to-the-east/#/ 

## Description
[Visit this link to learn more](https://www.sarayukondaveeti.com/journey-to-the-east.html)

## Code Structure 

This game is currently front-end only and player progress data is stored locally (it does not sync across devices or browsers). A proper backend will be designed after the crontend of the game has been fleshed out. 

The game is a single-page React app built with Vite and deployed to GitHub Pages.

```
├── index.html                    # Vite entry HTML (loads Noto Serif Devanagari)
├── vite.config.js                # Sets the /journey-to-the-east/ base path for GitHub Pages
├── .github/workflows/deploy.yml  # Builds and deploys to GitHub Pages on every push to main
├── background-images/            # Background photos plus the resized *-web.jpg copies the site uses
├── fonts/jaini/                  # Jaini font files and license
└── src/
    ├── main.jsx                  # Mounts <App /> and imports global styles
    ├── App.jsx                   # Routes (HashRouter, so deep links work on GitHub Pages)
    ├── levels.js                 # List of all 12 levels: name, description, route, question count, background
    ├── progress.js               # Reads/writes player progress in localStorage
    ├── styles.css                # All styling
    ├── pages/
    │   ├── Home.jsx              # Level select screen with a progress bar per level
    │   └── Republic.jsx          # Level 1 page
    ├── components/
    │   ├── TranscriptionLevel.jsx  # Reusable quiz: show Devanāgarī, player types IAST
    │   ├── IastKeys.jsx          # On-screen buttons for IAST characters (ā, ṭ, ś, …)
    │   ├── LessonDialog.jsx      # Modal that shows a level's lesson
    │   ├── LessonButton.jsx      # Light bulb button that reopens the lesson
    │   └── ProgressBar.jsx
    ├── data/
    │   └── republic.js           # Level 1 questions
    └── lessons/
        └── RepublicLesson.jsx    # Level 1 lesson content
```

### How a level fits together

Each playable level has an entry in `src/levels.js` with a `path`, a question set in `src/data/`, a lesson in `src/lessons/`, and a page in `src/pages/` that passes those into a shared level component (currently `TranscriptionLevel`). The page's route is registered in `src/App.jsx`. Levels without a `path` show as "Coming soon" on the homepage.

A question counts toward progress only if the player answers it correctly without opening the lesson first. Progress is saved per level in `localStorage` under the `jtte-progress` key.

## Credits

### Images

- **Homepage background:** ["Ellora, cave 16, Kailasa Temple"](https://openverse.org/image/e0bdd905-2022-468c-ae44-54d591796ef1) by Arian Zwegers is licensed under [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/). The site uses a resized and compressed copy (`background-images/main-ellora-caves-web.jpg`).
- **Level 1 background:** ["Mumbai Rising"](https://openverse.org/image/8e9f0d3d-384d-4bf7-8f48-681fefa07487) by Vidur Malhotra is marked with [Public Domain Mark 1.0](https://creativecommons.org/publicdomain/mark/1.0/). The site uses a resized and compressed copy (`background-images/modern-mumbai-web.jpg`).

### Fonts

- **[Jaini](https://github.com/EkType/Jaini)** by Ek Type (Devanagari by Girish Dalvi and Maithili Shingre; Latin by Taresh Vohra). Copyright 2016 The Jaini Project Authors. Licensed under the [SIL Open Font License 1.1](https://openfontlicense.org). See `fonts/jaini/OFL.txt`.
- **[Noto Serif Devanagari](https://fonts.google.com/noto/specimen/Noto+Serif+Devanagari)** by Google, loaded from Google Fonts. Licensed under the [SIL Open Font License 1.1](https://openfontlicense.org).
