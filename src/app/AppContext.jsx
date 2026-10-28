import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { seedUsers } from '../data/users'
import { seedServices } from '../data/services'
import { seedBookings } from '../data/bookings'
import { seedReviews, seedReports } from '../data/reviews'
import { providers as seedProviders } from '../data/providers'
import { load, save, clearAll } from '../utils/storage'
import { canTransition } from '../utils/bookings'
import { TODAY } from '../utils/format'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const defaultAvailability = () =>
  Object.fromEntries(DAYS.map((d, i) => [d, { on: i < 5, slots: [{ start: '09:00', end: '17:00' }] }]))

function usePersisted(key, initial, onSaveError) {
  const [v, setV] = useState(() => load(key, initial))
  useEffect(() => {
    if (!save(key, v)) onSaveError()
  }, [key, v, onSaveError])
  return [v, setV]
}

export function AppProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const toast = useCallback((message, tone = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((current) => [...current, { id, message, tone }])
    setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 4000)
  }, [])
  const onPersistenceError = useCallback(() => {
    toast('Some changes could not be saved in this browser. Check available storage and try again.', 'error')
  }, [toast])
  const [users, setUsers] = usePersisted('users', seedUsers, onPersistenceError)
  const [services, setServices] = usePersisted('services', seedServices, onPersistenceError)
  const [bookings, setBookings] = usePersisted('bookings', seedBookings, onPersistenceError)
  const [providers, setProviders] = usePersisted('providers', seedProviders, onPersistenceError)
  const [portfolios, setPortfolios] = usePersisted('portfolios', {}, onPersistenceError)
  const [favorites, setFavorites] = usePersisted('favorites', ['p1', 's2'], onPersistenceError)
  const [recent, setRecent] = usePersisted('recent', [], onPersistenceError)
  const [availability, setAvailability] = usePersisted('availability', { p1: defaultAvailability() }, onPersistenceError)
  const [reports, setReports] = usePersisted('reports', seedReports, onPersistenceError)
  const [activity, setActivity] = usePersisted('activity', [], onPersistenceError)
  const [sessionId, setSessionId] = usePersisted('session', null, onPersistenceError) // user id only, never a password

  const user = useMemo(() => users.find((u) => u.id === sessionId) ?? null, [users, sessionId])

  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id))
  const log = (text) => setActivity((a) => [{ id: Date.now() + Math.random(), text, at: new Date().toISOString() }, ...a].slice(0, 20))

  // ---- auth (simulated) ----
  const login = (email, password) => {
    const u = users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase())
    if (!u || password.length < 6) return { ok: false, error: 'We could not sign you in. Check the email and use a password of 6+ characters.' }
    if (u.status === 'suspended') return { ok: false, error: 'This demo account is suspended.' }
    setSessionId(u.id)
    return { ok: true, user: u }
  }
  const register = ({ name, email, role }) => {
    if (users.some((x) => x.email.toLowerCase() === email.trim().toLowerCase())) return { ok: false, error: 'An account with this email already exists in this demo.' }
    const id = `u-${Date.now()}`
    const u = { id, name: name.trim(), email: email.trim(), role, status: role === 'provider' ? 'pending' : 'active', joined: TODAY, area: '' }
    if (role === 'provider') {
      const pid = `p-${Date.now()}`
      u.providerId = pid
      setProviders((p) => [...p, { id: pid, userId: id, name: u.name, profession: 'New provider', category: 'home-repairs', area: 'Waliso', years: 0, rating: 0, reviews: 0, verified: false, hue: 160, bio: 'Add a short biography in your profile.', skills: [] }])
    }
    setUsers((x) => [...x, u])
    setSessionId(id)
    return { ok: true, user: u }
  }
  const logout = () => setSessionId(null)

  // ---- favorites / recent ----
  const isFavorite = (key) => favorites.includes(key)
  const toggleFavorite = (key) => {
    const has = favorites.includes(key)
    setFavorites((f) => (has ? f.filter((k) => k !== key) : [...f, key]))
    toast(has ? 'Removed from favorites' : 'Saved to favorites')
  }
  const markViewed = useCallback((key) => setRecent((r) => [key, ...r.filter((k) => k !== key)].slice(0, 6)), [setRecent])

  // ---- bookings ----
  const createBooking = ({ serviceId, date, time, note }) => {
    const s = services.find((x) => x.id === serviceId)
    const id = `BK-${1000 + bookings.length + 1 + Math.floor(Math.random() * 90)}`
    setBookings((b) => [{ id, serviceId, providerId: s.providerId, customerId: user.id, date, time, note, status: 'pending', created: TODAY, updated: TODAY }, ...b])
    log(`Requested “${s.title}” for ${date}`)
    toast('Booking request sent. The provider can accept or decline it.')
    return id
  }
  const changeBookingStatus = (id, to, actor) => {
    const b = bookings.find((x) => x.id === id)
    if (!b || !canTransition(b.status, to, actor)) { toast('That change is not allowed for this booking.', 'error'); return false }
    setBookings((all) => all.map((x) => (x.id === id ? { ...x, status: to, updated: TODAY } : x)))
    log(`Booking ${id} marked ${to}`)
    toast(`Booking ${to === 'rejected' ? 'declined' : to}.`)
    return true
  }
  const rescheduleBooking = (id, date, time) => {
    setBookings((all) => all.map((x) => (x.id === id ? { ...x, date, time, status: 'pending', updated: TODAY } : x)))
    log(`Rescheduled ${id}`)
    toast('New time requested. The provider needs to confirm again.')
  }

  // ---- provider services ----
  const saveService = (data) => {
    if (data.id) setServices((s) => s.map((x) => (x.id === data.id
      ? { ...x, ...data, updated: TODAY }
      : x)))
    else setServices((s) => [{ ...data, id: `s-${Date.now()}`, published: true, created: TODAY, updated: TODAY }, ...s])
    toast(data.id ? 'Service saved' : 'Service published')
  }
  const togglePublish = (id) => {
    const s = services.find((x) => x.id === id)
    if (!s) {
      toast('That service could not be found.', 'error')
      return
    }
    setServices((all) => all.map((x) => (x.id === id ? { ...x, published: !x.published, updated: TODAY } : x)))
    toast(s.published ? 'Unpublished' : 'Published')
  }
  const deleteService = (id) => {
    if (!services.some((service) => service.id === id)) {
      toast('That service could not be found.', 'error')
      return
    }
    setServices((s) => s.filter((x) => x.id !== id))
    toast('Service deleted')
  }

  const updateProvider = (id, patch) => {
    const next = providers.map((x) => (x.id === id ? { ...x, ...patch } : x))
    if (!save('providers', next)) return false
    setProviders(next)
    toast('Profile saved')
    return true
  }
  const updateUser = (id, patch) => {
    const next = users.map((x) => (x.id === id ? { ...x, ...patch } : x))
    if (!save('users', next)) return false
    setUsers(next)
    return true
  }
  const savePortfolio = (providerId, portfolio) => {
    if (user?.role !== 'provider' || user.providerId !== providerId) return false
    const current = portfolios && typeof portfolios === 'object' && !Array.isArray(portfolios) ? portfolios : {}
    const next = { ...current, [providerId]: portfolio }
    if (!save('portfolios', next)) return false
    setPortfolios(next)
    toast('Portfolio saved in this browser.')
    return true
  }
  const saveAvailability = (pid, value) => { setAvailability((a) => ({ ...a, [pid]: value })); toast('Availability saved') }
  const getAvailability = (pid) => availability[pid] ?? defaultAvailability()
  const resolveReport = (id) => { setReports((r) => r.map((x) => (x.id === id ? { ...x, status: 'resolved' } : x))); toast('Report resolved') }
  const resetDemo = () => {
    if (!clearAll()) {
      toast('Demo data could not be cleared from this browser.', 'error')
      return
    }
    window.location.assign('/')
  }

  const value = {
    user, users, services, bookings, providers, portfolios, reviews: seedReviews, favorites, recent, reports, activity, toasts, DAYS,
    toast, dismissToast, login, register, logout, isFavorite, toggleFavorite, markViewed,
    createBooking, changeBookingStatus, rescheduleBooking, saveService, togglePublish, deleteService,
    updateProvider, updateUser, savePortfolio, saveAvailability, getAvailability, resolveReport, resetDemo, setUsers, setServices,
    providerOf: (id) => providers.find((p) => p.id === id),
    serviceOf: (id) => services.find((s) => s.id === id),
    userOf: (id) => users.find((u) => u.id === id),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
