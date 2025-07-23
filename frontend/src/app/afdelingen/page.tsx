'use client'

import { useState, useEffect } from 'react'
import { FiUsers, FiMail, FiPhone, FiMapPin, FiSearch, FiArrowRight, FiUser, FiChevronLeft } from 'react-icons/fi'
import { HiOfficeBuilding } from 'react-icons/hi'

interface Medewerker {
    id: number
    naam: string
    functie: string
    email: string
    telefoon?: string
    isManager?: boolean
}

interface Afdeling {
    id: number
    naam: string
    beschrijving?: string
    locatie?: string
    kleur?: string
    medewerkers: Medewerker[]
    manager?: string
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

const fetchAfdelingen = async (): Promise<Afdeling[]> => {
    try {
        const response = await fetch(`${STRAPI_URL}/api/afdelings?populate=*`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()
        console.log('Afdelingen API response:', data)

        if (!data.data) return []

        return data.data.map((item: any) => ({
            id: item.id,
            naam: item.attributes?.naam || item.naam || 'Onbekende afdeling',
            beschrijving: item.attributes?.beschrijving || item.beschrijving || '',
            locatie: item.attributes?.locatie || item.locatie || '',
            kleur: item.attributes?.kleur || item.kleur || '#3B82F6',
            medewerkers: []
        }))
    } catch (error) {
        console.error('Error fetching afdelingen:', error)
        return []
    }
}

const fetchMedewerkers = async (): Promise<any[]> => {
    try {
        const response = await fetch(`${STRAPI_URL}/api/medewerkers?populate=afdeling`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()
        console.log('Medewerkers API response:', data)

        if (!data.data) return []

        return data.data.map((item: any) => {
            const attributes = item.attributes || item
            return {
                id: item.id,
                naam: attributes.naam || 'Onbekende medewerker',
                functie: attributes.functie || '',
                email: attributes.email || '',
                telefoon: attributes.telefoon || '',
                isManager: attributes.isManager || false,
                afdelingId: attributes.afdeling?.data?.id || attributes.afdeling?.id
            }
        })
    } catch (error) {
        console.error('Error fetching medewerkers:', error)
        return []
    }
}

export default function AfdelingenPagina() {
    const [afdelingen, setAfdelingen] = useState<Afdeling[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedAfdeling, setSelectedAfdeling] = useState<Afdeling | null>(null)
    const [showDetailView, setShowDetailView] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError(null)

                const [afdelingenData, medewerkersData] = await Promise.all([
                    fetchAfdelingen(),
                    fetchMedewerkers()
                ])

                console.log('Loaded afdelingen:', afdelingenData)
                console.log('Loaded medewerkers:', medewerkersData)

                const combinedData = afdelingenData.map(afdeling => {
                    const afdelingMedewerkers = medewerkersData.filter(
                        (medewerker: any) => medewerker.afdelingId === afdeling.id
                    )

                    const manager = afdelingMedewerkers.find(m => m.isManager)

                    return {
                        ...afdeling,
                        medewerkers: afdelingMedewerkers,
                        manager: manager?.naam || 'Geen manager'
                    }
                })

                console.log('Final combined data:', combinedData)
                setAfdelingen(combinedData)
            } catch (err) {
                console.error('Error loading data:', err)
                setError('Er is een fout opgetreden bij het laden van de gegevens.')
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    // Test data voor development (als er geen data uit Strapi komt)
    useEffect(() => {
        if (!loading && afdelingen.length === 0) {
            console.log('No data from Strapi, using test data')
            const testData: Afdeling[] = [
                {
                    id: 1,
                    naam: 'IT Afdeling',
                    beschrijving: 'Verantwoordelijk voor alle IT-systemen en ondersteuning',
                    locatie: 'Amersfoort',
                    kleur: '#3B82F6',
                    manager: 'Peter Bakker',
                    medewerkers: [
                        {
                            id: 1,
                            naam: 'Peter Bakker',
                            functie: 'IT Manager',
                            email: 'peter@elmarservices.nl',
                            telefoon: '033-1234567',
                            isManager: true
                        },
                        {
                            id: 2,
                            naam: 'Jan de Vries',
                            functie: 'Systeembeheerder',
                            email: 'jan@elmarservices.nl',
                            telefoon: '033-1234568',
                            isManager: false
                        }
                    ]
                },
                {
                    id: 2,
                    naam: 'HR & Administratie',
                    beschrijving: 'Human Resources en algemene administratie',
                    locatie: 'Amersfoort',
                    kleur: '#10B981',
                    manager: 'Marie van der Berg',
                    medewerkers: [
                        {
                            id: 3,
                            naam: 'Marie van der Berg',
                            functie: 'HR Manager',
                            email: 'marie@elmarservices.nl',
                            telefoon: '033-1234569',
                            isManager: true
                        }
                    ]
                }
            ]
            setAfdelingen(testData)
        }
    }, [loading, afdelingen.length])

    const filteredAfdelingen = afdelingen.filter(afdeling =>
        afdeling.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        afdeling.beschrijving?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        afdeling.medewerkers.some(m =>
            m.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.functie.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const getInitials = (naam: string) => {
        return naam.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    const formatPhoneNumber = (phone?: string) => {
        if (!phone) return null
        return phone.replace('+31', '0').replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3')
    }

    const handleAfdelingClick = (afdeling: Afdeling) => {
        setSelectedAfdeling(afdeling)
        setShowDetailView(true)
    }

    const handleBackToOverview = () => {
        setShowDetailView(false)
        setSelectedAfdeling(null)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h2 className="text-lg font-medium text-red-900 mb-2">Fout bij laden</h2>
                        <p className="text-red-700">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Opnieuw proberen
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Detail view voor een specifieke afdeling
    if (showDetailView && selectedAfdeling) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header met back button */}
                    <div className="mb-8">
                        <button
                            onClick={handleBackToOverview}
                            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
                        >
                            <FiChevronLeft className="mr-2" />
                            Terug naar overzicht
                        </button>

                        <div className="flex items-center mb-4">
                            <div
                                className="w-16 h-16 rounded-lg flex items-center justify-center text-white mr-4"
                                style={{ backgroundColor: selectedAfdeling.kleur || '#3B82F6' }}
                            >
                                <HiOfficeBuilding size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{selectedAfdeling.naam}</h1>
                                {selectedAfdeling.beschrijving && (
                                    <p className="text-gray-600 text-lg mt-1">{selectedAfdeling.beschrijving}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Afdeling statistieken */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {selectedAfdeling.locatie && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                        <FiMapPin className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Locatie</p>
                                        <p className="text-gray-600">{selectedAfdeling.locatie}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                    <FiUsers className="text-green-600" size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Team grootte</p>
                                    <p className="text-gray-600">{selectedAfdeling.medewerkers.length} medewerkers</p>
                                </div>
                            </div>
                        </div>

                        {selectedAfdeling.manager && selectedAfdeling.manager !== 'Geen manager' && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                        <FiUser className="text-purple-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Manager</p>
                                        <p className="text-gray-600">{selectedAfdeling.manager}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Team leden */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                Team leden ({selectedAfdeling.medewerkers.length})
                            </h2>
                        </div>

                        <div className="p-6">
                            {selectedAfdeling.medewerkers.length === 0 ? (
                                <div className="text-center py-12">
                                    <FiUsers className="mx-auto text-gray-400 mb-4" size={48} />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nog geen medewerkers</h3>
                                    <p className="text-gray-600">Er zijn nog geen medewerkers toegevoegd aan deze afdeling.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {selectedAfdeling.medewerkers.map(medewerker => (
                                        <div key={medewerker.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                                                    {getInitials(medewerker.naam)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h3 className="font-bold text-gray-900 truncate">{medewerker.naam}</h3>
                                                        {medewerker.isManager && (
                                                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                                                                Manager
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3">{medewerker.functie}</p>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <FiMail className="mr-2 flex-shrink-0" size={14} />
                                                            <a
                                                                href={`mailto:${medewerker.email}`}
                                                                className="hover:text-blue-600 transition-colors truncate"
                                                            >
                                                                {medewerker.email}
                                                            </a>
                                                        </div>
                                                        {medewerker.telefoon && (
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <FiPhone className="mr-2 flex-shrink-0" size={14} />
                                                                <a
                                                                    href={`tel:${medewerker.telefoon}`}
                                                                    className="hover:text-blue-600 transition-colors"
                                                                >
                                                                    {formatPhoneNumber(medewerker.telefoon)}
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Hoofdoverzicht van alle afdelingen
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Afdelingen & Medewerkers</h1>
                    <p className="text-gray-600 text-lg">
                        Overzicht van alle afdelingen en medewerkers binnen Elmar Services
                    </p>
                    {afdelingen.length > 0 && (
                        <p className="text-sm text-gray-500 mt-2">
                            {afdelingen.length} afdelingen • {afdelingen.reduce((total, afd) => total + afd.medewerkers.length, 0)} medewerkers
                        </p>
                    )}
                </div>

                {/* Zoekbalk */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Zoek afdelingen of medewerkers..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Afdelingen Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAfdelingen.map(afdeling => (
                        <div
                            key={afdeling.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
                            onClick={() => handleAfdelingClick(afdeling)}
                        >
                            {/* Header met afdelingskleur */}
                            <div
                                className="h-2"
                                style={{ backgroundColor: afdeling.kleur || '#3B82F6' }}
                            ></div>

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {afdeling.naam}
                                        </h3>
                                        {afdeling.beschrijving && (
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                                {afdeling.beschrijving}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center ml-4">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white mr-2"
                                            style={{ backgroundColor: afdeling.kleur || '#3B82F6' }}
                                        >
                                            <HiOfficeBuilding size={20} />
                                        </div>
                                        <FiArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                </div>

                                {/* Manager info */}
                                {afdeling.manager && afdeling.manager !== 'Geen manager' && (
                                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                                <FiUser className="text-gray-600" size={14} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{afdeling.manager}</p>
                                                <p className="text-xs text-gray-500">Manager</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Team preview */}
                                {afdeling.medewerkers.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Team leden</h4>
                                        <div className="flex -space-x-2">
                                            {afdeling.medewerkers.slice(0, 5).map(medewerker => (
                                                <div
                                                    key={medewerker.id}
                                                    className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                                                    title={medewerker.naam}
                                                >
                                                    {getInitials(medewerker.naam)}
                                                </div>
                                            ))}
                                            {afdeling.medewerkers.length > 5 && (
                                                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                                                    +{afdeling.medewerkers.length - 5}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <FiUsers className="mr-1" />
                                        <span>{afdeling.medewerkers.length} medewerkers</span>
                                    </div>
                                    {afdeling.locatie && (
                                        <div className="flex items-center">
                                            <FiMapPin className="mr-1" />
                                            <span>{afdeling.locatie}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredAfdelingen.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <HiOfficeBuilding size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {afdelingen.length === 0 ? 'Nog geen afdelingen' : 'Geen afdelingen gevonden'}
                        </h3>
                        <p className="text-gray-500">
                            {afdelingen.length === 0
                                ? 'Er zijn nog geen afdelingen toegevoegd in Strapi.'
                                : searchTerm
                                    ? 'Probeer andere zoektermen'
                                    : 'Er zijn geen afdelingen beschikbaar.'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}