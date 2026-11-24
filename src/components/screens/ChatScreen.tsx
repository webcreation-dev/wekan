'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, Phone, ExternalLink, MessageCircle } from 'lucide-react'
import { useRequestsStore, WEKAN_AGENT } from '@/store/requestsStore'
import { VoiceBubble, VoiceComposer } from '@/components/ui/VoiceNote'

interface ChatScreenProps {
  requestId: string | null
  onBack: () => void
}

// Contact action popup
function ContactPopup({ providerName, phone, onClose }: { providerName: string; phone: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full bg-[var(--bg-card)] rounded-t-3xl border-t border-[var(--border)] p-5 pb-8 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
        </div>
        <p className="text-[11px] font-bold tracking-wider text-[var(--text-muted)] uppercase mb-4 text-center">
          Contacter {providerName}
        </p>
        <div className="space-y-3">
          {/* Write on platform */}
          <button
            onClick={onClose}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#2d7ff9]/10 border border-[#2d7ff9]/20 text-left active:scale-[0.98] transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2d7ff9] flex items-center justify-center flex-shrink-0">
              <MessageCircle size={18} color="white" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[var(--text-primary)]">Écrire sur la plateforme</p>
              <p className="text-[12px] text-[var(--text-secondary)]">Messagerie sécurisée Wekan</p>
            </div>
          </button>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${phone.replace(/\D/g, '')}?text=Bonjour, je vous contacte via Wekan concernant ma demande de service.`}
            target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-left active:scale-[0.98] transition-transform"
            onClick={onClose}
          >
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
              <ExternalLink size={18} color="white" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[var(--text-primary)]">Écrire sur WhatsApp</p>
              <p className="text-[12px] text-[var(--text-secondary)]">Ouvre WhatsApp directement</p>
            </div>
          </a>

          {/* Phone call */}
          <a
            href={`tel:${phone.replace(/\D/g, '')}`}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] text-left active:scale-[0.98] transition-transform"
            onClick={onClose}
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Phone size={18} className="text-[var(--text-primary)]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[var(--text-primary)]">Appeler directement</p>
              <p className="text-[12px] text-[var(--text-secondary)]">{phone}</p>
            </div>
          </a>
        </div>
        <button onClick={onClose} className="w-full mt-4 py-3 text-[13px] font-semibold text-[var(--text-muted)]">Annuler</button>
      </div>
    </div>
  )
}

export default function ChatScreen({ requestId, onBack }: ChatScreenProps) {
  const request = useRequestsStore(state => state.requests.find(r => r.id === requestId))
  const sendMessage = useRequestsStore(state => state.sendMessage)
  const markRead = useRequestsStore(state => state.markRead)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [text, setText] = useState('')
  const [showContact, setShowContact] = useState(false)

  useEffect(() => { if (requestId) markRead(requestId) }, [requestId, markRead])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [request?.messages.length])

  if (!request) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-[var(--bg-primary)]">
        <p className="text-[var(--text-muted)]">Conversation introuvable</p>
        <button onClick={onBack} className="font-semibold text-[#2d7ff9]">Retour</button>
      </div>
    )
  }

  // Interlocuteur : le prestataire une fois assigné, sinon le service client
  const contact = request.providerName
    ? { name: request.providerName, avatar: request.providerAvatar ?? WEKAN_AGENT.avatar }
    : WEKAN_AGENT

  const sendText = () => {
    const value = text.trim()
    if (!value) return
    sendMessage(request.id, { text: value })
    setText('')
  }

  return (
    <div className="flex h-full flex-col bg-[var(--bg-primary)] animate-fade-in">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--bg-card)] px-3 py-3">
        <button onClick={onBack} aria-label="Retour" className="flex h-9 w-9 items-center justify-center">
          <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <img src={contact.avatar} alt="" className="h-10 w-10 flex-shrink-0 rounded-full border border-[var(--border)] bg-white object-cover" />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold text-[var(--text-primary)]">{contact.name}</p>
            <p className="truncate text-[12px] text-[var(--text-secondary)]">{request.serviceName} · #{request.ref}</p>
          </div>
        </div>
        <button onClick={() => setShowContact(true)} aria-label="Appeler" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d7ff9]/15">
          <Phone size={18} className="text-[#2d7ff9]" />
        </button>
      </div>

      {/* Messages */}
      <div className="screen-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <div className="flex justify-center">
          <span className="rounded-full bg-[var(--bg-card)] px-3 py-1 text-[11px] font-medium text-[var(--text-muted)] shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
            Demande #{request.ref} · {request.createdAt}
          </span>
        </div>

        {request.messages.map((msg, i) => {
          const isUser = msg.sender === 'user'
          const showAvatar = !isUser && (i === 0 || request.messages[i - 1].sender === 'user')
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="h-8 w-8 flex-shrink-0">
                  {showAvatar && <img src={contact.avatar} alt="" className="h-8 w-8 rounded-full border border-[var(--border)] bg-white object-cover" />}
                </div>
              )}
              <div className={`flex max-w-[78%] flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                {msg.voiceNote && <div className="w-[260px]"><VoiceBubble note={msg.voiceNote} /></div>}
                {msg.text && (
                  <div className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                    isUser ? 'rounded-br-md bg-[#2d7ff9] text-white' : 'rounded-bl-md border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)]'
                  }`}>
                    {msg.text}
                  </div>
                )}
                <span className="text-[11px] text-[var(--text-muted)]">{msg.time}</span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Saisie : texte ou vocal (façon WhatsApp) */}
      <div className="border-t border-[var(--border)] px-3 pb-5 pt-3">
        <VoiceComposer
          text={text}
          onTextChange={setText}
          onSendText={sendText}
          onVoice={note => sendMessage(request.id, { voiceNote: note })}
          placeholder="Écrire un message…"
        />
      </div>

      {showContact && <ContactPopup providerName={contact.name} phone="+229 97 00 11 22" onClose={() => setShowContact(false)} />}
    </div>
  )
}
