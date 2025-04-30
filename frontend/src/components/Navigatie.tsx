'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigatie() {
    const pathname = usePathname()

    const isActive = (path: string) => {
        return pathname === path
    }

    return (
        <nav className="mt-4">
            <ul className="flex flex-wrap space-x-1 md:space-x-6">
                <li className={`px-3 py-1 rounded-t-md ${isActive('/') ? 'bg-primary-light font-medium' : 'hover:bg-primary-light'}`}>
                    <Link href="/">Home</Link>
                </li>
                <li className={`px-3 py-1 rounded-t-md ${isActive('/nieuws') ? 'bg-primary-light font-medium' : 'hover:bg-primary-light'}`}>
                    <Link href="/nieuws">Nieuws</Link>
                </li>
                <li className={`px-3 py-1 rounded-t-md ${isActive('/documenten') ? 'bg-primary-light font-medium' : 'hover:bg-primary-light'}`}>
                    <Link href="/documenten">Documenten</Link>
                </li>
                <li className={`px-3 py-1 rounded-t-md ${isActive('/afdelingen') ? 'bg-primary-light font-medium' : 'hover:bg-primary-light'}`}>
                    <Link href="/afdelingen">Afdelingen</Link>
                </li>
                <li className={`px-3 py-1 rounded-t-md ${isActive('/personeelszaken') ? 'bg-primary-light font-medium' : 'hover:bg-primary-light'}`}>
                    <Link href="/personeelszaken">Personeelszaken</Link>
                </li>
                <li className={`px-3 py-1 rounded-t-md ${isActive('/kalender') ? 'bg-primary-light font-medium' : 'hover:bg-primary-light'}`}>
                    <Link href="/kalender">Kalender</Link>
                </li>
            </ul>
        </nav>
    )
}