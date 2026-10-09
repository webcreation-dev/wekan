'use client'

import { useRef, useEffect, useState } from 'react'
import { ChevronLeft, Phone, Plus, Smile, Send, ExternalLink, MessageCircle, X } from 'lucide-react'
import { useMessages } from '@/hooks/useMessages'
import { MOCK_CHAT_PROVIDER } from '@/data/mock'

interface ChatScreenProps {
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
              <p className="text-[12px] text-[var(--text-secondary)]">Messagerie sécurisée HomeFix</p>
            </div>
          </button>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${phone.replace(/\D/g, '')}?text=Bonjour, je vous contacte via HomeFix concernant ma demande de service.`}
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

export default function ChatScreen({ onBack }: ChatScreenProps) {
  const provider = MOCK_CHAT_PROVIDER
  const { messages, sending, send } = useMessages(provider.id)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [showContact, setShowContact] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = inputRef.current?.value.trim() ?? ''
    if (!text) return
    if (inputRef.current) inputRef.current.value = ''
    await send(text)
  }

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
        </button>
        <button onClick={() => setShowContact(true)} className="flex items-center gap-2.5 flex-1 px-2">
          <div className="relative">
            <img src={provider.avatar} alt={provider.name} className="w-9 h-9 rounded-full object-cover" />
            {provider.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[var(--bg-primary)]" />}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-[15px] font-bold text-[var(--text-primary)]">{provider.name}</p>
              <div className="w-4 h-4 rounded-full bg-[#2d7ff9] flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">✓</span>
              </div>
            </div>
            <p className="text-[12px] text-[var(--text-secondary)]">
              {provider.role} · <span className="text-green-500 font-medium">En ligne</span>
            </p>
          </div>
        </button>
        <button onClick={() => setShowContact(true)} className="w-9 h-9 rounded-full bg-[#2d7ff9]/15 flex items-center justify-center">
          <Phone size={18} className="text-[#2d7ff9]" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto screen-scroll px-4 py-4 space-y-3">
        <div className="flex justify-center">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] bg-[var(--bg-card)] px-3 py-1 rounded-full border border-[var(--border)] tracking-wider uppercase">Aujourd&apos;hui</span>
        </div>
        {messages.map((msg, i) => {
          const isUser = msg.sender === 'user'
          const showAvatar = !isUser && (i === 0 || messages[i - 1].sender === 'user')
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-8 h-8 flex-shrink-0">
                  {showAvatar && <img src={provider.avatar} alt="Pro" className="w-8 h-8 rounded-full object-cover" />}
                </div>
              )}
              <div className={`max-w-[75%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                {msg.image && (
                  <div className={`rounded-2xl overflow-hidden border-4 ${isUser ? 'border-[#2d7ff9]' : 'border-[var(--bg-card)]'}`}>
                    <img src={msg.image} alt="Photo" className="w-[220px] h-[160px] object-cover" />
                  </div>
                )}
                {msg.text && (
                  <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${isUser ? 'bg-[#2d7ff9] text-white rounded-br-md' : 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border)] rounded-bl-md'}`}>
                    {msg.text}
                  </div>
                )}
                <div className={`flex items-center gap-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-[11px] text-[var(--text-muted)]">{msg.time}</span>
                  {msg.read && isUser && <span className="text-[11px] text-[var(--text-muted)]">· Vu</span>}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-t border-[var(--border)]">
        <button className="w-9 h-9 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
          <Plus size={18} className="text-[var(--text-secondary)]" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-4 h-[44px]">
          <input ref={inputRef} type="text" onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Tapez votre message..."
            className="flex-1 bg-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
          <Smile size={18} className="text-[var(--text-muted)]" />
        </div>
        <button onClick={handleSend} disabled={sending}
          className="w-10 h-10 rounded-full bg-[#2d7ff9] flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30 active:scale-95 transition-transform disabled:opacity-60">
          <Send size={16} color="white" />
        </button>
      </div>

      {showContact && (
        <ContactPopup
          providerName={provider.name}
          phone="+229 97 00 11 22"
          onClose={() => setShowContact(false)}
        />
      )}
    </div>
  )
}
