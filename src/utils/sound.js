// Lecteur de sons courts (applaudissements/buzzer) via l'élément Audio natif du navigateur.
// Les fichiers sont embarqués localement dans public/sounds/, donc ça fonctionne
// hors-ligne dans l'APK — pas de dépendance réseau.

export function playSound(src, { volume = 0.7 } = {}) {
  try {
    const audio = new Audio(src)
    audio.volume = volume
    // .play() retourne une Promise qui peut être rejetée si l'autoplay est bloqué par le
    // navigateur (rare dans une WebView Capacitor après une interaction utilisateur, mais
    // on l'attrape par sécurité pour ne jamais faire planter le jeu).
    const p = audio.play()
    if (p && typeof p.catch === 'function') {
      p.catch(() => {})
    }
    return audio
  } catch (e) {
    return null
  }
}
