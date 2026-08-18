// Chemins vers les GIFs et sons embarqués dans public/media/.
// Utilise import.meta.env.BASE_URL pour que ça marche aussi bien en dev qu'une fois
// packagé dans l'APK (chemins relatifs cohérents avec vite.config.js base: './').

const BASE = import.meta.env.BASE_URL || './'

export const GIFS = {
  victoryAlcohol: `${BASE}media/gifs/victory-alcohol.gif`,
  victoryClean: `${BASE}media/gifs/victory-clean.gif`,
  failAlcohol: `${BASE}media/gifs/fail-alcohol.gif`,
  failClean: `${BASE}media/gifs/fail-clean.gif`,
  mostDrunk: `${BASE}media/gifs/most-drunk.gif`,
  testSuccess: `${BASE}media/gifs/test-success.gif`,
  testFail: `${BASE}media/gifs/test-fail.gif`,
}

export const SOUNDS = {
  applause: `${BASE}media/sounds/applause.mp3`,
  buzzer: `${BASE}media/sounds/buzzer.mp3`,
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
