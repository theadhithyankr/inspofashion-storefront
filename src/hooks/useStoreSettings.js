import { useState, useEffect, useCallback } from 'react'
import { storeSettingsService } from '../services/storeSettingsService'

export function useStoreSettings(key) {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const data = await storeSettingsService.getSettings(key)
      setSettings(data || null)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [key])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return { settings, loading, error, refresh: fetchSettings }
}
