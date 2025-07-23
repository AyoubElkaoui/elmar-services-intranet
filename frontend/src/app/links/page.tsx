'use client'

import { useState, useEffect } from 'react'
import { FiSearch, FiFilter, FiExternalLink, FiStar, FiTrendingUp, FiLock, FiBookmark, FiTag, FiAlertCircle, FiRefreshCw } from 'react-icons/fi'

interface HandigeLink {
    id: number
    documentId: string
    titel: string
    beschrijving?: string
    url: string
    categorie: string
    afdeling: string
    icoon?: string
    vereistInloggen: boolean
    belangrijk: boolean
    nieuw: boolean
    populariteit: number
    tags?: string
    contactpersoon?: string
    actief: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
}

const categories = [
    { value: 'alle', label: 'Alle categorieën' },
    { value: 'Intern', label: 'Interne Tools' },
    { value: 'Extern', label: 'Externe Tools' },
    { value: 'Tools', label: 'Productiviteit Tools' },
    { value: 'Software', label: 'Software & Apps' }
]

const afdelingen = [
    { value: 'alle', label: 'Alle afdelingen' },
    { value: 'HR', label: 'HR' },
    { value: 'IT', label: 'IT' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Verkoop', label: 'Verkoop' },
    { value: 'Alle', label: 'Alle afdelingen' }
]

// Standaard Microsoft 365 en populaire tools
const defaultLinks = [
    {
        id: 1,
        titel: 'Outlook',
        beschrijving: 'E-mail en agenda beheer',
        url: 'https://outlook.office.com',
        categorie: 'Tools',
        icoon: '📧',
        belangrijk: true
    },
    {
        id: 2,
        titel: 'Teams',
        beschrijving: 'Chat, videobellen en samenwerking',
        url: 'https://teams.microsoft.com',
        categorie: 'Tools',
        icoon: '💬',
        belangrijk: true
    },
    {
        id: 3,
        titel: 'SharePoint',
        beschrijving: 'Documentbeheer en samenwerking',
        url: 'https://[tenant].sharepoint.com',
        categorie: 'Tools',
        icoon: '📁',
        belangrijk: true
    },
    {
        id: 4,
        titel: 'OneDrive',
        beschrijving: 'Persoonlijke cloudopslag',
        url: 'https://onedrive.live.com',
        categorie: 'Tools',
        icoon: '☁️',
        belangrijk: true
    },
    {
        id: 5,
        titel: 'Clockwise',
        beschrijving: 'Tijdbeheer en focus tijd',
        url: 'https://www.getclockwise.com',
        categorie: 'Tools',
        icoon: '⏰',
        belangrijk: true
    },
    {
        id: 6,
        titel: 'Power BI',
        beschrijving: 'Business intelligence en rapportage',
        url: 'https://powerbi.microsoft.com',
        categorie: 'Tools',
        icoon: '📊',
        belangrijk: false
    }
]

export default function HandigeLinksPage() {
    const [links, setLinks] = useState<HandigeLink[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('alle')
    const [selectedAfdeling, setSelectedAfdeling] = useState('alle')
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
    const [retrying, setRetrying] = useState(false)

    const fetchLinks = async () => {
        try {
            setLoading(true)
            setError(null)

            const searchParams = new URLSearchParams()
            searchParams.append('filters[actief][$eq]', 'true')
            searchParams.append('sort', 'populariteit:desc,titel:asc')
            searchParams.append('populate', '*')

            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/handige-links?${searchParams.toString()}`)

            if (!response.ok) {
                if (response.status === 404) {
                    console.log('⚠️ Handige-links content type niet gevonden, gebruik default links')
                    // Gebruik default links als Strapi nog niet geconfigureerd is
                    setLinks(defaultLinks as any)
                    return
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            console.log('📦 Handige links received:', data)

            if (data.data && data.data.length > 0) {
                setLinks(data.data)
            } else {
                // Als er geen data is, gebruik default links
                setLinks(defaultLinks as any)
            }
        } catch (error) {
            console.error('❌ Error fetching handige links:', error)

            if (error instanceof Error && error.message.includes('fetch')) {
                setError('Kan geen verbinding maken met Strapi. Controleer of Strapi draait op http://localhost:1337')
            } else {
                setError('Fout bij laden van handige links. Controleer of het "handige-links" content type bestaat in Strapi.')
            }

            // Fallback naar default links
            setLinks(defaultLinks as any)
        } finally {
            setLoading(false)
            setRetrying(false)
        }
    }

    useEffect(() => {
        fetchLinks()
    }, [])

    const handleRetry = async () => {
        setRetrying(true)
        await fetchLinks()
    }

    const filteredLinks = links.filter(link => {
        const matchesSearch = link.titel.toLowerCase().includes(searchTerm.toLowerCase()) ||
            link.beschrijving?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            link.tags?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory = selectedCategory === 'alle' || link.categorie === selectedCategory
        const matchesAfdeling = selectedAfdeling === 'alle' || link.afdeling === selectedAfdeling
        const matchesFavorites = !showFavoritesOnly || link.belangrijk

        return matchesSearch && matchesCategory && matchesAfdeling && matchesFavorites
    })

    const getCategoryColor = (categorie: string) => {
        const colors = {
            'Intern': 'bg-blue-100 text-blue-800',
            'Extern': 'bg-green-100 text-green-800',
            'Tools': 'bg-purple-100 text-purple-800',
            'Software': 'bg-orange-100 text-orange-800'
        }
        return colors[categorie as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }

    const handleLinkClick = (link: HandigeLink) => {
        // Track popularity (in een echte app zou dit een API call zijn)
        window.open(link.url, '_blank', 'noopener,noreferrer')
    }

    const favoriteLinks = links.filter(link => link.belangrijk).slice(0, 6)
    const popularLinks = links.filter(link => link.populariteit > 50).sort((a, b) => b.populariteit - a.populariteit).slice(0, 6)

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-4">Handige Links</h1>
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

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-4">Handige Links & Tools</h1>
                <p className="text-gray-600 text-lg">
                    Alle belangrijke tools en links op één plek. Van Microsoft 365 tot externe tools.
                </p>
            </div>

            {/* Error banner */}
            {error && (
                <div className="mb-8">
                    <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <FiAlertCircle className="text-yellow-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                            <p className="text-yellow-800 font-medium">Let op: Standaard links worden getoond</p>
                            <p className="text-yellow-600 text-sm mt-1">{error}</p>
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

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Zoek tools en links..."
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
                        <select
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                            value={selectedAfdeling}
                            onChange={(e) => setSelectedAfdeling(e.target.value)}
                        >
                            {afdelingen.map(afd => (
                                <option key={afd.value} value={afd.value}>{afd.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-primary"
                                checked={showFavoritesOnly}
                                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                            />
                            <span className="ml-2 text-sm">Alleen favorieten</span>
                        </label>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                        <span>{filteredLinks.length} links gevonden</span>
                    </div>
                </div>
            </div>

            {/* Favoriete Tools */}
            {searchTerm === '' && selectedCategory === 'alle' && selectedAfdeling === 'alle' && !showFavoritesOnly && favoriteLinks.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
                        <FiStar className="mr-2" />
                        Favoriete Tools
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favoriteLinks.map(link => (
                            <div
                                key={link.id}
                                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
                                onClick={() => handleLinkClick(link)}
                            >
                                <div className="flex items-start mb-3">
                                    <div className="text-3xl mr-3">
                                        {link.icoon || '🔗'}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-primary mb-1 line-clamp-1">
                                            {link.titel}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {link.beschrijving}
                                        </p>
                                    </div>
                                    <FiExternalLink className="text-gray-400 ml-2" size={16} />
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className={`px-2 py-1 rounded-full ${getCategoryColor(link.categorie)}`}>
                                        {link.categorie}
                                    </span>
                                    {link.vereistInloggen && (
                                        <div className="flex items-center">
                                            <FiLock size={12} className="mr-1" />
                                            <span>Login vereist</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Microsoft 365 Tools */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-primary mb-4">Microsoft 365 Suite</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { naam: 'Outlook', icoon: '📧', url: 'https://outlook.office.com', beschrijving: 'E-mail en agenda' },
                        { naam: 'Teams', icoon: '💬', url: 'https://teams.microsoft.com', beschrijving: 'Chat en videobellen' },
                        { naam: 'SharePoint', icoon: '📁', url: 'https://[tenant].sharepoint.com', beschrijving: 'Documentbeheer' },
                        { naam: 'OneDrive', icoon: '☁️', url: 'https://onedrive.live.com', beschrijving: 'Cloudopslag' }
                    ].map((tool, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => window.open(tool.url, '_blank')}
                        >
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3">{tool.icoon}</span>
                                <div>
                                    <h3 className="font-bold text-gray-900">{tool.naam}</h3>
                                    <p className="text-sm text-gray-500">{tool.beschrijving}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Alle Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLinks.map(link => (
                    <div
                        key={link.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleLinkClick(link)}
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center flex-1">
                                    <div className="text-3xl mr-3">
                                        {link.icoon || '🔗'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg mb-1 line-clamp-2">
                                            {link.titel}
                                        </h3>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(link.categorie)}`}>
                                                {link.categorie}
                                            </span>
                                            {link.belangrijk && (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                                    <FiStar className="inline mr-1" size={10} />
                                                    Favoriet
                                                </span>
                                            )}
                                            {link.nieuw && (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                    NIEUW
                                                </span>
                                            )}
                                            {link.vereistInloggen && (
                                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                                    <FiLock className="inline mr-1" size={10} />
                                                    Login
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <FiExternalLink className="text-gray-400 ml-2 flex-shrink-0" size={20} />
                            </div>

                            {link.beschrijving && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {link.beschrijving}
                                </p>
                            )}

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center">
                                    {link.afdeling && <span className="mr-3">{link.afdeling}</span>}
                                    {link.populariteit > 0 && (
                                        <span>{link.populariteit} clicks</span>
                                    )}
                                </div>
                            </div>

                            {link.tags && (
                                <div className="flex items-center mt-3">
                                    <FiTag className="mr-2 text-gray-400" size={12} />
                                    <div className="flex flex-wrap gap-1">
                                        {link.tags.split(',').slice(0, 3).map((tag, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {link.contactpersoon && (
                                <div className="mt-3 text-xs text-gray-500">
                                    Contact: {link.contactpersoon}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredLinks.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <FiBookmark size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Geen links gevonden</h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm || selectedCategory !== 'alle' || selectedAfdeling !== 'alle' || showFavoritesOnly
                            ? 'Probeer andere zoektermen of filters'
                            : 'Er zijn nog geen links beschikbaar'
                        }
                    </p>
                    <a
                        href="http://localhost:1337/admin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
                    >
                        Voeg links toe in Strapi
                    </a>
                </div>
            )}

            {/* Info box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-2">💡 Beheer je eigen links</h3>
                <p className="text-blue-800 text-sm">
                    Alle links en tools kunnen beheerd worden via Strapi Admin. Voeg nieuwe tools toe,
                    wijzig beschrijvingen of markeer favorieten.
                    <a
                        href="http://localhost:1337/admin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline hover:no-underline ml-1"
                    >
                        Open Strapi Admin →
                    </a>
                </p>
            </div>
        </main>
    )
}