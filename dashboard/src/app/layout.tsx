import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crokodile Eye',
  description: 'M2M Economy Monitoring',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
