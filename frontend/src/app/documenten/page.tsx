'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiSearch, FiFilter, FiDownload, FiEye, FiFolder, FiAlertCircle, FiRefreshCw, FiClock, FiUser } from 'react-icons/fi'

// Mock data voor demonstratie
const mockDocumenten = [
    {
        id: 1,
        titel: 'Personeelshandboek 2025',
        beschrijving: 'Het complete personeelshandboek met alle bedrijfsrichtlijnen en procedures',
        categorie: 'handboeken',
        afdeling: 'HR',
        auteur: 'HR Team',
        versie: '2.1',
        downloadbaar: true,
        bekijkbaar: true,
        updatedAt: '2025-01-15T10:30:00Z',
        fileType: 'pdf',
        fileSize: '2.4 MB'
    },
    {
        id: 2,
        titel: 'Veiligheidsprocedures Kantoor',
        beschrijving: 'Veiligheidsprocedures en noodplannen voor het kantoor',
        categorie: 'procedures',
        afdeling: 'Alle',
        auteur: 'Facilitair Team',
        versie: '1.3',
        downloadbaar: true,
        bekijkbaar: true,
        updatedAt: '2025-01-10T14:20:00Z',
        fileType: 'pdf',
        fileSize: '1.8 MB'
    },
    {
        id: 3,
        titel: 'IT Gebruikershandleiding',
        beschrijving: 'Handleiding voor het gebruik van IT-systemen en software',
        categorie: 'it-documentatie',
        afdeling: 'IT',
        auteur: 'Peter Bakker',
        versie: '3.0',
        downloadbaar: true,
        bekijkbaar: true,
        updatedAt: '2025-01-08T09:15:00Z',
        fileType: 'pdf',
        fileSize: '5.2 MB'
    },
    {
        id: 4,
        titel: 'Marketing Brandguidelines',
        beschrijving: 'Richtlijnen voor het gebruik van huisstijl en branding',
        categorie: 'handboeken',
        afdeling: 'Marketing',
        auteur: 'Sophie de Jong',
        versie: '2.0',
        downloadbaar: true,
        bekijkbaar: true,
        updatedAt: '2025-01-05T16:45:00Z',
        fileType: 'pdf',
        fileSize: '8.7 MB'
    },
    {
        id: 5,
        titel: 'Declaratieformulier 2025',
        beschrijving: 'Formulier voor het indienen van onkostendeclaraties',
        categorie: 'formulieren',
        afdeling: 'HR',
        auteur: 'Finance Team',
        versie: '1.0',
        downloadbaar: true,
        bekijkbaar: true,
        updatedAt: '2025-01-03T11:00:00Z',
        fileType: 'pdf',
        fileSize: '245 KB'
    },
    {
        id: 6,
        titel: 'Kwaliteitshandboek ISO 9001',
        beschrijving: 'Kwaliteitshandboek conform ISO 9001 standaarden',
        categorie: 'beleid',
        afdeling: 'Management',
        auteur: 'Kwaliteitsmanager',
        versie: '4.2',
        downloadbaar: true,
        bekijkbaar: true,
        updatedAt: '2024-12-20T13:30:00Z',
        fileType: 'pdf',
        fileSize: '3.1 MB'
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
    { value: 'HR', label: 'HR' },
    { value: 'IT', label: 'IT' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Verkoop', label: 'Verkoop' },
    { value: 'Management', label: 'Management' },
    { value: 'Alle', label: 'Alle afdelingen' }
]

export default function DocumentenPagina() {
    const [documenten, setDocumenten] = useState(mockDocumenten)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('alle')
    const [selectedAfdeling, setSelectedAfdeling] = useState('alle')

    useEffect(() => {
        // Simuleer loading
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [])

    const filteredDocumenten = documenten.filter(doc => {
        const matchesSearch = doc.titel.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.beschrijving.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'alle' || doc.categorie === selectedCategory
        const matchesAfdeling = selectedAfdeling === 'alle' || doc.afdeling === selectedAfdeling

        return matchesSearch && matchesCategory && matchesAfdeling
    })

    const handleView = (document: any) => {
        alert(`Bekijk document: ${document.titel}`)
    }

    const handleDownload = (document: any) => {
        alert(`Download document: ${document.titel}`)
    }

    const formatDatum = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
        } catch {
            return 'Onbekend'
        }
    }

    const getFileIcon = (fileType: string) => {
        switch (fileType.toLowerCase()) {
            case 'pdf': return '📄'
            case 'doc':
            case 'docx': return '📝'
            case 'xls':
            case 'xlsx': return '📊'
            case 'ppt':
            case 'pptx': return '📽️'
            default: return '📎'
        }
    }

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-4">Documenten & Bestanden</h1>
                    <p className="text-gray-600 text-lg">Laden...</p>
                </div>
                <div className="animate-pulse space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-6 h-20"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-white rounded-lg shadow-md p-4 h-32"></div>
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
                    Toegang tot alle bedrijfsdocumenten. Totaal: {documenten.length} documenten
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
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDocumenten.map(document => (
                    <div key={document.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
                        {/* File header */}
                        <div className="flex items-start justify-between mb-4">
                            <Link
                                href={`/documenten/${document.id}`}
                                className="flex items-center flex-1 min-w-0 hover:text-primary transition-colors"
                            >
                                <div className="text-4xl mr-3 flex-shrink-0">
                                    {getFileIcon(document.fileType)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm mb-1 line-clamp-2 hover:text-primary">
                                        {document.titel}
                                    </h3>
                                    <p className="text-xs font-medium text-red-600">
                                        {document.fileType.toUpperCase()}
                                    </p>
                                </div>
                            </Link>

                            {/* Action buttons */}
                            <div className="flex gap-1 ml-2">
                                {document.bekijkbaar && (
                                    <button
                                        onClick={() => handleView(document)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Bekijk bestand"
                                    >
                                        <FiEye size={16} />
                                    </button>
                                )}
                                {document.downloadbaar && (
                                    <button
                                        onClick={() => handleDownload(document)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Download bestand"
                                    >
                                        <FiDownload size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Beschrijving */}
                        {document.beschrijving && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {document.beschrijving}
                            </p>
                        )}

                        {/* Metadata */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
                                    {document.categorie.replace('-', ' ')}
                                </span>
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    {document.afdeling}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center">
                                    <FiUser className="mr-1" />
                                    <span>{document.auteur}</span>
                                </div>
                                <span>{document.fileSize}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                            <div className="flex items-center">
                                <FiClock className="mr-1" />
                                <span>{formatDatum(document.updatedAt)}</span>
                            </div>
                            {document.versie && (
                                <span>v{document.versie}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredDocumenten.length === 0 && (
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
                            <strong>Demo modus:</strong><br/>
                            Deze pagina toont mock data. In een echte omgeving worden documenten geladen vanuit Strapi.
                        </p>
                    </div>
                </div>
            )}
        </main>
    )
}