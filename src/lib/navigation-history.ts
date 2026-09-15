/**
 * Whether this tab has navigated inside the app since it loaded.
 *
 * A module variable, not storage: it lives exactly as long as the client
 * router does. A full page load — a link opened from WhatsApp, a refresh —
 * starts it at false, which is the case where there is no in-app page to go
 * back to.
 */
let hasNavigated = false

export function markInAppNavigation() {
  hasNavigated = true
}

export function hasInAppHistory() {
  return hasNavigated
}
