
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
    FiMenu,
    FiX,
    FiBell,
    FiUser,
    FiSettings,
    FiHome,
    FiFileText,
    FiCalendar,
    FiFolder,
    FiUsers,
    FiPhone,
    FiLink,
    FiLogOut
} from 'react-icons/fi'
import { HiOfficeBuilding } from 'react-icons/hi'
import ZoekBalk from './ZoekBalk'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    const navItems = [
        { href: '/', label: 'Dashboard', icon: FiHome },
        { href: '/nieuws', label: 'Nieuws', icon: FiFileText },
        { href: '/kalender', label: 'Kalender', icon: FiCalendar },
        { href: '/documenten', label: 'Documenten', icon: FiFolder },
        { href: '/personeelszaken', label: 'HR', icon: FiUsers },
        { href: '/afdelingen', label: 'Afdelingen', icon: HiOfficeBuilding },
        { href: '/telefoongids', label: 'Telefoongids', icon: FiPhone },
        { href: '/links', label: 'Links', icon: FiLink },
    ]

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top bar */}
                <div className="flex items-center justify-between py-4">
                    {/* Logo & Title */}
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                    E
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <h1 className="text-xl font-bold text-gray-900">Elmar Services</h1>
                                <p className="text-sm text-gray-600">Intranet Portal</p>
                            </div>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? "Sluit menu" : "Open menu"}
                    >
                        {isMenuOpen ? <FiX size={24} className="text-gray-700" /> : <FiMenu size={24} className="text-gray-700" />}
                    </button>

                    {/* Desktop Search & Actions */}
                    <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
                        <div className="flex-1">
                            <ZoekBalk />
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className="hidden md:flex items-center space-x-2">
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                            <FiBell size={20} className="text-gray-600" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                3
                            </span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <FiUser size={16} className="text-white" />
                                </div>
                                <span className="text-gray-700 font-medium">Medewerker</span>
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                    <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                                        <FiUser className="mr-2" size={16} />
                                        Profiel
                                    </a>
                                    <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                                        <FiSettings className="mr-2" size={16} />
                                        Instellingen
                                    </a>
                                    <hr className="my-2" />
                                    <a href="#" className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
                                        <FiLogOut className="mr-2" size={16} />
                                        Uitloggen
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className={`${isMenuOpen ? 'block' : 'hidden md:block'} border-t border-gray-100 md:border-t-0`}>
                    <ul className="flex flex-col md:flex-row md:space-x-1 py-2 md:py-0">
                        {navItems.map((item) => {
                            const IconComponent = item.icon
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center space-x-2 px-4 py-3 md:py-2 rounded-lg transition-colors font-medium ${
                                            isActive(item.href)
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                                        }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <IconComponent size={18} />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    {/* Mobile search */}
                    <div className="md:hidden px-4 py-4 border-t border-gray-100">
                        <ZoekBalk />
                    </div>
                </nav>
            </div>
        </header>
    )
}