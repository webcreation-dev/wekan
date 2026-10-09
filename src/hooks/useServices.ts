'use client'

import { useState, useEffect, useCallback } from 'react'
import { Service, PromoBanner } from '@/types'
import { servicesApi, bannersApi } from '@/services/api'

interface UseServicesReturn {
  services: Service[]
  banners: PromoBanner[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useServices(): UseServicesReturn {
  const [services, setServices] = useState<Service[]>([])
  const [banners, setBanners] = useState<PromoBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, b] = await Promise.all([
        servicesApi.getAll(),
        bannersApi.getActive(),
      ])
      setServices(s)
      setBanners(b)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  return { services, banners, loading, error, refetch: fetchAll }
}
