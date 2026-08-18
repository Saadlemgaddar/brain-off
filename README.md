# 🧠🥴 BRAIN OFF

> Your brain. Your phone. Good luck.

Jeu de soirée multijoueur (2 à 8 joueurs) sur un seul téléphone. 7 mini-jeux, 23 niveaux, et un **mode chaos** qui simule progressivement la perte de coordination (flou, tremblement, décalage tactile, cible qui bouge, chemin flou, contrôles inversés en fin de soirée...).

Construit en **React + Vite**, packagé en APK Android via **Capacitor**.

---

## 🆕 Nouveautés de cette version

- **Écran d'intro** : choix de la langue (Français / English / الدارجة) puis choix "Avec alcool" ou "Sans alcool" avant de jouer
- **Mode sans alcool** : aucune mention, texte, emoji ou message vocal lié à l'alcool nulle part dans l'app — tous les textes basculent vers des versions neutres et 100% fun
- **Commentateur vocal** : à chaque défi et à chaque résultat, une voix annonce ce qu'il faut faire et commente le résultat ("T'as perdu, bois un coup" en mode alcool / une punchline neutre en mode sans alcool), avec plusieurs variantes aléatoires pour ne jamais se répéter
- **Voix native, pas d'API externe** : le système utilise le moteur Text-to-Speech déjà installé sur le téléphone (Web Speech API / `speechSynthesis`). Aucune connexion internet requise, aucune clé API, aucun fichier audio à télécharger — tout tourne en local dans l'APK. Un bouton permet de couper la voix depuis l'écran d'accueil
- **Bugs corrigés** : les faux "raté" sur "Le chemin" et "Dessine la forme" (tolérance tactile trop stricte, ne compensait pas le fait que le doigt cache le point visé) ; les timers étaient trop agressifs en mode chaos (accélération plafonnée, temps de base augmentés partout)

### À savoir sur la voix
- Le Darija n'a pas de voix dédiée sur la quasi-totalité des téléphones Android : le système retombe automatiquement sur une voix arabe générique, puis sur le français si aucune voix arabe n'est installée. Le texte à l'écran reste toujours affiché quoi qu'il arrive — la voix n'est qu'un bonus, jamais bloquant.
- Si tu veux remplacer ce système par de vrais fichiers audio enregistrés plus tard (une vraie voix humaine plutôt que le TTS système), la structure est prête à recevoir ça dans `src/utils/voice.js` — dis-le-moi et je peux préparer l'architecture pour charger des fichiers `.mp3`/`.ogg` à la place.

---

## 🚀 Étape 1 — Installer les dépendances (sur TON ordinateur ou StackBlitz)

```bash
npm install
```

## 🧪 Étape 2 — Tester dans le navigateur

```bash
npm run dev
```

## 📱 Étape 3 — Générer l'APK Android

### Option A — Capacitor + Android Studio (recommandé)

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Puis dans Android Studio : **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
L'APK sera dans `android/app/build/outputs/apk/debug/app-debug.apk`.

### Option B — PWABuilder (sans Android Studio)

1. `npm run build`, héberge `dist/` (Vercel, Netlify, StackBlitz preview...)
2. Va sur [pwabuilder.com](https://www.pwabuilder.com/), colle l'URL
3. "Package for Android" → télécharge l'APK

### Option C — Depuis StackBlitz (tablette, sans PC)

1. Importe le repo GitHub dans StackBlitz : `https://stackblitz.com/github/TON-PSEUDO/TON-REPO`
2. `npm run dev` dans le terminal intégré
3. Copie l'URL de preview publique
4. Colle-la dans PWABuilder comme ci-dessus

---

## 🎮 Contenu du jeu

### Les 7 mini-jeux
- 🌀 **Le chemin** — suivre un tracé du point A au point B
- ✍️ **Dessine la forme** — reproduire ⭐ ❤️ ⭕ ⚡ au doigt
- 🧠 **Mémoire express** — retenir des objets, retrouver leur position ou l'intrus manquant
- 🎯 **Vise le point** — toucher une séquence de cibles colorées
- 🔢 **Calcul débile** — résoudre un calcul en quelques secondes
- 👀 **Trouve l'intrus** — repérer l'élément différent dans une grille
- 🖐️ **Réflexe** — TAP / DON'T TAP, tester le contrôle des impulsions

### Les pièges 😂
- **Touche le bouton vert** — même en tapant le bon bouton, le jeu dira souvent "trop lent !"
- **Ne touche pas l'écran** — résister à la tentation d'un gros bouton rouge qui apparaît

### Le mode chaos 🥴
Progression automatique au fil de la soirée, ou réglable manuellement. Plus le niveau monte : écran qui tremble et s'incline, tracé flou, décalage du point de contact tactile, compte à rebours qui accélère (plafonné pour rester jouable), teintes qui changent, vignette en Final Boss.

### Mode soirée
2 à 8 joueurs, à tour de rôle. Classement final avec médailles à la fin.

---

## 🛠️ Structure du projet

```
src/
├── App.jsx                  # Routeur d'écrans
├── context/GameContext.jsx  # État global (joueurs, scores, langue, mode alcool, niveau de chaos)
├── utils/levels.js          # Les 23 niveaux
├── utils/drunkEffects.js    # Calcul des effets visuels/tactiles selon l'intensité
├── utils/i18n.js            # Traductions FR/EN/Darija + banque de messages commentateur
├── utils/voice.js           # Système Text-to-Speech natif (Web Speech API)
├── components/              # Écrans (Intro, Home, Setup, Playing, Result, Leaderboard)
└── games/                   # Les 9 mini-jeux (7 + 2 pièges)
```

## ✏️ Pour ajouter une phrase du commentateur

Toutes les lignes vocales sont dans `src/utils/i18n.js`, dans `VOICE_SUCCESS_CLEAN`, `VOICE_FAIL_CLEAN`, `VOICE_SUCCESS_ALCOHOL`, `VOICE_FAIL_ALCOHOL` — une liste par langue. Ajoute une ligne dans le tableau de la langue voulue, elle sera piochée aléatoirement avec les autres.

## ✏️ Pour ajouter un niveau

Ajoute une entrée dans `src/utils/levels.js` avec un `type` existant — pas besoin de toucher au reste du code.

## 🎨 Pour changer l'identité visuelle

Toutes les couleurs sont dans `src/index.css` (`:root`), variables `--acid`, `--tipsy`, `--drunk`, `--wasted`, `--final`.

