'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface SplashScreenProps {
  onFinish: () => void
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => {
      const iv = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { clearInterval(iv); setTimeout(onFinish, 400); return 100 }
          return p + 2
        })
      }, 35)
      return () => clearInterval(iv)
    }, 300)
    return () => clearTimeout(id)
  }, [onFinish])

  return (
    <div
      className="flex flex-col items-center justify-between w-full h-full"
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Logo centré */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Logo image fourni */}
        <div className="relative w-[180px] h-[80px]">
          <Image
            src="/logo.png"
            alt="Wekan"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <p className="text-[11px] font-medium tracking-[0.3em] text-[#94a3b8] uppercase">
          Services Professionnels
        </p>
      </div>

      {/* Barre de progression */}
      <div className="w-full px-8 pb-14 space-y-3">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-medium tracking-[0.18em] text-[#94a3b8] uppercase">
              Chargement...
            </span>
            <span className="text-[10px] font-semibold text-[#64748b]">{Math.min(progress, 100)}%</span>
          </div>
          <div className="w-full h-[2px] rounded-full bg-[#f1f5f9] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: 'linear-gradient(90deg, #000666, #1a237e)',
              }}
            />
          </div>
        </div>
        <div className="text-center">
          <p className="text-[13px] text-[#1a1c1d] font-medium" style={{ fontFamily: 'var(--font-serif, serif)' }}>
            Des soins fiables pour votre maison
          </p>
          <p className="text-[11px] text-[#94a3b8] mt-0.5">v2.4.0 · Bénin</p>
        </div>
      </div>
    </div>
  )
}
