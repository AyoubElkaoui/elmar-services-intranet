'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiSearch, FiFilter, FiDownload, FiEye, FiFolder, FiAlertCircle, FiRefreshCw, FiClock, FiUser } from 'react-icons/fi'
import { bestandenAPI, fileHelpers, APIError, type BestandItem } from '@/lib/strapiApi'

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
    const [bestanden, setBestanden] = useState<BestandItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('alle')
    const [selectedAfdeling, setSelectedAfdeling] = useState('alle')

    const fetchBestanden = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await bestandenAPI.getAll({
                categorie: selectedCategory === 'alle' ? undefined : selectedCategory,
                afdeling: selectedAfdeling === 'alle' ? undefined : selectedAfdeling,
                search: searchTerm || undefined,
                sort: 'updatedAt:desc',
                pageSize: 50
            })

            setBestanden(response.data || [])
        } catch (error) {
            console.error('❌ Error fetching bestanden:', error)

            if (error instanceof APIError) {
                if (error.status === 0) {
                    setError('Kan geen verbinding maken met Strapi. Controleer of Strapi draait op http://localhost:1337')
                } else if (error.status === 404) {
                    setError('Content Type "bestanden" bestaat niet. Maak het aan in Strapi Admin.')
                } else if (error.status === 403) {
                    setError('Geen toegang tot bestanden API. Controleer de permissions in Strapi Admin.')
                } else {
                    setError(`Fout bij laden van bestanden: ${error.message}`)
                }
            } else {
                setError('Er is een onbekende fout opgetreden')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBestanden()
    }, [selectedCategory, selectedAfdeling])

    const handleSearch = () => {
        fetchBestanden()
    }

    const handleView = (bestand: BestandItem) => {
        if (bestand.bestand && bestand.bekijkbaar) {
            fileHelpers.viewFile(bestand.bestand)
        } else {
            alert('Dit bestand kan niet worden bekeken')
        }
    }

    const handleDownload = (bestand: BestandItem) => {
        if (bestand.bestand && bestand.downloadbaar) {
            fileHelpers.downloadFile(bestand.bestand, bestand.titel)
        } else {
            alert('Dit bestand kan niet worden gedownload')
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
                    <div className="flex items-center mb-4">
                        <FiAlertCircle className="text-red-500 mr-3" size={24} />
                        <h3 className="text-red-800 font-medium">Fout bij laden</h3>
                    </div>
                    <p className="text-red-600 mb-4">{error}</p>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchBestanden}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                        >
                            <FiRefreshCw className="inline mr-2" />
                            Probeer opnieuw
                        </button>
                        <a
                            href="http://localhost:1337/admin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Open Strapi Admin
                        </a>
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
                    Toegang tot alle bedrijfsdocumenten. Totaal: {bestanden.length} documenten
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
                {bestanden.map(bestand => {
                    const fileInfo = fileHelpers.getFileInfo(bestand.bestand)

                    return (
                        <div key={bestand.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
                            {/* File header */}
                            <div className="flex items-start justify-between mb-4">
                                <Link
                                    href={`/documenten/${bestand.id}`}
                                    className="flex items-center flex-1 min-w-0 hover:text-primary transition-colors"
                                >
                                    <div className="text-4xl mr-3 flex-shrink-0">
                                        {fileInfo?.icon || '📎'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-sm mb-1 line-clamp-2 hover:text-primary">
                                            {bestand.titel}
                                        </h3>
                                        <p className={`text-xs font-medium ${fileInfo?.color || 'text-gray-500'}`}>
                                            {fileInfo?.ext.toUpperCase() || 'FILE'}
                                        </p>
                                    </div>
                                </Link>

                                {/* Action buttons */}
                                <div className="flex gap-1 ml-2">
                                    {bestand.bekijkbaar && fileInfo?.viewable && (
                                        <button
                                            onClick={() => handleView(bestand)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Bekijk bestand"
                                        >
                                            <FiEye size={16} />
                                        </button>
                                    )}
                                    {bestand.downloadbaar && (
                                        <button
                                            onClick={() => handleDownload(bestand)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Download bestand"
                                        >
                                            <FiDownload size={16} />
                                        </button>
                                    )}
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
                                        {bestand.Categorie?.replace('-', ' ') || 'Algemeen'}
                                    </span>
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                        {bestand.afdeling || 'Alle'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center">
                                        <FiUser className="mr-1" />
                                        <span>{bestand.auteur}</span>
                                    </div>
                                    <span>{fileInfo?.size || 'Onbekend'}</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                                <div className="flex items-center">
                                    <FiClock className="mr-1" />
                                    <span>{formatDatum(bestand.updatedAt)}</span>
                                </div>
                                {bestand.versie && (
                                    <span>v{bestand.versie}</span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Empty State */}
            {bestanden.length === 0 && (
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
                            <strong>Voeg bestanden toe:</strong><br/>
                            Ga naar Strapi Admin en voeg documenten toe in &#34;Bestanden&#34;
                        </p>
                        <a
                            href="http://localhost:1337/admin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
                        >
                            Open Strapi Admin
                        </a>
                    </div>
                </div>
            )}
        </main>
    )
}