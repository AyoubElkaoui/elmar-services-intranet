// frontend/src/app/nieuws/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiSearch, FiFilter, FiCalendar, FiUser, FiAlertCircle, FiRefreshCw } from 'react-icons/fi'
import { nieuwsAPI, mediaHelpers, APIError, type NieuwsItem } from '@/lib/strapiApi'

const categories = [
    { value: 'alle', label: 'Alle categorieën' },
    { value: 'algemeen', label: 'Algemeen' },
    { value: 'hr', label: 'HR' },
    { value: 'it', label: 'IT' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'verkoop', label: 'Verkoop' }
]

export default function NieuwsPagina() {
    const [nieuws, setNieuws] = useState<NieuwsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('alle')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isSearching, setIsSearching] = useState(false)
    const [retrying, setRetrying] = useState(false)

    const pageSize = 9

    const fetchNieuws = async (page: number = 1, search?: string, category?: string) => {
        try {
            setLoading(page === 1)
            setIsSearching(page > 1)
            setError(null)

            console.log('🔄 Fetching nieuws page:', page, 'search:', search, 'category:', category)

            const response = await nieuwsAPI.getAll({
                page,
                pageSize,
                categorie: category === 'alle' ? undefined : category,
                search: search || undefined,
                sort: 'publicatieDatum:desc'
            })

            console.log('📰 Received:', response.data?.length || 0, 'nieuws items')

            if (page === 1) {
                setNieuws(response.data || [])
            } else {
                setNieuws(prev => [...prev, ...(response.data || [])])
            }

            if (response.meta?.pagination) {
                setTotalPages(response.meta.pagination.pageCount)
                setCurrentPage(response.meta.pagination.page)
            }
        } catch (error) {
            console.error('❌ Error fetching nieuws:', error)
            
            if (error instanceof APIError) {
                if (error.status === 0) {
                    setError('Kan geen verbinding maken met Strapi. Controleer of Strapi draait op http://localhost:1337')
                } else if (error.status === 404) {
                    setError('Content Type "nieuws-items" bestaat niet. Maak het aan in Strapi Admin.')
                } else if (error.status === 403) {
                    setError('Geen toegang tot nieuws API. Controleer de permissions in Strapi Admin.')
                } else {
                    setError(`Fout bij laden van nieuws: ${error.message}`)
                }
            } else {
                setError('Er is een onbekende fout opgetreden')
            }
        } finally {
            setLoading(false)
            setIsSearching(false)
            setRetrying(false)
        }
    }

    useEffect(() => {
        fetchNieuws(1, searchTerm, selectedCategory)
        setCurrentPage(1)
    }, []) // Initial load

    const handleSearch = () => {
        console.log('🔍 Searching with term:', searchTerm, 'category:', selectedCategory)
        fetchNieuws(1, searchTerm, selectedCategory)
        setCurrentPage(1)
    }

    const handleLoadMore = () => {
        if (currentPage < totalPages) {
            fetchNieuws(currentPage + 1, searchTerm, selectedCategory)
        }
    }

    const handleRetry = async () => {
        setRetrying(true)
        await fetchNieuws(1, searchTerm, selectedCategory)
        setCurrentPage(1)
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

    const getImageUrl = (item: NieuwsItem) => {
        return mediaHelpers.getBestImageUrl(item.afbeelding, 'medium')
    }

    if (loading && nieuws.length === 0) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-4">Nieuws & Mededelingen</h1>
                    <p className="text-gray-600 text-lg">
                        Blijf op de hoogte van het laatste nieuws binnen Elmar Services.
                    </p>
                </div>

                <div className="animate-pulse space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                            <div className="w-48 h-12 bg-gray-200 rounded"></div>
                            <div className="w-24 h-12 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                    <div className="h-16 bg-gray-200 rounded"></div>
                                </div>
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
                <h1 className="text-3xl font-bold text-primary mb-4">Nieuws & Mededelingen</h1>
                <p className="text-gray-600 text-lg">
                    Blijf op de hoogte van het laatste nieuws binnen Elmar Services.
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Zoek in nieuwsberichten..."
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

                    <button
                        onClick={handleSearch}
                        disabled={loading || isSearching}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading || isSearching ? 'Zoeken...' : 'Zoeken'}
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="mb-8">
                    <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
                        <FiAlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                            <p className="text-red-800 font-medium">Fout bij laden van nieuws</p>
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                        <button 
                            onClick={handleRetry}
                            disabled={retrying}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            <FiRefreshCw className={retrying ? 'animate-spin' : ''} />
                            {retrying ? 'Bezig...' : 'Probeer opnieuw'}
                        </button>
                        
                        <a 
                            href="http://localhost:1337/admin" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                        >
                            Open Strapi Admin
                        </a>
                    </div>
                </div>
            )}

            {/* Content */}
            {!error && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {nieuws.map(item => (
                            <article key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative h-48">
                                    <Image
                                        src={getImageUrl(item)}
                                        alt={item.titel}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    {item.uitgelicht && (
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-accent text-white px-2 py-1 rounded-full text-xs font-medium">
                                                ★ Uitgelicht
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center text-xs text-gray-500 mb-2">
                                        <FiCalendar className="mr-1" />
                                        <span>{formatDatum(item.publicatieDatum)}</span>
                                        <span className="mx-2">•</span>
                                        <FiUser className="mr-1" />
                                        <span>{item.auteur}</span>
                                    </div>
                                    
                                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                                        {item.titel}
                                    </h3>
                                    
                                    <div className="mb-3">
                                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs capitalize">
                                            {item.categorie}
                                        </span>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                        {item.samenvatting}
                                    </p>
                                    
                                    <Link
                                        href={`/nieuws/${item.id}`}
                                        className="text-accent hover:text-accent-dark text-sm font-medium"
                                    >
                                        Lees meer →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {currentPage < totalPages && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={handleLoadMore}
                                disabled={isSearching}
                                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSearching ? 'Laden...' : 'Meer nieuws laden'}
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {nieuws.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <FiSearch size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Geen nieuws gevonden</h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm || selectedCategory !== 'alle' 
                                    ? 'Probeer andere zoektermen of filters'
                                    : 'Er zijn nog geen nieuwsberichten gepubliceerd'
                                }
                            </p>
                            {(!searchTerm && selectedCategory === 'alle') && (
                                <a 
                                    href="http://localhost:1337/admin" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
                                >
                                    Voeg nieuws toe in Strapi
                                </a>
                            )}
                        </div>
                    )}
                </>
            )}
        </main>
    )
}