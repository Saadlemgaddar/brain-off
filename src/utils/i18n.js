// Système de traduction + contenu localisé.
// Chaque langue a deux jeux de lignes commentateur : "alcohol" et "clean" (sans mention d'alcool).

// Darija temporairement désactivé du sélecteur (contenu à améliorer) — tout le texte et les
// lignes vocales darija restent dans ce fichier, prêts à être réactivés en décommentant
// la ligne ci-dessous.
export const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  // { code: 'darija', label: 'الدارجة', flag: '🇲🇦' },
]

export const UI_TEXT = {
  fr: {
    appName: 'BRAIN OFF',
    tagline: 'Your brain. Your phone. Good luck.',
    subtitle: '23 défis. 7 mini-jeux. Un cerveau qui lâche progressivement.',
    partyMode: '🎉 MODE SOIRÉE',
    soloMode: '🧍 JOUER SEUL',
    back: 'Retour',
    players: 'JOUEURS',
    addPlayer: '+ Ajouter un joueur',
    challengesPerPlayer: 'DÉFIS PAR JOUEUR',
    chaosMode: 'MODE CHAOS',
    chaosDesc: "L'écran devient de plus en plus ingérable",
    manualLevel: 'Choisir manuellement le niveau',
    startGame: "C'EST PARTI 🚀",
    turnOf: 'Tour de',
    finalRanking: 'CLASSEMENT FINAL',
    partyOver: 'La soirée est terminée',
    replay: '🔁 REJOUER (mêmes joueurs)',
    mainMenu: '🏠 Menu principal',
    points: 'points',
    yourTurn: "C'EST AU TOUR DE",
    drinkChoiceTitle: 'Comment tu joues ?',
    drinkChoiceSubtitle: 'Ça change juste le ton des messages',
    withAlcohol: '🍺 Avec alcool',
    withAlcoholDesc: 'Gages et messages corsés',
    noAlcohol: '🙂 Sans alcool',
    noAlcoholDesc: 'Que du fun, zéro mention d\'alcool',
    languageChoiceTitle: 'Choisis ta langue',
    voiceOn: '🔊 Voix activée',
    voiceOff: '🔇 Voix désactivée',
    continue: 'Continuer',
    ageCheckTitle: "Avant de commencer",
    ageCheckSubtitle: "As-tu 18 ans ou plus ?",
    ageCheckYes: "Oui, j'ai 18 ans ou plus",
    ageCheckNo: "Non, j'ai moins de 18 ans",
    ageCheckMinorNotice: "Le mode avec alcool n'est pas disponible. Amuse-toi bien en mode sans alcool !",
    responsibleDrinkingTitle: "Un petit rappel",
    responsibleDrinkingBody: "Brain Off n'encourage pas la consommation d'alcool. Bois avec modération, hydrate-toi, et surtout : personne ne prend le volant après avoir bu. Amusez-vous bien, en toute sécurité.",
    responsibleDrinkingButton: "J'ai compris",
    testButtonAlcohol: "🍺 Test si t'es bourré",
    testButtonClean: "🧠 Test de capacité",
    testIntro: "5 défis en mode chaos total. Prêt ?",
    testVerdictDrunkFail: "Attention, t'es déjà bien bourré",
    testVerdictDrunkSuccess: "Ça va, tu tiens le coup",
    testVerdictCleanFail: "T'as besoin d'un peu de repos",
    testVerdictCleanSuccess: "Ton cerveau pète la forme",
    testScoreLabel: "défis réussis",
    testBackToMenu: "🏠 Retour au menu",
    testReplay: "🔁 Refaire le test",
    readyButton: "JE SUIS PRÊT 👍",
    tapAnywhereReady: "(ou touche l'écran)",
    nextRound: 'Tour suivant',
    settingsTitle: 'Réglages',
    language: 'Langue',
    gameMode: 'Mode de jeu',
    changeSettings: '⚙️ Langue & mode',
    lastPlaceTitle: 'LE PLUS BOURRÉ DE LA SOIRÉE',
    lastPlaceTitleClean: 'LE GRAND PERDANT DE LA SOIRÉE',
  },
  en: {
    appName: 'BRAIN OFF',
    tagline: 'Your brain. Your phone. Good luck.',
    subtitle: '23 challenges. 7 minigames. A brain that fails progressively.',
    partyMode: '🎉 PARTY MODE',
    soloMode: '🧍 PLAY SOLO',
    back: 'Back',
    players: 'PLAYERS',
    addPlayer: '+ Add a player',
    challengesPerPlayer: 'CHALLENGES PER PLAYER',
    chaosMode: 'CHAOS MODE',
    chaosDesc: 'The screen gets more and more unmanageable',
    manualLevel: 'Choose the level manually',
    startGame: "LET'S GO 🚀",
    turnOf: "Turn of",
    finalRanking: 'FINAL RANKING',
    partyOver: 'The party is over',
    replay: '🔁 REPLAY (same players)',
    mainMenu: '🏠 Main menu',
    points: 'points',
    yourTurn: "IT'S NOW TURN OF",
    drinkChoiceTitle: 'How are you playing?',
    drinkChoiceSubtitle: 'This only changes the tone of the messages',
    withAlcohol: '🍺 With alcohol',
    withAlcoholDesc: 'Dares and spicier messages',
    noAlcohol: '🙂 No alcohol',
    noAlcoholDesc: 'Just fun, zero alcohol mentions',
    languageChoiceTitle: 'Choose your language',
    voiceOn: '🔊 Voice on',
    voiceOff: '🔇 Voice off',
    continue: 'Continue',
    ageCheckTitle: "Before we start",
    ageCheckSubtitle: "Are you 18 or older?",
    ageCheckYes: "Yes, I'm 18 or older",
    ageCheckNo: "No, I'm under 18",
    ageCheckMinorNotice: "The alcohol mode isn't available. Have fun in no-alcohol mode!",
    responsibleDrinkingTitle: "A quick reminder",
    responsibleDrinkingBody: "Brain Off doesn't encourage drinking alcohol. Drink responsibly, stay hydrated, and above all: nobody drives after drinking. Have fun, safely.",
    responsibleDrinkingButton: "Got it",
    testButtonAlcohol: "🍺 Am I drunk test",
    testButtonClean: "🧠 Capacity test",
    testIntro: "5 challenges in full chaos mode. Ready?",
    testVerdictDrunkFail: "Careful, you're pretty drunk already",
    testVerdictDrunkSuccess: "You're good, still holding up",
    testVerdictCleanFail: "You could use some rest",
    testVerdictCleanSuccess: "Your brain is in great shape",
    testScoreLabel: "challenges passed",
    testBackToMenu: "🏠 Back to menu",
    testReplay: "🔁 Retry the test",
    readyButton: "I'M READY 👍",
    tapAnywhereReady: '(or tap the screen)',
    nextRound: 'Next round',
    settingsTitle: 'Settings',
    language: 'Language',
    gameMode: 'Game mode',
    changeSettings: '⚙️ Language & mode',
    lastPlaceTitle: 'MOST DRUNK OF THE NIGHT',
    lastPlaceTitleClean: 'THE BIGGEST LOSER OF THE NIGHT',
  },
  darija: {
    appName: 'BRAIN OFF',
    tagline: 'Le cerveau dyalek. Portable dyalek. Bonne chance.',
    subtitle: '23 défis. 7 alaab. Le cerveau kaysalak ftim2.',
    partyMode: '🎉 MODE SOIRÉE',
    soloMode: '🧍 LAAB WEHDEK',
    back: 'Rj3a',
    players: 'LOU3ABA',
    addPlayer: '+ Zid wa7ed laab',
    challengesPerPlayer: 'DÉFIS L KOL WA7ED',
    chaosMode: 'MODE CHAOS',
    chaosDesc: "Chacha ghadi tewli sa3iba b la3qal",
    manualLevel: 'Khtar niveau b yeddik',
    startGame: 'YALLAH 🚀',
    turnOf: 'Dor dyal',
    finalRanking: 'CLASSEMENT NIHAI',
    partyOver: 'Soirée salat',
    replay: '🔁 3AWD (nafss lou3aba)',
    mainMenu: '🏠 Menu principal',
    points: 'points',
    yourTurn: 'DABA DOR DYAL',
    drinkChoiceTitle: 'Kifach ghadi tel3ab?',
    drinkChoiceSubtitle: 'Ghi katbeddel ton dyal les messages',
    withAlcohol: '🍺 B lكحول',
    withAlcoholDesc: 'Gages o messages nari',
    noAlcohol: '🙂 Bla كحول',
    noAlcoholDesc: 'Ghi fun, walou 3la lkhamr',
    languageChoiceTitle: 'Khtar loghtek',
    voiceOn: '🔊 Sawt mchaal',
    voiceOff: '🔇 Sawt mtfi',
    continue: 'Kammel',
    ageCheckTitle: "Qbel ma nbdaw",
    ageCheckSubtitle: "3andek 18 3am wla ktar?",
    ageCheckYes: "Ah, 3andi 18 wla ktar",
    ageCheckNo: "Lla, 3andi ktar men 18",
    ageCheckMinorNotice: "Mode b lكحول machi disponible. Tferrej mzyan f mode bla كحول!",
    responsibleDrinkingTitle: "Tذكير sghir",
    responsibleDrinkingBody: "Brain Off ma kaycheje3ch 3la chorb lكحول. Chreb b 3a9el, chreb l ma, o l muhim: hta wahed ma ysou9 mnba3d ma yechreb. Tferrjou mzyan, b amana.",
    responsibleDrinkingButton: "Fhemt",
    testButtonAlcohol: "🍺 Test ila nti skran",
    testButtonClean: "🧠 Test dyal l capacité",
    testIntro: "5 défis f mode chaos kamel. Wjed?",
    testVerdictDrunkFail: "Attention, nti skran b jd",
    testVerdictDrunkSuccess: "La bas, mazal wa9ef",
    testVerdictCleanFail: "Khassek chi rha",
    testVerdictCleanSuccess: "L3aql dyalek f forme",
    testScoreLabel: "défis rbe7ti",
    testBackToMenu: "🏠 Rj3a l menu",
    testReplay: "🔁 3awd test",
    readyButton: 'RANI MOUJOUD 👍',
    tapAnywhereReady: '(wla dreb chacha)',
    nextRound: 'Dor li jaya',
    settingsTitle: 'I3dadat',
    language: 'Lougha',
    gameMode: 'Mode dyal l3ab',
    changeSettings: '⚙️ Lougha o mode',
    lastPlaceTitle: 'LI SKRAN BZAF F SOIRÉE',
    lastPlaceTitleClean: 'LI KHSER BZAF F SOIRÉE',
  },
}

