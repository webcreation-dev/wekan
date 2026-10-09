'use client'

import { useState, useEffect, useCallback } from 'react'
import { Message } from '@/types'
import { messagesApi } from '@/services/api'

export function useMessages(providerId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const fetchThread = useCallback(async () => {
    setLoading(true)
    try {
      const data = await messagesApi.getThread(providerId)
      setMessages(data)
    } finally {
      setLoading(false)
    }
  }, [providerId])

  useEffect(() => { fetchThread() }, [fetchThread])

  const send = async (text: string, image?: string) => {
    if (!text.trim() && !image) return
    setSending(true)
    try {
      const msg = await messagesApi.send(providerId, text, image)
      setMessages(prev => [...prev, msg])
    } finally {
      setSending(false)
    }
  }

  return { messages, loading, sending, send }
}
