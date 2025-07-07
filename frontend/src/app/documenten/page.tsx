// frontend/src/app/documenten/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { FiSearch, FiFilter, FiDownload, FiEye, FiFolder, FiAlertCircle, FiRefreshCw, FiClock, FiUser } from 'react-icons/fi'

// Tijdelijke types en API functies tot Strapi Content Type klaar is
interface TempBestand {
    id: number
    titel: string
    beschrijving?: string
    categorie: string
    afdeling: string
    bestandstype: string
    grootte: string
    auteur: string
    datum: string
    downloadUrl: string
}

// Mock data voor nu
const mockBestanden: TempBestand[] = [
    {
        id: 1,
        titel: "IT Handboek 2025",
        beschrijving: "Compleet handboek voor alle IT procedures en richtlijnen",
        categorie: "it-documentatie",
        afdeling: "it",
        bestandstype: "pdf",
        grootte: "2.5 MB",
        auteur: "IT Beheer",
        datum: "2025-01-15",
        downloadUrl: "#"
    },
    {
        id: 2,
        titel: "HR Beleid Document",
        beschrijving: "Overzicht van alle HR beleid en procedures",
        categorie: "beleid",
        afdeling: "hr",
        bestandstype: "docx",
        grootte: "1.8 MB",
        auteur: "HR Team",
        datum: "2025-01-10",
        downloadUrl: "#"
    },
    {
        id: 3,
        titel: "Verlofaanvraag Formulier",
        beschrijving: "Formulier voor het aanvragen van verlof",
        categorie: "formulieren",
        afdeling: "alle",
        bestandstype: "pdf",
        grootte: "156 KB",
        auteur: "HR Team",
        datum: "2025-01-05",
        downloadUrl: "#"
    }
]

const categories = [
    { value: 'alle', label: 'Alle categorieën' },
    { value: 'beleid', label: 'Beleid' },
    { value: 'procedures', label: 'Procedures' },
    { value: 'formulieren', label: 'Formulieren' },
    { value: 'handboeken', label: 'Handboeken' },
    { value: 'it-documentatie', label: 'IT Documentatie' },
    { value: 'algemeen', label: 'Algemeen' }
]

const afdelingen = [
    { value: 'alle', label: 'Alle afdelingen' },
    { value: 'hr', label: 'HR' },
    { value: 'it', label: 'IT' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'verkoop', label: 'Verkoop' },
    { value: 'management', label: 'Management' }
]

// Helper functies
const getFileIcon = (type: string): string => {
    const icons: Record<string, string> = {
        pdf: '📄',
        doc: '📝',
        docx: '📝',
        xls: '📊',
        xlsx: '📊',
        ppt: '📽️',
        pptx: '📽️',
        txt: '📄',
        zip: '🗜️'
    }
    return icons[type.toLowerCase()] || '📎'
}

const getFileColor = (type: string): string => {
    const colors: Record<string, string> = {
        pdf: 'text-red-600',
        doc: 'text-blue-600',
        docx: 'text-blue-600',
        xls: 'text-green-600',
        xlsx: 'text-green-600',
        ppt: 'text-orange-600',
        pptx: 'text-orange-600'
    }
    return colors[type.toLowerCase()] || 'text-gray-500'
}

