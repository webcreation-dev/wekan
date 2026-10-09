'use client'

import { MessageSquare } from 'lucide-react'
import { Screen, Conversation } from '@/types'
import { MOCK_CONVERSATIONS } from '@/data/mock'
import TabBar from '@/components/ui/TabBar'

interface ConversationsScreenProps {
  onNavigate: (screen: Screen) => void
  onOpenChat: (convId: string) => void
}

export default function ConversationsScreen({ onNavigate, onOpenChat }: ConversationsScreenProps) {
  const conversations = MOCK_CONVERSATIONS
  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0)

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-[var(--border)]">
        <h1 className="text-[20px] font-bold text-[var(--text-primary)]">Messagerie</h1>
        <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
          {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
          {totalUnread > 0 && ` · ${totalUnread} non lue${totalUnread > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto screen-scroll">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <MessageSquare size={40} className="text-[var(--text-muted)]" />
            <p className="text-[14px] text-[var(--text-muted)]">Aucune conversation</p>
            <p className="text-[12px] text-[var(--text-muted)] text-center px-8">
              Vos échanges avec les prestataires apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => onOpenChat(conv.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[var(--bg-surface)] transition-colors active:bg-[var(--bg-surface)]"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={conv.providerAvatar}
                    alt={conv.providerName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-[var(--bg-primary)]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-[14px] text-[var(--text-primary)] ${conv.unread > 0 ? 'font-bold' : 'font-semibold'}`}>
                      {conv.providerName}
                    </p>
                    <span className={`text-[11px] ${conv.unread > 0 ? 'text-[#2d7ff9] font-semibold' : 'text-[var(--text-muted)]'}`}>
                      {conv.lastTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#2d7ff9] font-medium mb-0.5">{conv.serviceType}</p>
                  <div className="flex items-center justify-between">
                    <p className={`text-[12px] truncate ${conv.unread > 0 ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'}`}>
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <span className="ml-2 w-5 h-5 rounded-full bg-[#2d7ff9] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <TabBar active="conversations" onNavigate={onNavigate} msgCount={totalUnread} />
    </div>
  )
}
