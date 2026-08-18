// Système de traduction + contenu localisé.
// Chaque langue a deux jeux de lignes commentateur : "alcohol" et "clean" (sans mention d'alcool).

export const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'darija', label: 'الدارجة', flag: '🇲🇦' },
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

// Résultat: succès — variantes "party" (avec alcool), plus corsées, gages
export const VOICE_SUCCESS_ALCOHOL = {
  fr: [
    'Bien joué ! Les autres, un verre pour lui !',
    'Il tient encore debout, incroyable.',
    'Sobre et efficace, littéralement.',
    'Un tour de plus sans tomber, respect.',
    'Ça, ça se fête. Cul sec pour tout le monde sauf lui.',
  ],
  en: [
    'Nice! Everyone else, drink one for them!',
    'Still standing, unbelievable.',
    'Sober and effective, literally.',
    'Another round without falling, respect.',
    "That deserves a toast. Bottoms up for everyone but them.",
  ],
  darija: [
    'Zwina! Lbaqiin, kass lih!',
    'Mazal wa9ef, chi haja ma tetsedq9.',
    'Sobre o mzyan f nafss lweqt.',
    'Dor akhor bla ma yta7, respect.',
    'Hadi khassha fer7a. Kass l kolchi ghir howa la.',
  ],
}

// Résultat: échec — variantes "party" (avec alcool), gages classiques
export const VOICE_FAIL_ALCOHOL = {
  fr: [
    'Raté ! Un verre, et vite.',
    'Il est officiellement bourré. Encore une gorgée.',
    "Cul sec, c'est la règle.",
    'Le cerveau a coulé. Une tournée pour tout le monde.',
    "Ça se soigne avec un verre, tradition oblige.",
    'Perdu ! Bois un coup, champion.',
  ],
  en: [
    'Missed it! Drink up, quick.',
    'Officially drunk now. One more sip.',
    'Bottoms up, rules are rules.',
    'Brain sank. Round for everyone.',
    'This calls for a drink, tradition demands it.',
    'Lost! Take a sip, champ.',
  ],
  darija: [
    'Faute! Kass, bzerba.',
    'Rah skran b jd. Chi jre3a khra.',
    'Kass sec, hadi l qanoun.',
    "L3aql ghreq. Tourné l kolchi.",
    'Hadi khassha kass, tradition wajba.',
    'Khser! Chreb chi jre3a, a batal.',
  ],
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
