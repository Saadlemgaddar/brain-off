// Système central des effets "Drunk". intensity va de 0 (sobre) à 1 (final boss).
// Chaque mini-jeu pioche ce dont il a besoin dans getDrunkEffects(intensity).

export function getDrunkEffects(intensity) {
  const i = Math.max(0, Math.min(1, intensity))

  return {
    intensity: i,
    // Décalage du point de contact tactile (px), simule la mauvaise coordination
    inputOffset: i * 22,
    // Délai artificiel entre le toucher et la réaction (ms)
    inputDelayMs: Math.round(i * 180),
    // Flou visuel (px) appliqué au stage de jeu
    blurPx: i * 3.2,
    // Rotation lente du cadre de jeu (utilisé via classe CSS drunk-tilt, intensité pilote l'ampleur)
    tiltEnabled: i > 0.15,
    tiltAmplitude: 1 + i * 3, // degrés
    // Chemin/forme flou (opacity pulsante)
    fadeFlicker: i > 0.4,
    // Vibration/shake aléatoire de l'écran
    screenShake: i > 0.6,
    // Cible ou objet qui bouge de façon imprévisible
    jitterAmplitude: i * 34,
    // Inversion des commandes (final boss uniquement)
    invertControls: i > 0.9,
    // Faux boutons qui apparaissent (final boss)
    fakeButtons: i > 0.85,
    // Vitesse du compte à rebours qui accélère (plafonné à +25% pour rester jouable)
    timerSpeedMultiplier: 1 + i * 0.25,
    // Teinte qui change en continu
    hueShift: i > 0.7,
    // Vignette violette
    vignette: i > 0.75,
    // Réduction du temps disponible (les niveaux deviennent plus courts perçus)
    timeReductionFactor: 1 - i * 0.25,
  }
}

// Applique le décalage de coordonnées tactiles (simulateur de mauvaise coordination)
// en ajoutant un bruit pseudo-aléatoire mais cohérent dans le temps (pas totalement chaotique)
export function applyInputOffset(x, y, effects, seedRef) {
  if (effects.inputOffset <= 0) return { x, y }
  // Bruit basé sur le temps pour un mouvement fluide de "tremblement" plutôt qu'un jitter pur
  const t = Date.now() / 260
  const nx = Math.sin(t + (seedRef?.current || 0)) * effects.inputOffset
  const ny = Math.cos(t * 1.3 + (seedRef?.current || 0)) * effects.inputOffset
  return { x: x + nx, y: y + ny }
}

export function getStageClassName(effects) {
  const classes = []
  if (effects.tiltEnabled) classes.push('drunk-tilt')
  if (effects.hueShift) classes.push('drunk-hue')
  if (effects.vignette) classes.push('drunk-vignette')
  return classes.join(' ')
}

export function getStageStyle(effects) {
  const style = {}
  if (effects.blurPx > 0.1) {
    style.filter = `blur(${effects.blurPx}px)`
  }
  return style
}