export default function DocumentenPagina() {
    const [bestanden, setBestanden] = useState<TempBestand[]>([])
    const [filteredBestanden, setFilteredBestanden] = useState<TempBestand[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('alle')
    const [selectedAfdeling, setSelectedAfdeling] = useState('alle')

    useEffect(() => {
        // Simuleer API call
        setTimeout(() => {
            setBestanden(mockBestanden)
            setFilteredBestanden(mockBestanden)
            setLoading(false)
        }, 1000)
    }, [])

    useEffect(() => {
        // Filter bestanden
        let filtered = bestanden

        if (searchTerm) {
            filtered = filtered.filter(bestand =>
                bestand.titel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bestand.beschrijving?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (selectedCategory !== 'alle') {
            filtered = filtered.filter(bestand => bestand.categorie === selectedCategory)
        }

        if (selectedAfdeling !== 'alle') {
            filtered = filtered.filter(bestand => bestand.afdeling === selectedAfdeling)
        }

        setFilteredBestanden(filtered)
    }, [bestanden, searchTerm, selectedCategory, selectedAfdeling])

    const handleSearch = () => {
        // Filter wordt automatisch uitgevoerd door useEffect
        console.log('Zoeken naar:', searchTerm)
    }

    const handleDownload = (bestand: TempBestand) => {
        // Hier zou je de download logica implementeren
        alert(`Download: ${bestand.titel}`)
    }

    const handleView = (bestand: TempBestand) => {
        // Hier zou je het bestand openen in nieuwe tab
        alert(`Bekijk: ${bestand.titel}`)
    }

    const formatDatum = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        } catch {
            return 'Onbekende datum'
        }
    }

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-4">Documenten & Bestanden</h1>
                    <p className="text-gray-600 text-lg">
                        Toegang tot alle bedrijfsdocumenten en formulieren.
                    </p>
                </div>

                <div className="animate-pulse space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                            <div className="w-48 h-12 bg-gray-200 rounded"></div>
                            <div className="w-48 h-12 bg-gray-200 rounded"></div>
                            <div className="w-24 h-12 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-white rounded-lg shadow-md p-4">
                                <div className="h-16 bg-gray-200 rounded mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-4">Documenten & Bestanden</h1>
                <p className="text-gray-600 text-lg">
                    Toegang tot alle bedrijfsdocumenten en formulieren.
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Zoek bestanden..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>

                    <div className="relative min-w-[200px]">
                        <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative min-w-[200px]">
                        <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                            value={selectedAfdeling}
                            onChange={(e) => setSelectedAfdeling(e.target.value)}
                        >
                            {afdelingen.map(afd => (
                                <option key={afd.value} value={afd.value}>{afd.label}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleSearch}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                    >
                        Zoeken
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBestanden.map(bestand => (
                    <div key={bestand.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
                        {/* File header met icoon en acties */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center flex-1 min-w-0">
                                <div className="text-4xl mr-3 flex-shrink-0">
                                    {getFileIcon(bestand.bestandstype)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm mb-1 line-clamp-2">
                                        {bestand.titel}
                                    </h3>
                                    <p className={`text-xs font-medium ${getFileColor(bestand.bestandstype)}`}>
                                        {bestand.bestandstype.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Action buttons */}
                            <div className="flex gap-1 ml-2">
                                <button
                                    onClick={() => handleView(bestand)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Bekijk bestand"
                                >
                                    <FiEye size={16} />
                                </button>
                                <button
                                    onClick={() => handleDownload(bestand)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Download bestand"
                                >
                                    <FiDownload size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Beschrijving */}
                        {bestand.beschrijving && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {bestand.beschrijving}
                            </p>
                        )}

                        {/* Metadata */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
                                    {bestand.categorie.replace('-', ' ')}
                                </span>
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
                                    {bestand.afdeling}
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center">
                                    <FiUser className="mr-1" />
                                    <span>{bestand.auteur}</span>
                                </div>
                                <span>{bestand.grootte}</span>
                            </div>
                        </div>

                        {/* Footer met datum */}
                        <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                            <div className="flex items-center">
                                <FiClock className="mr-1" />
                                <span>{formatDatum(bestand.datum)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredBestanden.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <FiFolder size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Geen bestanden gevonden</h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm || selectedCategory !== 'alle' || selectedAfdeling !== 'alle'
                            ? 'Probeer andere zoektermen of filters'
                            : 'Er zijn nog geen bestanden geüpload'
                        }
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-blue-800 text-sm">
                            <strong>Voor echte functionaliteit:</strong><br/>
                            Maak eerst het "Bestand" Content Type aan in Strapi Admin
                        </p>
                    </div>
                </div>
            )}
        </main>
    )
}