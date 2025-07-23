'use client'

import { useState, useEffect } from 'react'
import { FiUsers, FiMail, FiPhone, FiMapPin, FiSearch } from 'react-icons/fi'
import { HiOfficeBuilding } from 'react-icons/hi'

interface Afdeling {
    id: number
    naam: string
    beschrijving?: string
    manager?: string
    locatie?: string
    kleur?: string
    medewerkers?: number
}

// Mock data voor demonstratie
const mockAfdelingen: Afdeling[] = [
    {
        id: 1,
        naam: 'Human Resources',
        beschrijving: 'Personeelszaken en HR-ondersteuning voor alle medewerkers',
        manager: 'Marloes Visser',
        locatie: 'Hoofdkantoor Amersfoort',
        kleur: '#10B981',
        medewerkers: 8
    },
    {
        id: 2,
        naam: 'IT & Technologie',
        beschrijving: 'Technische ondersteuning en IT-infrastructuur',
        manager: 'Peter Bakker',
        locatie: 'Hoofdkantoor Amersfoort',
        kleur: '#3B82F6',
        medewerkers: 12
    },
    {
        id: 3,
        naam: 'Marketing & Communicatie',
        beschrijving: 'Marketing, communicatie en bedrijfspromotie',
        manager: 'Sophie de Jong',
        locatie: 'Hoofdkantoor Amersfoort',
        kleur: '#8B5CF6',
        medewerkers: 6
    },
    {
        id: 4,
        naam: 'Verkoop',
        beschrijving: 'Commerciële activiteiten en klantrelaties',
        manager: 'Jan Janssen',
        locatie: 'Hoofdkantoor Amersfoort',
        kleur: '#EF4444',
        medewerkers: 15
    },
    {
        id: 5,
        naam: 'Management',
        beschrijving: 'Directie en strategische besluitvorming',
        manager: 'Eline van Berg',
        locatie: 'Hoofdkantoor Amersfoort',
        kleur: '#F59E0B',
        medewerkers: 4
    },
    {
        id: 6,
        naam: 'Finance & Control',
        beschrijving: 'Financiële administratie en controle',
        manager: 'Thomas van der Berg',
        locatie: 'Hoofdkantoor Amersfoort',
        kleur: '#06B6D4',
        medewerkers: 5
    }
]

export default function AfdelingenPagina() {
    const [afdelingen, setAfdelingen] = useState<Afdeling[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedAfdeling, setSelectedAfdeling] = useState<Afdeling | null>(null)

    useEffect(() => {
        // Simuleer loading
        setTimeout(() => {
            setAfdelingen(mockAfdelingen)
            setLoading(false)
        }, 500)
    }, [])

    const filteredAfdelingen = afdelingen.filter(afdeling =>
        afdeling.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        afdeling.beschrijving?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-4">Afdelingen</h1>
                    <p className="text-gray-600 text-lg">Laden...</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-4">Afdelingen</h1>
                <p className="text-gray-600 text-lg">
                    Overzicht van alle afdelingen binnen Elmar Services
                </p>
            </div>

            {/* Zoekbalk */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Zoek afdelingen..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Modal voor afdeling details */}
            {selectedAfdeling && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div
                            className="text-white p-6"
                            style={{ backgroundColor: selectedAfdeling.kleur || '#3B82F6' }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{selectedAfdeling.naam}</h2>
                                    {selectedAfdeling.beschrijving && (
                                        <p className="opacity-90">{selectedAfdeling.beschrijving}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedAfdeling(null)}
                                    className="text-white hover:bg-white/20 rounded-full p-2 text-xl"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Manager details */}
                            {selectedAfdeling.manager && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-primary mb-3">Manager</h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                                                <FiUsers className="text-gray-600" size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold">{selectedAfdeling.manager}</h4>
                                                <div className="space-y-1 mt-2">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <FiMail className="mr-2" />
                                                        <span>{selectedAfdeling.manager.toLowerCase().replace(' ', '.')}@elmarservices.nl</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <FiPhone className="mr-2" />
                                                        <span>+31 33 123 4567</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedAfdeling.locatie && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <FiMapPin className="text-blue-600 mr-2" />
                                            <div>
                                                <p className="font-medium text-blue-900">Locatie</p>
                                                <p className="text-blue-700">{selectedAfdeling.locatie}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <FiUsers className="text-green-600 mr-2" />
                                        <div>
                                            <p className="font-medium text-green-900">Team grootte</p>
                                            <p className="text-green-700">{selectedAfdeling.medewerkers} medewerkers</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Afdelingen Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAfdelingen.map(afdeling => (
                    <div
                        key={afdeling.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setSelectedAfdeling(afdeling)}
                    >
                        {/* Header met afdelingskleur */}
                        <div
                            className="h-2"
                            style={{ backgroundColor: afdeling.kleur || '#3B82F6' }}
                        ></div>

                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-primary mb-2">
                                        {afdeling.naam}
                                    </h3>
                                    {afdeling.beschrijving && (
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                            {afdeling.beschrijving}
                                        </p>
                                    )}
                                </div>
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white ml-4"
                                    style={{ backgroundColor: afdeling.kleur || '#3B82F6' }}
                                >
                                    <HiOfficeBuilding size={20} />
                                </div>
                            </div>

                            {/* Manager info */}
                            {afdeling.manager && (
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                            <FiUsers className="text-gray-600" size={14} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{afdeling.manager}</p>
                                            <p className="text-xs text-gray-500">Manager</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center">
                                    <FiUsers className="mr-1" />
                                    <span>{afdeling.medewerkers} medewerkers</span>
                                </div>
                                {afdeling.locatie && (
                                    <div className="flex items-center">
                                        <FiMapPin className="mr-1" />
                                        <span>Amersfoort</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredAfdelingen.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <HiOfficeBuilding size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Geen afdelingen gevonden</h3>
                    <p className="text-gray-500">
                        {searchTerm ? 'Probeer andere zoektermen' : 'Er zijn nog geen afdelingen toegevoegd'}
                    </p>
                </div>
            )}
        </main>
    )
}