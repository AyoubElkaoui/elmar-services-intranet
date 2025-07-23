'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiSearch, FiFilter, FiDownload, FiEye, FiFolder, FiAlertCircle, FiRefreshCw, FiClock, FiUser } from 'react-icons/fi'
import { bestandenAPI, fileHelpers, type Bestand } from '@/lib/strapiApi'

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
    const [documenten, setDocumenten] = useState<Bestand[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('alle')
    const [selectedAfdeling, setSelectedAfdeling] = useState('alle')

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError(null)

                console.log('🔄 Loading documents...')
                const response = await bestandenAPI.getAll()
                console.log('📄 Loaded bestanden:', response)

                setDocumenten(response.data)

            } catch (err) {
                console.error('❌ Error loading data:', err)
                setError('Er is een fout opgetreden bij het laden van de documenten.')
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    const filteredDocumenten = documenten.filter(doc => {
        const matchesSearch = doc.titel.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.beschrijving?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'alle' || doc.Categorie === selectedCategory
        const matchesAfdeling = selectedAfdeling === 'alle' || doc.afdeling === selectedAfdeling

        return matchesSearch && matchesCategory && matchesAfdeling
    })

    const handleView = (document: Bestand) => {
        const fileUrl = fileHelpers.getFileUrl(document.bestand)
        if (fileUrl) {
            window.open(fileUrl, '_blank')
        } else {
            alert(`Bekijk document: ${document.titel}`)
        }
    }

    const handleDownload = (document: Bestand) => {
        const fileUrl = fileHelpers.getFileUrl(document.bestand)
        if (fileUrl && document.bestand) {
            const link = window.document.createElement('a')
            link.href = fileUrl
            link.download = document.bestand.name
            window.document.body.appendChild(link)
            link.click()
            window.document.body.removeChild(link)
        } else {
            alert(`Download document: ${document.titel}`)
        }
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

    const getInitials = (naam: string) => {
        return naam.split(' ').map(n => n[0]).join('').toUpperCase()
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

    if (error) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-4">Documenten & Bestanden</h1>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <FiAlertCircle className="text-red-600 mr-3" size={24} />
                        <div>
                            <h2 className="text-lg font-medium text-red-900 mb-2">Fout bij laden</h2>
                            <p className="text-red-700">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                            >
                                <FiRefreshCw className="mr-2" />
                                Opnieuw proberen
                            </button>
                        </div>
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
                {documenten.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                        <p className="text-yellow-800 text-sm">
                            <strong>Debug info:</strong><br/>
                            • Check of je document is "Published" in Strapi admin<br/>
                            • Open de browser console (F12) voor meer details
                        </p>
                    </div>
                )}
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
                                href={`/documenten/${document.documentId}`}
                                className="flex items-center flex-1 min-w-0 hover:text-primary transition-colors"
                            >
                                <div className="text-4xl mr-3 flex-shrink-0">
                                    {fileHelpers.getFileIcon(document.bestand?.ext)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm mb-1 line-clamp-2 hover:text-primary">
                                        {document.titel}
                                    </h3>
                                    <p className="text-xs font-medium text-red-600">
                                        {document.bestand?.ext?.replace('.', '').toUpperCase() || 'DOCUMENT'}
                                    </p>
                                </div>
                            </Link>

                            {/* Action buttons */}
                            <div className="flex gap-1 ml-2">
                                {document.bekijkbaar !== false && (
                                    <button
                                        onClick={() => handleView(document)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Bekijk bestand"
                                    >
                                        <FiEye size={16} />
                                    </button>
                                )}
                                {document.downloadbaar !== false && (
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
                                    {document.Categorie.replace('-', ' ')}
                                </span>
                                {document.afdeling && (
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                        {document.afdeling}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                {document.auteur && (
                                    <div className="flex items-center">
                                        <FiUser className="mr-1" />
                                        <span>{document.auteur}</span>
                                    </div>
                                )}
                                <span>{fileHelpers.formatFileSize(document.bestand?.size)}</span>
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
                            : documenten.length === 0
                                ? 'Er zijn nog geen bestanden geüpload in Strapi'
                                : 'Geen resultaten voor de geselecteerde filters'
                        }
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-blue-800 text-sm">
                            <strong>Strapi integratie:</strong><br/>
                            1. Ga naar Strapi admin (localhost:1337/admin)<br/>
                            2. Voeg een "Bestand" toe in Content Manager<br/>
                            3. Upload een bestand en klik "Save & Publish"<br/>
                            4. Het document verschijnt hier automatisch!
                        </p>
                    </div>
                </div>
            )}
        </main>
    )
}