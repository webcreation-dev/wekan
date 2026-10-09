'use client'

import { useState, useEffect, useCallback } from 'react'
import { Appointment } from '@/types'
import { appointmentsApi } from '@/services/api'

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await appointmentsApi.getAll()
      setAppointments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const cancel = async (id: string) => {
    await appointmentsApi.cancel(id)
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a)
    )
  }

  return { appointments, loading, error, refetch: fetchAll, cancel }
}
