// Système central des effets "Drunk", simplifié pour se concentrer sur 3 effets
// clairs et lisibles : flou visuel, écran qui se retourne (upside-down), et
// tremblement/vibration de l'écran. Les effets plus subtils (décalage tactile,
// inversion de contrôles, faux boutons, teinte qui change) ont été retirés :
// ils rendaient le jeu confus plutôt que "drôle et chaotique".
// intensity va de 0 (sobre) à 1 (final boss).

export function getDrunkEffects(intensity) {
  const i = Math.max(0, Math.min(1, intensity))

  return {
    intensity: i,
    // Flou visuel (px) appliqué au stage de jeu — l'effet principal, présent dès que le chaos commence
    blurPx: i * 5,
    // Rotation progressive de l'écran, jusqu'à un vrai retournement complet (180°) à intensité max
    flipRotationDeg: i * 180,
    flipEnabled: i > 0.5, // le retournement ne s'active qu'à partir de la moitié de la jauge
    // Tremblement/vibration de l'écran, présent dès que le chaos devient net
    screenShake: i > 0.35,
    shakeIntensity: i, // pilote l'amplitude du tremblement
    // Vitesse du compte à rebours qui accélère (plafonné à +25% pour rester jouable)
    timerSpeedMultiplier: 1 + i * 0.25,
  }
}

export function getStageClassName(effects) {
  const classes = []
  if (effects.screenShake) classes.push('drunk-shake')
  if (effects.flipEnabled) classes.push('drunk-flip')
  return classes.join(' ')
}

export function getStageStyle(effects) {
  const style = {}
  if (effects.blurPx > 0.1) {
    style.filter = `blur(${effects.blurPx}px)`
  }
  if (effects.flipEnabled) {
    style.transform = `rotate(${effects.flipRotationDeg}deg)`
    style.transition = 'transform 1.2s cubic-bezier(0.65, 0, 0.35, 1)'
  }
  return style
}
