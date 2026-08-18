# 🧠🥴 BRAIN OFF

> Your brain. Your phone. Good luck.

Jeu de soirée multijoueur (2 à 8 joueurs) sur un seul téléphone. 7 mini-jeux, 23 niveaux, et un **mode Drunk** qui simule progressivement la perte de coordination (flou, tremblement, décalage tactile, cible qui bouge, chemin flou, contrôles inversés en fin de soirée...).

Construit en **React + Vite**, packagé en APK Android via **Capacitor**.

---

## 🚀 Étape 1 — Installer les dépendances (sur TON ordinateur)

Ce projet n'a pas encore de `node_modules` (pas d'accès réseau possible depuis l'environnement où il a été écrit). Il te faut juste :

1. Installer [Node.js](https://nodejs.org/) (version 18 ou plus récente) si ce n'est pas déjà fait.
2. Décompresser le dossier `brain-off`.
3. Ouvrir un terminal dans ce dossier et lancer :

```bash
npm install
```

Ça télécharge React, Vite et Capacitor (~1-2 minutes).

## 🧪 Étape 2 — Tester dans le navigateur (optionnel mais conseillé)

```bash
npm run dev
```

Ouvre le lien affiché (genre `http://localhost:5173`) dans Chrome sur ton téléphone (même wifi) ou dans le navigateur de ton PC en mode "responsive/mobile" (F12 → icône téléphone) pour tester rapidement avant de faire l'APK.

## 📱 Étape 3 — Générer l'APK Android

### Option A — Capacitor + Android Studio (recommandé, gratuit, fiable)

1. Installe [Android Studio](https://developer.android.com/studio) (gratuit).
2. Dans le dossier du projet :

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

3. Android Studio s'ouvre automatiquement avec le projet. Une fois le sync Gradle terminé (barre de progression en bas), va dans le menu :
   **Build → Build Bundle(s) / APK(s) → Build APK(s)**

4. L'APK sera généré dans :
   `android/app/build/outputs/apk/debug/app-debug.apk`

5. Transfère ce fichier sur ton téléphone (câble USB, Drive, WhatsApp...) et installe-le (il faut autoriser "Sources inconnues" dans les paramètres Android la première fois).

> 💡 Si tu modifies le code plus tard : refais juste `npm run build` puis `npx cap sync android` avant de rebuilder dans Android Studio.

### Option B — PWABuilder (sans installer Android Studio)

1. Fais d'abord `npm run build`, puis héberge le contenu du dossier `dist/` quelque part (Vercel, Netlify, GitHub Pages — gratuit et en 2 minutes).
2. Va sur [pwabuilder.com](https://www.pwabuilder.com/), colle l'URL de ton site.
3. Clique sur "Package for Android" → télécharge l'APK généré.

C'est plus rapide à mettre en place mais un peu moins direct que Capacitor (nécessite d'héberger le site quelque part au préalable).

---

## 🎮 Contenu du jeu

### Les 7 mini-jeux
- 🌀 **Le chemin** — suivre un tracé du point A au point B
- ✍️ **Dessine la forme** — reproduire ⭐ ❤️ ⭕ ⚡ au doigt
- 🧠 **Mémoire express** — retenir des objets, retrouver leur position ou l'intrus manquant
- 🎯 **Vise le point** — toucher une séquence de cibles colorées
- 🔢 **Calcul débile** — résoudre un calcul en 3-5 secondes (chiffres remplacés par 🍺 en mode Drunk)
- 👀 **Trouve l'intrus** — repérer l'élément différent dans une grille
- 🖐️ **Réflexe** — TAP / DON'T TAP, tester le contrôle des impulsions

### Les pièges 😂
- **Touche le bouton vert** — même en tapant le bon bouton, le jeu dira souvent "trop lent !"
- **Ne touche pas l'écran** — résister à la tentation d'un gros bouton rouge qui apparaît

### Le mode Drunk 🥴
La progression est automatique au fil de la soirée (SOBER → TIPSY → DRUNK → WASTED → FINAL BOSS), ou réglable manuellement dans les options avant de lancer une partie. Plus le niveau monte :
- l'écran tremble et s'incline légèrement
- le tracé/la forme devient flou et pivote
- le point de contact tactile est décalé (mauvaise coordination simulée)
- le compte à rebours accélère
- à 100% (Final Boss) : teintes qui changent, vignette violette, contrôles quasi ingérables

### Mode soirée
2 à 8 joueurs, à tour de rôle. Classement final avec médailles 🥇🥈🥉💀 à la fin.

---

## 🛠️ Structure du projet

```
src/
├── App.jsx                  # Routeur d'écrans
├── context/GameContext.jsx  # État global (joueurs, scores, niveau d'ivresse)
├── utils/levels.js          # Les 23 niveaux
├── utils/drunkEffects.js    # Calcul des effets visuels/tactiles selon l'intensité
├── components/              # Écrans (Home, Setup, Playing, Result, Leaderboard)
└── games/                   # Les 9 mini-jeux (7 + 2 pièges)
```

## ✏️ Pour ajouter un niveau

Ajoute une entrée dans `src/utils/levels.js` avec un `type` existant (path, shape, memory, aim, math, oddOneOut, reflex, trapButton, trapNoTouch) et une config adaptée — pas besoin de toucher au reste du code.

## 🎨 Pour changer l'identité visuelle

Toutes les couleurs sont dans `src/index.css` (`:root`), variables `--acid`, `--tipsy`, `--drunk`, `--wasted`, `--final`.
