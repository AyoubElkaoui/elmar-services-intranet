// frontend/src/app/documenten/page.tsx - WERKENDE DOCUMENTEN PAGINA
'use client'

import { useState, useEffect } from 'react'
import { FiSearch, FiFilter, FiDownload, FiFile, FiFolder } from 'react-icons/fi'

interface Document {
    id: number
    attributes: {
        titel: string
        beschrijving?: string
        categorie: string
        afdeling: string
        updatedAt: string
        bestand: {
            data: {
                attributes: {
                    url: string
                    name: string
                    ext: string
                    size: number
                }
            }
        }
    }
}

export default function DocumentenPagina() {
    const [documenten, setDocumenten] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('alle')

    const categories = [
        { value: 'alle', label: 'Alle categorieën' },
        { value: 'beleid', label: 'Beleid' },
        { value: 'procedures', label: 'Procedures' },
        { value: 'formulieren', label: 'Formulieren' },
        { value: 'handboeken', label: 'Handboeken' }
    ]

    const fetchDocumenten = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            params.append('populate', '*')
            params.append('sort', 'updatedAt:desc')

            if (selectedCategory !== 'alle') {
                params.append('filters[categorie][$eq]', selectedCategory)
            }

            if (searchTerm) {
                params.append('filters[titel][$containsi]', searchTerm)
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/documenten?${params}`)

            if (response.ok) {
                const data = await response.json()
                setDocumenten(data.data || [])
            }
        } catch (error) {
            console.error('Error fetching documenten:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDocumenten()
    }, [])

    const handleSearch = () => {
        fetchDocumenten()
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatDatum = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('nl-NL')
        } catch {
            return 'Onbekende datum'
        }
    }

    const handleDownload = (document: Document) => {
        const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${document.attributes.bestand.data.attributes.url}`
        window.open(url, '_blank')
    }

    const getFileIcon = (ext: string) => {
        return <FiFile className="text-blue-500" size={24} />
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
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Zoek documenten..."
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

                    <button
                        onClick={handleSearch}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                    >
                        Zoeken
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                    <span className="ml-4 text-gray-600">Laden...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documenten.map(document => (
                        <div key={document.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center flex-1">
                                    <div className="mr-3">
                                        {getFileIcon(document.attributes.bestand.data.attributes.ext)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm mb-1">
                                            {document.attributes.titel}
                                        </h3>
                                        <p className="text-xs text-gray-500 capitalize">
                                            {document.attributes.categorie}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDownload(document)}
                                    className="text-accent hover:text-accent-dark p-2"
                                    title="Download"
                                >
                                    <FiDownload size={16} />
                                </button>
                            </div>

                            {document.attributes.beschrijving && (
                                <p className="text-sm text-gray-600 mb-3">
                                    {document.attributes.beschrijving}
                                </p>
                            )}

                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>{formatFileSize(document.attributes.bestand.data.attributes.size)}</span>
                                <span>{formatDatum(document.attributes.updatedAt)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {documenten.length === 0 && !loading && (
                <div className="text-center py-12">
                    <FiFolder className="mx-auto text-6xl text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">Geen documenten gevonden</p>
                </div>
            )}
        </main>
    )
}