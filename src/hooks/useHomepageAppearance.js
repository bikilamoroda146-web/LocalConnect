import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_HOMEPAGE_APPEARANCE, getHomepageAppearance } from '../utils/homepageAppearance'

export default function useHomepageAppearance() {
  const [appearance, setAppearance] = useState(DEFAULT_HOMEPAGE_APPEARANCE)
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const imageUrlRef = useRef(null)
  const activeRef = useRef(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const saved = await getHomepageAppearance()
      const nextUrl = saved.image ? URL.createObjectURL(saved.image) : null
      if (!activeRef.current) {
        if (nextUrl) URL.revokeObjectURL(nextUrl)
        return saved
      }
      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
      imageUrlRef.current = nextUrl
      setAppearance(saved)
      setImageUrl(nextUrl)
      return saved
    } catch (loadError) {
      if (activeRef.current) setError(loadError.message || 'Could not load the saved homepage appearance.')
      throw loadError
    } finally {
      if (activeRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    activeRef.current = true
    refresh().catch(() => {})
    return () => {
      activeRef.current = false
      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
      imageUrlRef.current = null
    }
  }, [refresh])

  return { appearance, imageUrl, loading, error, refresh }
}
