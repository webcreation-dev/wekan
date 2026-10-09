import type { Metadata } from 'next'
import '../globals.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'

export const metadata: Metadata = {
  title: 'Wekan — Dashboard',
  description: "Panneau d'administration HomeFix",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="admin-body">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