// Lignes du "commentateur" pour chaque mini-jeu (intro courte, dite au début de chaque défi)
export const VOICE_INTROS = {
  fr: {
    path: 'Suis le chemin sans sortir !',
    shape: 'Reproduis la forme avec ton doigt !',
    memory: 'Mémorise bien, ça va vite !',
    aim: 'Touche la cible, vite !',
    math: 'Calcule avant la fin du temps !',
    oddOneOut: "Trouve l'intrus dans la grille !",
    reflex: 'Tape seulement si on te le dit !',
    trapButton: 'Touche le bouton vert !',
    trapNoTouch: "Ne touche surtout pas l'écran !",
  },
  en: {
    path: 'Follow the path without leaving it!',
    shape: 'Trace the shape with your finger!',
    memory: 'Memorize fast, it goes quick!',
    aim: 'Hit the target, quick!',
    math: 'Solve it before time runs out!',
    oddOneOut: 'Find the odd one out!',
    reflex: 'Only tap when told to!',
    trapButton: 'Hit the green button!',
    trapNoTouch: "Whatever you do, don't touch the screen!",
  },
  darija: {
    path: 'Tbe3 trik bla ma tkhrej!',
    shape: 'Rsem chakl b sab3ek!',
    memory: 'Hfed mezyan, ghadi tmchi bzerba!',
    aim: 'Dreb l cible, bzerba!',
    math: "Hseb qbel ma yssali lwe9t!",
    oddOneOut: 'Lqa li mختلف!',
    reflex: 'Dreb ghi ila galou lik!',
    trapButton: 'Dreb l bouton lekhdar!',
    trapNoTouch: 'Hta la tmess chacha!',
  },
}

