'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { FiMenu, FiX } from 'react-icons/fi'
import ZoekBalk from './ZoekBalk'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <header className="bg-primary text-white shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="mr-4">
                            <Image
                                src="/images/logo.png"
                                alt="Elmar Services Logo"
                                width={650}
                                height={300}
                                className="h-20 w-auto"
                                priority
                            />
                        </div>
                        <h1 className="text-2xl font-bold hidden md:block">Intranet</h1>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? "Sluit menu" : "Open menu"}
                    >
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>

                    {/* Desktop search */}
                    <div className="hidden md:block w-1/3">
                        <ZoekBalk />
                    </div>
                </div>

                {/* Navigation - desktop horizontal, mobile full screen */}
                <nav className={`mt-4 ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
                    <ul className="flex flex-col md:flex-row md:space-x-6">
                        <li className={`px-3 py-2 md:py-1 rounded-md md:rounded-t-md md:rounded-b-none ${isActive('/') ? 'bg-primary-light font-medium' : 'hover:bg-primary-light'}`}>
                            <Link href="/">Home</Link>
                        </li>
                        <li className={`px-3 py-2 md:py-1 rounded-md md:rounded-t-md md:rounded-b-none ${isActive('/nieuws') ? 'bg-primary-light font-medium' : 'hover:bg-primary-light'}`}>
                            <Link href="/nieuws">Nieuws</Link>
                        </li>
                        <li className={`px-3 py-2 md:py-1 rounded-md md:rounded-t-md md:rounded-b-none ${isActive('/documenten') ? 'bg-primary-light font-medium' : 'hover:bg-primary-light'}`}>
                            <Link href="/documenten">Documenten</Link>
                        </li>
                        <li className={`px-3 py-2 md:py-1 rounded-md md:rounded-t-md md:rounded-b-none ${isActive('/afdelingen') ? 'bg-primary-light font-medium' : 'hover:bg-primary-light'}`}>
                            <Link href="/afdelingen">Afdelingen</Link>
                        </li>
                        <li className={`px-3 py-2 md:py-1 rounded-md md:rounded-t-md md:rounded-b-none ${isActive('/personeelszaken') ? 'bg-primary-light font-medium' : 'hover:bg-primary-light'}`}>
                            <Link href="/personeelszaken">Personeelszaken</Link>
                        </li>
                        <li className={`px-3 py-2 md:py-1 rounded-md md:rounded-t-md md:rounded-b-none ${isActive('/kalender') ? 'bg-primary-light font-medium' : 'hover:bg-primary-light'}`}>
                            <Link href="/kalender">Kalender</Link>
                        </li>
                    </ul>

                    {/* Mobile search */}
                    <div className="mt-4 md:hidden">
                        <ZoekBalk />
                    </div>
                </nav>
            </div>
        </header>
    )
}
