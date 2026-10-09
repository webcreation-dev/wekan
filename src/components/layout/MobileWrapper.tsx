import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function MobileWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Desktop background decoration */}
      <div className="hidden sm:block fixed inset-0 pointer-events-none select-none"
        style={{ background: 'linear-gradient(135deg, #060d16 0%, #0d1b2a 50%, #091420 100%)' }}>
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #2d7ff9 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #2d7ff9 0%, transparent 70%)' }} />
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
          <p className="text-[#0e2235] text-xs font-semibold tracking-[0.3em] uppercase">
            HomeFix · Services Professionnels
          </p>
        </div>
      </div>

      {/* Theme toggle — desktop only, outside frame */}
      <div className="hidden sm:block fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Phone shell — takes full viewport on mobile, fixed frame on desktop */}
      <div className="mobile-shell relative z-10">
        {children}
      </div>
    </>
  )
}