// Résultat: succès — variantes "fun" utilisables dans les deux modes (aucune mention d'alcool)
export const VOICE_SUCCESS_CLEAN = {
  fr: [
    'Pas mal du tout !',
    'Ton cerveau tient encore debout !',
    'Impressionnant !',
    'La classe.',
    'On y croyait pas, mais bravo.',
    'Toujours en vie, dans tous les sens du terme.',
  ],
  en: [
    'Not bad at all!',
    'Your brain is still standing!',
    'Impressive!',
    'Classy.',
    "We didn't believe in you, but nice job.",
    'Still alive, in every sense of the word.',
  ],
  darija: [
    'Machi khaib!',
    'L3aql dyalek mazal wa9ef!',
    'Zwina bezaf!',
    'Chi haja tenja!',
    'Ma kunash netqado fik, wlakin bravo.',
    'Mazal 3aych, b kolchi ma3na.',
  ],
}

// Résultat: échec — variantes "clean" (sans alcool), 100% fun, aucune mention de boisson
export const VOICE_FAIL_CLEAN = {
  fr: [
    "Aïe. C'était pas ça.",
    'Le cerveau a lâché sur ce coup-là.',
    "On repassera pour la coordination.",
    'Ça arrive aux meilleurs. Enfin, pas souvent.',
    'Raté ! On efface et on recommence.',
    "Le prochain sera peut-être le bon.",
  ],
  en: [
    'Ouch. That was not it.',
    'Your brain gave up on that one.',
    'Coordination: still a work in progress.',
    'Happens to the best. Well, not often.',
    'Missed it! Wipe it off and try again.',
    'Maybe the next one will be the one.',
  ],
  darija: [
    'Ayy. Machi hadchi.',
    "L3aql lah yer7em waldih, sda3.",
    'La coordination mazal baghia khedma.',
    "Kaywe93 l les meilleurs. Wlakin machi bzaf.",
    'Faute! Nmsa7o o n3awdo.',
    'Yemken li jaya ghadi tkoun hia.',
  ],
}

