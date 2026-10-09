'use client'

import { ChevronLeft, Share2, MoreHorizontal, CheckCircle, FileText, MessageCircle } from 'lucide-react'

interface InvoiceScreenProps {
  onBack: () => void
}

export default function InvoiceScreen({ onBack }: InvoiceScreenProps) {
  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
        </button>
        <h1 className="text-[17px] font-bold text-[var(--text-primary)]">Facture #FAC-10293</h1>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center">
            <Share2 size={18} className="text-[var(--text-secondary)]" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center">
            <MoreHorizontal size={18} className="text-[var(--text-secondary)]" />
          </button>
        </div>
      </div>

      {/* Scrollable */}
      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-4 pb-4">
        {/* Provider card */}
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] mb-5">
          <div className="flex items-center gap-3 mb-3">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
              alt="Alex Johnson"
              className="w-[56px] h-[56px] rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-[16px] font-bold text-[var(--text-primary)]">Alex Johnson</p>
                <div className="w-4 h-4 rounded-full bg-[#2d7ff9] flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">✓</span>
                </div>
              </div>
              <p className="text-[13px] text-[var(--text-secondary)]">Électricien Certifié</p>
              <p className="text-[12px] text-[var(--text-muted)]">Mission #8821 • 24 Oct, 2023</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-lg">
              SERVICE TERMINÉ
            </span>
            <span className="text-[12px] text-[var(--text-secondary)]">Payé via Mobile Money</span>
          </div>
        </div>

        {/* Détail des coûts */}
        <h2 className="text-[17px] font-bold text-[var(--text-primary)] mb-3">Détail des Coûts</h2>
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] mb-5">
          {[
            { label: 'Main d\'œuvre (2.5 h)', value: '75 000 FCFA' },
            { label: 'Frais de Réservation', value: '5 000 FCFA' },
            { label: 'Déplacement d\'urgence', value: '10 000 FCFA' },
          ].map((row, i) => (
            <div key={i} className={`flex items-center justify-between py-2.5 ${
              i < 2 ? 'border-b border-[var(--border)]' : ''
            }`}>
              <span className="text-[14px] text-[var(--text-secondary)]">{row.label}</span>
              <span className="text-[14px] font-semibold text-[var(--text-primary)]">{row.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3 mt-1 border-t border-[var(--border)]">
            <span className="text-[14px] text-[var(--text-secondary)]">Sous-total (Services)</span>
            <span className="text-[14px] font-bold text-[var(--text-primary)]">90 000 FCFA</span>
          </div>
        </div>

        {/* Fournitures */}
        <h2 className="text-[17px] font-bold text-[var(--text-primary)] mb-3">Fournitures Achetées</h2>
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] mb-5">
          <div className="pb-3 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-semibold text-[var(--text-primary)]">Câble Cuivre (10m)</p>
                <p className="text-[11px] text-[var(--text-muted)]">1 250 FCFA / mètre</p>
              </div>
              <span className="text-[14px] font-bold text-[var(--text-primary)]">12 500 FCFA</span>
            </div>
          </div>
          <div className="py-3 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-semibold text-[var(--text-primary)]">Disjoncteur 20A</p>
                <p className="text-[11px] text-[var(--text-muted)]">Remplacement standard</p>
              </div>
              <span className="text-[14px] font-bold text-[var(--text-primary)]">8 500 FCFA</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-[14px] text-[var(--text-secondary)]">Sous-total (Matériels)</span>
            <span className="text-[14px] font-bold text-[var(--text-primary)]">21 000 FCFA</span>
          </div>
        </div>

        {/* Totaux */}
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] mb-5">
          <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
            <span className="text-[14px] text-[var(--text-secondary)]">Sous-total Cumulé</span>
            <span className="text-[14px] font-bold text-[var(--text-primary)]">111 000 FCFA</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
            <span className="text-[14px] text-[var(--text-secondary)]">TVA (18%)</span>
            <span className="text-[14px] font-bold text-[var(--text-primary)]">19 980 FCFA</span>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-[16px] font-bold text-[var(--text-primary)]">Montant Total</span>
            <span className="text-[18px] font-bold text-[#2d7ff9]">130 980 FCFA</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
            <FileText size={16} className="text-[#2d7ff9]" />
            <span className="text-[14px] font-semibold text-[var(--text-primary)]">Recu PDF</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
            <MessageCircle size={16} className="text-green-400" />
            <span className="text-[14px] font-semibold text-[var(--text-primary)]">WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="px-4 pt-3 pb-6 border-t border-[var(--border)]">
        <button
          onClick={onBack}
          className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white
            bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98]
            transition-all duration-150 flex items-center justify-center gap-2"
        >
          <CheckCircle size={20} />
          Confirmer &amp; Terminer
        </button>
      </div>
    </div>
  )
}
