import { useState, useEffect, useCallback } from 'react'
import { collectionService } from '../services/collectionService'

export function useCollections() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true)
      const data = await collectionService.getCollections()
      setCollections(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  return { collections, loading, error, refresh: fetchCollections }
}
