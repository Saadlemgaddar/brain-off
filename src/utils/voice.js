// Système vocal basé sur la Web Speech API : moteur Text-to-Speech NATIF du téléphone
// (ex: Google Text-to-Speech sur Android). Aucun appel réseau, aucune clé API,
// fonctionne 100% hors-ligne dans l'APK — c'est le moteur déjà installé sur l'appareil.
//
// Robustesse : si l'appareil n'a pas de voix pour la langue choisie (fréquent pour le
// Darija, souvent absent), on retombe sur l'arabe générique puis, en dernier recours,
// sur la langue par défaut du système. Si l'API elle-même est absente de la WebView,
// tout devient silencieux sans jamais bloquer le jeu — le texte à l'écran reste
// toujours la source d'information principale, la voix n'est qu'un bonus.

const LANG_FALLBACK_CHAIN = {
  fr: ['fr-FR', 'fr-CA', 'fr'],
  en: ['en-US', 'en-GB', 'en'],
  darija: ['ar-MA', 'ar-SA', 'ar-EG', 'ar', 'fr-FR'], // Darija n'existe pas comme voix dédiée -> arabe générique, puis français en dernier recours
}

// Durée max qu'on attend une fin de parole avant d'abandonner (sécurité si l'event
// 'onend' ne se déclenche jamais sur un appareil particulier — ne bloque jamais le jeu).
const SPEECH_SAFETY_TIMEOUT_MS = 7000
// Estimation grossière du temps de parole si l'API ne peut pas nous le dire à l'avance
// (utilisée uniquement pour dimensionner le timeout de sécurité selon la longueur du texte).
const MS_PER_CHARACTER_ESTIMATE = 90

let voicesCache = null
let voicesReadyPromise = null

function loadVoicesOnce() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return Promise.resolve([])
  if (voicesReadyPromise) return voicesReadyPromise

  voicesReadyPromise = new Promise(resolve => {
    const existing = window.speechSynthesis.getVoices()
    if (existing && existing.length > 0) {
      voicesCache = existing
      resolve(existing)
      return
    }
    // Sur certains WebView Android, les voix se chargent de façon asynchrone
    const handler = () => {
      const v = window.speechSynthesis.getVoices()
      voicesCache = v
      window.speechSynthesis.removeEventListener('voiceschanged', handler)
      resolve(v)
    }
    window.speechSynthesis.addEventListener('voiceschanged', handler)
    // Sécurité : si l'event ne se déclenche jamais, on abandonne après 1.5s
    setTimeout(() => resolve(window.speechSynthesis.getVoices() || []), 1500)
  })
  return voicesReadyPromise
}

function pickVoiceForChain(voices, bcp47Chain) {
  if (!voices || !voices.length) return null
  for (const target of bcp47Chain) {
    const exact = voices.find(v => v.lang === target)
    if (exact) return exact
  }
  for (const target of bcp47Chain) {
    const prefix = target.split('-')[0]
    const partial = voices.find(v => v.lang && v.lang.startsWith(prefix))
    if (partial) return partial
  }
  return null
}

export function isVoiceSupported() {
  return typeof window !== 'undefined' && !!window.speechSynthesis
}

// Vérifie si au moins une voix exploitable existe pour la langue demandée (utile pour
// afficher un état "voix indisponible" dans les réglages si besoin, sans être bloquant).
export async function hasVoiceFor(lang) {
  if (!isVoiceSupported()) return false
  const voices = await loadVoicesOnce()
  const chain = LANG_FALLBACK_CHAIN[lang] || LANG_FALLBACK_CHAIN.fr
  return !!pickVoiceForChain(voices, chain)
}

// Parle le texte donné et résout la Promise quand la parole est VRAIMENT terminée
// (event 'onend'), pas après un délai arbitraire. Si la voix n'est pas disponible ou
// que quelque chose échoue, résout immédiatement pour ne jamais bloquer le jeu.
export function speak(text, lang, { rate = 1.0, pitch = 1.0, volume = 1.0 } = {}) {
  if (!isVoiceSupported() || !text) return Promise.resolve()

  return new Promise(async (resolve) => {
    let settled = false
    const settle = () => {
      if (settled) return
      settled = true
      resolve()
    }

    try {
      const voices = await loadVoicesOnce()
      const chain = LANG_FALLBACK_CHAIN[lang] || LANG_FALLBACK_CHAIN.fr

      window.speechSynthesis.cancel() // évite l'empilement si plusieurs lignes se déclenchent vite
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = chain[0]
      const voice = pickVoiceForChain(voices, chain)
      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang
      }
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume

      utterance.onend = settle
      utterance.onerror = settle

      // Filet de sécurité : certains WebView Android n'émettent jamais onend correctement.
      // On calcule un timeout proportionnel à la longueur du texte, plafonné.
      const estimated = Math.min(SPEECH_SAFETY_TIMEOUT_MS, Math.max(1200, text.length * MS_PER_CHARACTER_ESTIMATE))
      setTimeout(settle, estimated)

      window.speechSynthesis.speak(utterance)
    } catch (e) {
      // Silencieux — la voix est un bonus, jamais bloquant pour le jeu
      settle()
    }
  })
}

export function stopSpeaking() {
  if (isVoiceSupported()) {
    try { window.speechSynthesis.cancel() } catch (e) {}
  }
}
