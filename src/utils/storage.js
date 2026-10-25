// Demo persistence only: data lives in this browser and is not shared or secure.
const PREFIX = 'localconnect:v1:'
export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}
export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
export function clearAll() {
  try { Object.keys(localStorage).filter((k) => k.startsWith(PREFIX)).forEach((k) => localStorage.removeItem(k)) } catch { /* ignore */ }
}
