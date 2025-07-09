'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiSearch, FiFilter, FiDownload, FiEye, FiFileText, FiAlertCircle, FiRefreshCw, FiUser, FiClock } from 'react-icons/fi'
import { formulierenAPI, fileHelpers, contentHelpers, APIError, type FormulierItem } from '@/lib/strapiApi'

const categories = [
    { value: 'alle', label: 'Alle categorieën' },
    { value: 'HR', label: 'HR' },
    { value: 'IT', label: 'IT' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Verkoop', label: 'Verkoop' },
    { value: 'Algemeen', label: 'Algemeen' }
]

const afdelingen = [
    { value: 'alle', label: 'Alle afdelingen' },
    { value: 'HR', label: 'HR' },
    { value: 'IT', label: 'IT' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Verkoop', label: 'Verkoop' },
    { value: 'Alle', label: 'Alle afdelingen' }
]

export default function FormulierenPagina() {
    const [formulieren, setFormulieren] = useState<FormulierItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('alle')
    const [selectedAfdeling, setSelectedAfdeling] = useState('alle')
    const [showOnlyRequired, setShowOnlyRequired] = useState(false)

    const fetchFormulieren = async () => {
        try {
            setLoading(true)
            setError(null)

            let response;
            if (showOnlyRequired) {
                response = await formulierenAPI.getRequired({
                    categorie: selectedCategory === 'alle' ? undefined : selectedCategory,
                    afdeling: selectedAfdeling === 'alle' ? undefined : selectedAfdeling,
                    search: searchTerm || undefined,
                    sort: 'title:asc'
                })
            } else {
                response = await formulierenAPI.getAll({
                    categorie: selectedCategory === 'alle' ? undefined : selectedCategory,
                    afdeling: selectedAfdeling === 'alle' ? undefined : selectedAfdeling,
                    search: searchTerm || undefined,
                    sort: 'title:asc'
                })
            }

            setFormulieren(response.data || [])
        } catch (error) {
            console.error('❌ Error fetching formulieren:', error)

            if (error instanceof APIError) {
                if (error.status === 0) {
                    setError('Kan geen verbinding maken met Strapi. Controleer of Strapi draait.')
                } else if (error.status === 404) {
                    setError('Content Type "formulieren" bestaat niet. Maak het aan in Strapi Admin.')
                } else if (error.status === 403) {
                    setError('Geen toegang tot formulieren API. Controleer de permissions.')
                } else {
                    setError(`Fout bij laden van formulieren: ${error.message}`)
                }
            } else {
                setError('Er is een onbekende fout opgetreden')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFormulieren()
    }, [selectedCategory, selectedAfdeling, showOnlyRequired])

    const handleSearch = () => {
        fetchFormulieren()
    }

    const handleDownload = (formulier: FormulierItem) => {
        if (formulier.bestand) {
            fileHelpers.downloadFile(formulier.bestand, formulier.title)
        }
    }

    const handleView = (formulier: FormulierItem) => {
        if (formulier.bestand) {
            fileHelpers.viewFile(formulier.bestand)
        }
    }

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-4">Formulieren</h1>
                    <p className="text-gray-600 text-lg">Laden...</p>
                </div>
                <div className="animate-pulse space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-6 h-20"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-lg shadow-md p-6 h-40"></div>
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
                    <h1 className="text-3xl font-bold text-primary mb-4">Formulieren</h1>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <FiAlertCircle className="text-red-500 mr-3" size={24} />
                        <h3 className="text-red-800 font-medium">Fout bij laden</h3>
                    </div>
                    <p className="text-red-600 mb-4">{error}</p>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchFormulieren}
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
                <h1 className="text-3xl font-bold text-primary mb-4">Formulieren</h1>
                <p className="text-gray-600 text-lg">
                    Toegang tot alle bedrijfsformulieren. Totaal: {formulieren.length} formulieren
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Zoek formulieren..."
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

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="onlyRequired"
                            checked={showOnlyRequired}
                            onChange={(e) => setShowOnlyRequired(e.target.checked)}
                            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor="onlyRequired" className="text-sm text-gray-700">
                            Alleen verplicht
                        </label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formulieren.map(formulier => {
                    const fileInfo = fileHelpers.getFileInfo(formulier.bestand)
                    const beschrijving = contentHelpers.formatRichText(formulier.beschrijving)

                    return (
                        <div key={formulier.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center flex-1 min-w-0">
                                    <div className="text-4xl mr-3 flex-shrink-0">
                                        {fileInfo?.icon || '📄'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg mb-1 line-clamp-2">
                                            {formulier.title}
                                        </h3>
                                        <p className={`text-sm font-medium ${fileInfo?.color || 'text-gray-500'}`}>
                                            {fileInfo?.ext.toUpperCase() || 'FILE'}
                                        </p>
                                    </div>
                                </div>

                                {/* Verplicht badge */}
                                {formulier.verplicht && (
                                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                                        Verplicht
                                    </span>
                                )}
                            </div>

                            {/* Beschrijving */}
                            {beschrijving && (
                                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                    {contentHelpers.truncateText(beschrijving, 120)}
                                </p>
                            )}

                            {/* Metadata */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                        {formulier.categorie}
                                    </span>
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                        {formulier.afdeling}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{fileInfo?.size || 'Onbekend'}</span>
                                    <div className="flex items-center">
                                        <FiClock className="mr-1" />
                                        <span>{contentHelpers.formatDate(formulier.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                                {fileInfo?.viewable && (
                                    <button
                                        onClick={() => handleView(formulier)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm"
                                    >
                                        <FiEye size={16} />
                                        Bekijk
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDownload(formulier)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm"
                                >
                                    <FiDownload size={16} />
                                    Download
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Empty State */}
            {formulieren.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <FiFileText size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Geen formulieren gevonden</h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm || selectedCategory !== 'alle' || selectedAfdeling !== 'alle' || showOnlyRequired
                            ? 'Probeer andere zoektermen of filters'
                            : 'Er zijn nog geen formulieren toegevoegd'
                        }
                    </p>
                    <a
                        href="http://localhost:1337/admin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
                    >
                        Voeg formulieren toe in Strapi
                    </a>
                </div>
            )}
        </main>
    )
}