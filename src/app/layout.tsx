import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import MainAppContextProvider from './context/MainAppContextProvider'

const montserrat = Montserrat({
  variable: '--font-montserrat-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Grid Controlled Additive Synth',
  description:
    'An additive synthesizer made using Web Audio API along with a grid pad controller.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <div className="flex flex-col items-stretch h-full">
          <main className="flex-1">
            <MainAppContextProvider>{children}</MainAppContextProvider>
          </main>
          <footer>
            <nav className="flex flex-row justify-evenly items-center h-20">
              <Link href="/">Grid</Link>
            </nav>
          </footer>
        </div>
      </body>
    </html>
  )
}
