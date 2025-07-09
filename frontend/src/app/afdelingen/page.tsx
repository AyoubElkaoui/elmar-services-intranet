'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FiUsers, FiMail, FiPhone, FiMapPin, FiSearch, FiUser } from 'react-icons/fi'
import { HiOfficeBuilding } from 'react-icons/hi'

interface Afdeling {
    id: number
    documentId: string
    naam: string
    beschrijving?: string
    manager?: {
        voornaam: string
        achternaam: string
        email: string
        telefoonnummer?: string
        profielfoto?: {
            url: string
        }
    }
    locatie?: string
    kleur?: string
    actief: boolean
    medewerkers?: Array<{
        id: number
        voornaam: string
        achternaam: string
        functie: string
        email: string
        profielfoto?: {
            url: string
        }
    }>
    createdAt: string
    updatedAt: string
}

export default function AfdelingenPagina() {
    const [afdelingen, setAfdelingen] = useState<Afdeling[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedAfdeling, setSelectedAfdeling] = useState<Afdeling | null>(null)

    useEffect(() => {
        fetchAfdelingen()
    }, [])

    const fetchAfdelingen = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/afdelingen?populate=*`)

            if (!response.ok) {
                throw new Error('Fout bij laden van afdelingen')
            }

            const data = await response.json()
            setAfdelingen(data.data || [])
        } catch (error) {
            console.error('Error fetching afdelingen:', error)
            setError('Kon afdelingen niet laden')
        } finally {
            setLoading(false)
        }
    }

    const filteredAfdelingen = afdelingen.filter(afdeling =>
        afdeling.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        afdeling.beschrijving?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getAfdelingKleur = (kleur?: string) => kleur || '#3B82F6'

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

    if (error) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-4">Afdelingen</h1>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-800">{error}</p>
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
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div
                            className="text-white p-6"
                            style={{ backgroundColor: getAfdelingKleur(selectedAfdeling.kleur) }}
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
                                    className="text-white hover:bg-white/20 rounded-full p-2"
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
                                            {selectedAfdeling.manager.profielfoto ? (
                                                <div className="w-16 h-16 relative rounded-full overflow-hidden mr-4">
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${selectedAfdeling.manager.profielfoto.url}`}
                                                        alt={`${selectedAfdeling.manager.voornaam} ${selectedAfdeling.manager.achternaam}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                                                    <FiUser className="text-gray-600" size={24} />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-bold">
                                                    {selectedAfdeling.manager.voornaam} {selectedAfdeling.manager.achternaam}
                                                </h4>
                                                <div className="space-y-1 mt-2">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <FiMail className="mr-2" />
                                                        <a href={`mailto:${selectedAfdeling.manager.email}`} className="hover:text-primary">
                                                            {selectedAfdeling.manager.email}
                                                        </a>
                                                    </div>
                                                    {selectedAfdeling.manager.telefoonnummer && (
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <FiPhone className="mr-2" />
                                                            <a href={`tel:${selectedAfdeling.manager.telefoonnummer}`} className="hover:text-primary">
                                                                {selectedAfdeling.manager.telefoonnummer}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Medewerkers */}
                            {selectedAfdeling.medewerkers && selectedAfdeling.medewerkers.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-primary mb-3">
                                        Medewerkers ({selectedAfdeling.medewerkers.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {selectedAfdeling.medewerkers.map(medewerker => (
                                            <div key={medewerker.id} className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex items-center">
                                                    {medewerker.profielfoto ? (
                                                        <div className="w-10 h-10 relative rounded-full overflow-hidden mr-3">
                                                            <Image
                                                                src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${medewerker.profielfoto.url}`}
                                                                alt={`${medewerker.voornaam} ${medewerker.achternaam}`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                                            <FiUser className="text-gray-600" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">
                                                            {medewerker.voornaam} {medewerker.achternaam}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {medewerker.functie}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Locatie en andere info */}
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
                                            <p className="text-green-700">{selectedAfdeling.medewerkers?.length || 0} medewerkers</p>
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
                            style={{ backgroundColor: getAfdelingKleur(afdeling.kleur) }}
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
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                                    style={{ backgroundColor: getAfdelingKleur(afdeling.kleur) }}
                                >
                                    <HiOfficeBuilding size={20} />
                                </div>
                            </div>

                            {/* Manager info */}
                            {afdeling.manager && (
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        {afdeling.manager.profielfoto ? (
                                            <div className="w-10 h-10 relative rounded-full overflow-hidden mr-3">
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${afdeling.manager.profielfoto.url}`}
                                                    alt={`${afdeling.manager.voornaam} ${afdeling.manager.achternaam}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                                <FiUser className="text-gray-600" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-sm">
                                                {afdeling.manager.voornaam} {afdeling.manager.achternaam}
                                            </p>
                                            <p className="text-xs text-gray-500">Manager</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="flex items-center text-sm text-gray-600">
                                <FiUsers className="mr-1" />
                                <span>{afdeling.medewerkers?.length || 0} medewerkers</span>
                                {afdeling.locatie && (
                                    <>
                                        <span className="mx-2">•</span>
                                        <FiMapPin className="mr-1" />
                                        <span>{afdeling.locatie}</span>
                                    </>
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