// Résultat: succès — variantes "party" (avec alcool), punchline courte AVANT la ligne de distribution de gorgée
export const VOICE_SUCCESS_ALCOHOL = {
  fr: [
    'Bien joué !',
    'Il tient encore debout, incroyable.',
    'Sobre et efficace, littéralement.',
    'Un tour de plus sans tomber, respect.',
    'Ça, ça se fête.',
  ],
  en: [
    'Nice one!',
    'Still standing, unbelievable.',
    'Sober and effective, literally.',
    'Another round without falling, respect.',
    'That deserves a toast.',
  ],
  darija: [
    'Zwina!',
    'Mazal wa9ef, chi haja ma tetsedq9.',
    'Sobre o mzyan f nafss lweqt.',
    'Dor akhor bla ma yta7, respect.',
    'Hadi khassha fer7a.',
  ],
}

// Résultat: échec — variantes "party" (avec alcool), punchline courte AVANT la ligne "tu dois boire"
export const VOICE_FAIL_ALCOHOL = {
  fr: [
    'Raté !',
    'Il est officiellement bourré.',
    'Le cerveau a coulé.',
    'Ça se soigne avec un verre, tradition oblige.',
    'Perdu, champion.',
  ],
  en: [
    'Missed it!',
    'Officially drunk now.',
    'Brain sank on that one.',
    'This calls for a drink, tradition demands it.',
    'Lost it, champ.',
  ],
  darija: [
    'Faute!',
    'Rah skran b jd.',
    "L3aql ghreq f hadchi.",
    'Hadi khassha kass, tradition wajba.',
    'Khser, a batal.',
  ],
}

// Lignes de distribution de gorgée — concaténées après la punchline succès/échec ci-dessus.
// {name} est remplacé par le nom du joueur désigné pour boire.
export const DRINK_ASSIGN_WIN = {
  // Victoire : le gagnant désigne un AUTRE joueur au hasard pour boire
  fr: (name) => `${name}, un verre pour toi, offert par le gagnant !`,
  en: (name) => `${name}, a drink for you, courtesy of the winner!`,
  darija: (name) => `${name}, kass lik, hdiya men li rbe7!`,
}

export const DRINK_ASSIGN_LOSE = {
  // Défaite : le joueur qui a raté boit lui-même
  fr: (name) => `${name}, à toi de boire !`,
  en: (name) => `${name}, drink up!`,
  darija: (name) => `${name}, chreb nta!`,
}

export function getRandomLine(pool) {
  return pool[Math.floor(Math.random() * pool.length)]
}

export function getResultVoiceLines(lang, alcoholMode, success) {
  if (success) {
    return alcoholMode ? VOICE_SUCCESS_ALCOHOL[lang] : VOICE_SUCCESS_CLEAN[lang]
  }
  return alcoholMode ? VOICE_FAIL_ALCOHOL[lang] : VOICE_FAIL_CLEAN[lang]
}

// Construit la phrase complète de gorgée à partir du résultat (nom + gagnant/perdant)
export function getDrinkAssignLine(lang, success, targetName) {
  const builder = success ? DRINK_ASSIGN_WIN[lang] : DRINK_ASSIGN_LOSE[lang]
  return builder(targetName)
}
