# Journey to the East 

To view the game, visit this link: https://sara-k03.github.io/journey-to-the-east/#/ 

## Description
[Visit this link to learn more](https://www.sarayukondaveeti.com/journey-to-the-east.html)

## Code Structure 

This game is currently front-end only and player progress data is stored locally (it does not sync across devices or browsers). A proper backend will be designed after the frontend of the game has been fleshed out. 

The game is a single-page React app built with Vite and deployed to GitHub Pages.

```
├── index.html                    # Vite entry HTML (loads Noto Serif Devanagari)
├── vite.config.js                # Sets the /journey-to-the-east/ base path for GitHub Pages
├── .github/workflows/deploy.yml  # Builds and deploys to GitHub Pages on every push to main
├── background-images/            # Background photos (the site uses the *-web.jpg copies and raigad-fort.jpg)
├── fonts/jaini/                  # Jaini font files and license
└── src/
    ├── main.jsx                  # Mounts <App /> and imports global styles
    ├── App.jsx                   # Routes (HashRouter, so deep links work on GitHub Pages)
    ├── levels.js                 # List of all 12 levels: name, description, route, question count, background
    ├── progress.js               # Reads/writes progress, high scores, and seen lessons in localStorage
    ├── styles.css                # All styling
    ├── pages/
    │   ├── Home.jsx              # Level select screen with a progress bar per level
    │   ├── Republic.jsx          # Level 1 page
    │   └── Maratha.jsx           # Level 2 page
    ├── components/
    │   ├── TranscriptionLevel.jsx  # Reusable quiz: show Devanāgarī, player types IAST
    │   ├── FallingLevel.jsx      # Reusable falling game with game and practice modes
    │   ├── IastKeys.jsx          # On-screen buttons for IAST characters (ā, ṭ, ś, …)
    │   ├── LessonDialog.jsx      # Modal that shows a level's lesson
    │   ├── LessonButton.jsx      # Light bulb button that reopens the lesson
    │   └── ProgressBar.jsx
    ├── data/
    │   ├── republic.js           # Level 1 questions
    │   └── maratha.js            # Level 2 consonants, conjunct list, and generated akṣaras
    └── lessons/
        ├── LessonParts.jsx       # Shared lesson building blocks (Sound, Deva)
        ├── RepublicLesson.jsx    # Level 1 lesson content
        └── MarathaLesson.jsx     # Level 2 lesson, with the mātrā explorer and akṣara builder
```

### How a level fits together

Each playable level has an entry in `src/levels.js` with a `path`, a question set in `src/data/`, a lesson in `src/lessons/`, and a page in `src/pages/` that passes those into a shared level component (`TranscriptionLevel` or `FallingLevel`). The page's route is registered in `src/App.jsx`. Levels without a `path` show as "Coming soon" on the homepage.

A question counts toward progress only if the player answers it correctly without opening the lesson first. Progress is saved per level in `localStorage` under the `jtte-progress` key.

### Level 2 (Maratha): The Falling Akshara Game

Akṣaras fall one at a time, and the player types each one in IAST before it hits the ground. An answer clears as soon as it matches.

- **Game mode:** The user has 3 lives, and each akṣara falls a little faster than the last (8 seconds at first, down to 3). Only game mode counts toward progress. The best score is saved under the `jtte-high-scores` key.
- **Practice mode:** Practice mode doesn't have a cap on the number of lives, but it also doesn't contribute to the progress. The player picks the akṣaras (all, consonant + mātrā, or conjuncts) and a fixed speed, and can reveal the answer.

The pool is built in `src/data/maratha.js`: 33 consonants and 191 conjuncts, each in 15 forms (the inherent a, 11 mātrās, anusvāra, visarga, and virāma), for 3,360 akṣaras. To add or remove a conjunct, edit its line in `conjunctGroups`. The progress bar counts forms, and a group (one consonant or conjunct) is complete once all 15 of its forms are done. The lesson opens automatically only on the first visit (`jtte-lessons-seen`).

## AI Usage

Claude Code was used as a coding assistant for this. 

I mostly try to avoid writing lessons with AI. Lesson 1 is written by me. However, I am new to learning the Devanagari script myself, so Claude helped me heavily with writing Lesson 2. Claude also helped me come up with the most useful conjuct consonant pairs. As I learn more, increasingly less AI will be used in the writing. 

## Credits

### Images

- **Homepage background:** ["Ellora, cave 16, Kailasa Temple"](https://openverse.org/image/e0bdd905-2022-468c-ae44-54d591796ef1) by Arian Zwegers is licensed under [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/). The site uses a resized and compressed copy (`background-images/main-ellora-caves-web.jpg`).
- **Level 1 background:** ["Mumbai Rising"](https://openverse.org/image/8e9f0d3d-384d-4bf7-8f48-681fefa07487) by Vidur Malhotra is marked with [Public Domain Mark 1.0](https://creativecommons.org/publicdomain/mark/1.0/). The site uses a resized and compressed copy (`background-images/modern-mumbai-web.jpg`).
- **Level 2 background:** ["Buruj, Raigad Fort, India (cropped)"](https://openverse.org/image/41707fd7-6929-4092-a6d6-f40e54eeed69) by Nilamgandhre is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The site uses `background-images/raigad-fort.jpg`.

### Fonts

- **[Jaini](https://github.com/EkType/Jaini)** by Ek Type (Devanagari by Girish Dalvi and Maithili Shingre; Latin by Taresh Vohra). Copyright 2016 The Jaini Project Authors. Licensed under the [SIL Open Font License 1.1](https://openfontlicense.org). See `fonts/jaini/OFL.txt`.
- **[Noto Serif Devanagari](https://fonts.google.com/noto/specimen/Noto+Serif+Devanagari)** by Google, loaded from Google Fonts. Licensed under the [SIL Open Font License 1.1](https://openfontlicense.org).
