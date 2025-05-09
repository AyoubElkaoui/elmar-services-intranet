import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Elmar Services Intranet',
    description: 'Intranet voor Elmar Services medewerkers',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="nl">
        <body className={`${inter.className} min-h-screen bg-gray-50 flex flex-col`}>
        <Header />
        {children}
        <Footer />
        </body>
        </html>
    )
}