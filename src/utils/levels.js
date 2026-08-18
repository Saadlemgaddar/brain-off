// 20 niveaux répartis sur les 7 types de mini-jeux.
// Chaque niveau définit sa config de difficulté de base.
// L'intensité "drunk" vient s'ajouter par-dessus au moment du jeu (voir drunkEffects.js).

export const LEVELS = [
  // === 🌀 LE CHEMIN ===
  { id: 'path-1', type: 'path', title: 'Le chemin', difficulty: 1, config: { segments: 3, width: 46, timeLimit: 8 } },
  { id: 'path-2', type: 'path', title: 'Le chemin', difficulty: 2, config: { segments: 4, width: 38, timeLimit: 7 } },
  { id: 'path-3', type: 'path', title: 'Le chemin', difficulty: 3, config: { segments: 6, width: 30, timeLimit: 7 } },

  // === ✍️ DESSINE LA FORME ===
  { id: 'shape-1', type: 'shape', title: 'Dessine la forme', difficulty: 1, config: { shape: 'circle', timeLimit: 6 } },
  { id: 'shape-2', type: 'shape', title: 'Dessine la forme', difficulty: 1, config: { shape: 'star', timeLimit: 7 } },
  { id: 'shape-3', type: 'shape', title: 'Dessine la forme', difficulty: 2, config: { shape: 'heart', timeLimit: 7 } },
  { id: 'shape-4', type: 'shape', title: 'Dessine la forme', difficulty: 3, config: { shape: 'zigzag', timeLimit: 6 } },

  // === 🧠 MÉMOIRE EXPRESS ===
  { id: 'memory-1', type: 'memory', title: 'Mémoire express', difficulty: 1, config: { count: 3, flashMs: 2200, question: 'position' } },
  { id: 'memory-2', type: 'memory', title: 'Mémoire express', difficulty: 2, config: { count: 4, flashMs: 2000, question: 'missing' } },
  { id: 'memory-3', type: 'memory', title: 'Mémoire express', difficulty: 3, config: { count: 6, flashMs: 1800, question: 'position' } },

  // === 🎯 VISE LE POINT ===
  { id: 'aim-1', type: 'aim', title: 'Vise le point', difficulty: 1, config: { targets: 1, size: 70, timeLimit: 5 } },
  { id: 'aim-2', type: 'aim', title: 'Vise le point', difficulty: 2, config: { targets: 3, size: 56, timeLimit: 6 } },
  { id: 'aim-3', type: 'aim', title: 'Vise le point', difficulty: 3, config: { targets: 3, size: 40, timeLimit: 6, moving: true } },

  // === 🔢 CALCUL COMPLÈTEMENT DÉBILE ===
  { id: 'math-1', type: 'math', title: 'Calcul débile', difficulty: 1, config: { ops: 2, maxNum: 10, timeLimit: 5 } },
  { id: 'math-2', type: 'math', title: 'Calcul débile', difficulty: 2, config: { ops: 3, maxNum: 12, timeLimit: 4 } },
  { id: 'math-3', type: 'math', title: 'Calcul débile', difficulty: 3, config: { ops: 3, maxNum: 15, timeLimit: 3, emojiNumbers: true } },

  // === 👀 TROUVE L'INTRUS ===
  { id: 'odd-1', type: 'oddOneOut', title: "Trouve l'intrus", difficulty: 1, config: { gridSize: 16, contrast: 'high', timeLimit: 6 } },
  { id: 'odd-2', type: 'oddOneOut', title: "Trouve l'intrus", difficulty: 2, config: { gridSize: 20, contrast: 'medium', timeLimit: 6 } },
  { id: 'odd-3', type: 'oddOneOut', title: "Trouve l'intrus", difficulty: 3, config: { gridSize: 25, contrast: 'low', timeLimit: 7 } },

  // === 🖐️ RÉFLEXE ===
  { id: 'reflex-1', type: 'reflex', title: 'Réflexe', difficulty: 1, config: { rounds: 4, trapChance: 0.3 } },
  { id: 'reflex-2', type: 'reflex', title: 'Réflexe', difficulty: 2, config: { rounds: 5, trapChance: 0.4 } },

  // === 😂 PIÈGES SPÉCIAUX ===
  { id: 'trap-slowbutton', type: 'trapButton', title: 'Touche le bouton vert', difficulty: 2, config: { buttonCount: 5, timeLimit: 3 } },
  { id: 'trap-donttouch', title: "Ne touche pas l'écran", type: 'trapNoTouch', difficulty: 2, config: { waitMs: 5000, temptMs: 2500 } },
]

export const LEVEL_TYPE_LABELS = {
  path: '🌀 Le chemin',
  shape: '✍️ Dessine la forme',
  memory: '🧠 Mémoire express',
  aim: '🎯 Vise le point',
  math: '🔢 Calcul débile',
  oddOneOut: "👀 Trouve l'intrus",
  reflex: '🖐️ Réflexe',
  trapButton: '😂 Piège',
  trapNoTouch: '😂 Piège',
}
