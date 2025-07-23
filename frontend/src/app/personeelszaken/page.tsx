'use client'

import Link from 'next/link'
import { FiUser, FiCalendar, FiDollarSign, FiBookOpen, FiClock, FiAward, FiHeart, FiFileText } from 'react-icons/fi'
import { Metadata } from 'next'

const hrServices = [
    {
        id: 1,
        title: 'Verlof Aanvragen',
        description: 'Vraag vakantie, ziektelof of andere vormen van verlof aan',
        icon: <FiCalendar className="text-2xl" />,
        href: '/personeelszaken/verlof',
        color: 'bg-blue-500'
    },
    {
        id: 2,
        title: 'Declaraties',
        description: 'Dien je onkosten en declaraties in voor vergoeding',
        icon: <FiDollarSign className="text-2xl" />,
        href: '/personeelszaken/declaraties',
        color: 'bg-green-500'
    },
    {
        id: 3,
        title: 'Personeelshandboek',
        description: 'Bekijk het complete personeelshandboek en bedrijfsrichtlijnen',
        icon: <FiBookOpen className="text-2xl" />,
        href: '/personeelszaken/handboek',
        color: 'bg-purple-500'
    },
    {
        id: 4,
        title: 'Werkuren Registratie',
        description: 'Registreer je werkuren en bekijk je urenverantwoording',
        icon: <FiClock className="text-2xl" />,
        href: '/personeelszaken/uren',
        color: 'bg-orange-500'
    },
    {
        id: 5,
        title: 'Beoordelingen',
        description: 'Bekijk je performance beoordelingen en ontwikkelplannen',
        icon: <FiAward className="text-2xl" />,
        href: '/personeelszaken/beoordelingen',
        color: 'bg-red-500'
    },
    {
        id: 6,
        title: 'Verzekeringen',
        description: 'Informatie over ziektekostenverzekering en andere verzekeringen',
        icon: <FiHeart className="text-2xl" />,
        href: '/personeelszaken/verzekeringen',
        color: 'bg-pink-500'
    }
]

const quickStats = [
    { label: 'Verlof saldo', value: '18 dagen', subtext: 'Resterend dit jaar' },
    { label: 'Overuren', value: '4.5 uur', subtext: 'Deze maand' },
    { label: 'Declaraties', value: '2 open', subtext: 'Wacht op goedkeuring' },
    { label: 'In dienst sinds', value: '3 jaar', subtext: 'Maart 2022' }
]

export default function PersoneelszakenPagina() {
    return (
        <main className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-4">Personeelszaken</h1>
                <p className="text-gray-600 text-lg">
                    Alle HR-gerelateerde services en informatie op één plek
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {quickStats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                            <div className="text-sm font-medium text-gray-700 mb-1">{stat.label}</div>
                            <div className="text-xs text-gray-500">{stat.subtext}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Services Grid */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-6">HR Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hrServices.map(service => (
                        <Link key={service.id} href={service.href}>
                            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer">
                                <div className="flex items-start">
                                    <div className={`${service.color} text-white rounded-lg p-3 mr-4`}>
                                        {service.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {service.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Updates */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
                    <FiFileText className="mr-2" />
                    Recente Updates
                </h2>
                <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                        <h3 className="font-medium text-gray-900">Nieuw verlofbeleid 2025</h3>
                        <p className="text-sm text-gray-600">Het nieuwe verlofbeleid is nu van kracht. Bekijk de wijzigingen in het personeelshandboek.</p>
                        <span className="text-xs text-blue-600">2 dagen geleden</span>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4 py-2">
                        <h3 className="font-medium text-gray-900">Declaraties systeem update</h3>
                        <p className="text-sm text-gray-600">Het declaratiesysteem is geüpdatet met nieuwe functies voor betere tracking.</p>
                        <span className="text-xs text-green-600">1 week geleden</span>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4 py-2">
                        <h3 className="font-medium text-gray-900">Werkuren registratie wijziging</h3>
                        <p className="text-sm text-gray-600">Nieuwe richtlijnen voor het registreren van werkuren en pauzes.</p>
                        <span className="text-xs text-orange-600">2 weken geleden</span>
                    </div>
                </div>
            </div>

            {/* Contact HR */}
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-2">Hulp nodig?</h2>
                        <p className="text-blue-100">
                            Neem contact op met HR voor vragen die niet via de self-service portal opgelost kunnen worden.
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="mb-2">
                            <span className="block text-sm text-blue-200">HR Helpdesk</span>
                            <span className="block font-medium">hr@elmarservices.nl</span>
                        </div>
                        <div>
                            <span className="block text-sm text-blue-200">Telefoon</span>
                            <span className="block font-medium">033 - 123 4567</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}