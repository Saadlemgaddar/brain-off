// Chemins vers les GIFs et sons embarqués directement dans public/gifs/ et public/sounds/.
// Utilise import.meta.env.BASE_URL pour que ça marche aussi bien en dev qu'une fois
// packagé dans l'APK (chemins relatifs cohérents avec vite.config.js base: './').

const BASE = import.meta.env.BASE_URL || './'

export const GIFS = {
  victoryAlcohol: `${BASE}gifs/victory-alcohol.gif`,
  victoryClean: `${BASE}gifs/victory-clean.gif`,
  failAlcohol: `${BASE}gifs/fail-alcohol.gif`,
  failClean: `${BASE}gifs/fail-clean.gif`,
  mostDrunk: `${BASE}gifs/most-drunk.gif`,
  testSuccess: `${BASE}gifs/test-success.gif`,
  testFail: `${BASE}gifs/test-fail.gif`,
}

export const SOUNDS = {
  applause: `${BASE}sounds/applause.mp3`,
  buzzer: `${BASE}sounds/buzzer.mp3`,
}

// Sélectionne le bon GIF de résultat selon le mode et le succès/échec.
export function getResultGif(alcoholMode, success) {
  if (success) {
    return alcoholMode ? GIFS.victoryAlcohol : GIFS.victoryClean
  }
  return alcoholMode ? GIFS.failAlcohol : GIFS.failClean
}

// Sélectionne le bon GIF pour le verdict du mode Test.
export function getTestResultGif(success) {
  return success ? GIFS.testSuccess : GIFS.testFail
}
