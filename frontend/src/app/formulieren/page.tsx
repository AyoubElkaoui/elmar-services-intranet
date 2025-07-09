'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiSearch, FiFilter, FiDownload, FiExternalLink, FiFileText, FiClock, FiUser, FiTag } from 'react-icons/fi'

interface Formulier {
    id: number
    documentId: string
    titel: string
    beschrijving: string
    categorie: 'hr' | 'it' | 'financien' | 'inkoop' | 'facilities' | 'compliance' | 'algemeen'
    type: 'aanvraagformulier' | 'declaratieformulier' | 'evaluatieformulier' | 'klachtformulier' | 'contactformulier' | 'registratieformulier' | 'feedback' | 'anders'
    bestand?: {
        url: string
        name: string
        ext: string
        size: number
    }
    downloadbaar: boolean
    interactief: boolean
    externeUrl?: string
    vereistInloggen: boolean
    toegankelijkVoor: string
    instructies?: any[]
    verwerkingstijd?: string
    contactpersoon?: string
    prioriteit: 'laag' | 'normaal' | 'hoog'
    actief: boolean
    versie: string
    tags?: string
    createdAt: string
    updatedAt: string
}

const categories = [
    { value: 'alle', label: 'Alle categorieën' },
    { value: 'hr', label: 'HR' },
    { value: 'it', label: 'IT' },
    { value: 'financien', label: 'Financiën' },
    { value: 'inkoop', label: 'Inkoop' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'algemeen', label: 'Algemeen' }
]

const types = [
    { value: 'alle', label: 'Alle types' },
    { value: 'aanvraagformulier', label: 'Aanvraag' },
    { value: 'declaratieformulier', label: 'Declaratie' },
    { value: 'evaluatieformulier', label: 'Evaluatie' },
    { value: 'klachtformulier', label: 'Klacht' },
    { value: 'contactformulier', label: 'Contact' },
    { value: 'registratieformulier', label: 'Registratie' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'anders', label: 'Anders' }
]

export default function FormulierenPagina() {
    const [formulieren, setFormulieren] = useState<Formulier[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('alle')
    const [selectedType, setSelectedType] = useState('alle')

    useEffect(() => {
        fetchFormulieren()
    }, [])

    const fetchFormulieren = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/formulieren?populate=*&sort=titel:asc`)

            if (!response.ok) {
                throw new Error('Fout bij laden van formulieren')
            }

            const data = await response.json()
            setFormulieren(data.data || [])
        } catch (error) {
            console.error('Error fetching formulieren:', error)
            setError('Kon formulieren niet laden')
        } finally {
            setLoading(false)
        }
    }

    const filteredFormulieren = formulieren.filter(formulier => {
        const matchesSearch = formulier.titel.toLowerCase().includes(searchTerm.toLowerCase()) ||
            formulier.beschrijving.toLowerCase().includes(searchTerm.toLowerCase()) ||
            formulier.tags?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory = selectedCategory === 'alle' || formulier.categorie === selectedCategory
        const matchesType = selectedType === 'alle' || formulier.type === selectedType

        return matchesSearch && matchesCategory && matchesType && formulier.actief
    })

    const getCategoryColor = (categorie: string) => {
        const colors = {
            hr: 'bg-blue-100 text-blue-800',
            it: 'bg-purple-100 text-purple-800',
            financien: 'bg-green-100 text-green-800',
            inkoop: 'bg-orange-100 text-orange-800',
            facilities: 'bg-indigo-100 text-indigo-800',
            compliance: 'bg-red-100 text-red-800',
            algemeen: 'bg-gray-100 text-gray-800'
        }
        return colors[categorie as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }

    const getTypeIcon = (type: string) => {
        const icons = {
            aanvraagformulier: '📝',
            declaratieformulier: '💰',
            evaluatieformulier: '📊',
            klachtformulier: '❗',
            contactformulier: '📞',
            registratieformulier: '📋',
            feedback: '💬',
            anders: '📄'
        }
        return icons[type as keyof typeof icons] || '📄'
    }

    const handleFormulierAction = (formulier: Formulier) => {
        if (formulier.externeUrl) {
            window.open(formulier.externeUrl, '_blank', 'noopener,noreferrer')
        } else if (formulier.bestand && formulier.downloadbaar) {
            const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${formulier.bestand.url}`
            const link = document.createElement('a')
            link.href = url
            link.download = formulier.bestand.name
            link.target = '_blank'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-4">Formulieren</h1>
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
                    <h1 className="text-3xl font-bold text-primary mb-4">Formulieren</h1>
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
                <h1 className="text-3xl font-bold text-primary mb-4">Formulieren</h1>
                <p className="text-gray-600 text-lg">
                    Alle bedrijfsformulieren en aanvraagprocedures op één plek
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Zoek formulieren..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative">
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

                    <div className="relative">
                        <FiFileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            {types.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                        <span>{filteredFormulieren.length} formulieren gevonden</span>
                    </div>
                </div>
            </div>

            {/* Formulieren Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFormulieren.map(formulier => (
                    <div key={formulier.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Header */}
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="text-3xl mr-3">
                                        {getTypeIcon(formulier.type)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1 line-clamp-2">
                                            {formulier.titel}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(formulier.categorie)}`}>
                                                {formulier.categorie.toUpperCase()}
                                            </span>
                                            {formulier.prioriteit === 'hoog' && (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    BELANGRIJK
                                                </span>
                                            )}
                                            {formulier.interactief && (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    ONLINE
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Beschrijving */}
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {formulier.beschrijving}
                            </p>

                            {/* Metadata */}
                            <div className="space-y-2 mb-4 text-xs text-gray-500">
                                {formulier.verwerkingstijd && (
                                    <div className="flex items-center">
                                        <FiClock className="mr-1" />
                                        <span>Verwerkingstijd: {formulier.verwerkingstijd}</span>
                                    </div>
                                )}
                                {formulier.contactpersoon && (
                                    <div className="flex items-center">
                                        <FiUser className="mr-1" />
                                        <span>Contact: {formulier.contactpersoon}</span>
                                    </div>
                                )}
                                {formulier.bestand && (
                                    <div className="flex items-center">
                                        <FiFileText className="mr-1" />
                                        <span>{formulier.bestand.ext.toUpperCase()} • {formatFileSize(formulier.bestand.size)}</span>
                                    </div>
                                )}
                                {formulier.tags && (
                                    <div className="flex items-center">
                                        <FiTag className="mr-1" />
                                        <span>{formulier.tags}</span>
                                    </div>
                                )}
                            </div>

                            {/* Acties */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleFormulierAction(formulier)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    {formulier.externeUrl ? (
                                        <>
                                            <FiExternalLink size={16} />
                                            Open formulier
                                        </>
                                    ) : (
                                        <>
                                            <FiDownload size={16} />
                                            Download
                                        </>
                                    )}
                                </button>

                                {formulier.instructies && formulier.instructies.length > 0 && (
                                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                        <FiFileText size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Toegankelijkheidswaarschuwing */}
                            {formulier.vereistInloggen && (
                                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                                    ⚠️ Inloggen vereist
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredFormulieren.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <FiFileText size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Geen formulieren gevonden</h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm || selectedCategory !== 'alle' || selectedType !== 'alle'
                            ? 'Probeer andere zoektermen of filters'
                            : 'Er zijn nog geen formulieren beschikbaar'
                        }
                    </p>
                </div>
            )}
        </main>
    )
}