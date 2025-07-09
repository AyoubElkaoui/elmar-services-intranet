'use client'

import { useState, useEffect } from 'react'
import { FiSearch, FiFilter, FiExternalLink, FiStar, FiTrendingUp, FiLock, FiBookmark, FiTag } from 'react-icons/fi'

interface HandigeLink {
    id: number
    documentId: string
    titel: string
    beschrijving?: string
    url: string
    categorie: string
    type: string
    icoon?: string
    afbeelding?: {
        url: string
        name: string
    }
    vereistInloggen: boolean
    toegankelijkVoor: string
    belangrijk: boolean
    nieuw: boolean
    populariteit: number
    tags?: string
    contactpersoon?: string
    laatstGecontroleerd?: string
    actief: boolean
    volgorde: number
    createdAt: string
    updatedAt: string
}

const categories = [
    { value: 'alle', label: 'Alle categorieën' },
    { value: 'werktools', label: 'Werktools' },
    { value: 'hr-systemen', label: 'HR Systemen' },
    { value: 'it-ondersteuning', label: 'IT Ondersteuning' },
    { value: 'training', label: 'Training' },
    { value: 'externe-partners', label: 'Externe Partners' },
    { value: 'overheidsdiensten', label: 'Overheidsdiensten' },
    { value: 'vakorganisaties', label: 'Vakorganisaties' },
    { value: 'software', label: 'Software' },
    { value: 'communicatie', label: 'Communicatie' },
    { value: 'projectmanagement', label: 'Projectmanagement' },
    { value: 'algemeen', label: 'Algemeen' }
]

const types = [
    { value: 'alle', label: 'Alle types' },
    { value: 'intern-systeem', label: 'Intern Systeem' },
    { value: 'externe-website', label: 'Externe Website' },
    { value: 'applicatie', label: 'Applicatie' },
    { value: 'document', label: 'Document' },
    { value: 'video', label: 'Video' },
    { value: 'training', label: 'Training' },
    { value: 'handleiding', label: 'Handleiding' }
]

export default function LinksPagina() {
    const [links, setLinks] = useState<HandigeLink[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('alle')
    const [selectedType, setSelectedType] = useState('alle')
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

    useEffect(() => {
        fetchLinks()
    }, [])

    const fetchLinks = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/handige-links?populate=*&sort=volgorde:asc,titel:asc`)

            if (!response.ok) {
                throw new Error('Fout bij laden van links')
            }

            const data = await response.json()
            setLinks(data.data || [])
        } catch (error) {
            console.error('Error fetching links:', error)
            setError('Kon links niet laden')
        } finally {
            setLoading(false)
        }
    }

    const filteredLinks = links.filter(link => {
        const matchesSearch = link.titel.toLowerCase().includes(searchTerm.toLowerCase()) ||
            link.beschrijving?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            link.tags?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory = selectedCategory === 'alle' || link.categorie === selectedCategory
        const matchesType = selectedType === 'alle' || link.type === selectedType
        const matchesFavorites = !showFavoritesOnly || link.belangrijk

        return matchesSearch && matchesCategory && matchesType && matchesFavorites && link.actief
    })

    const getCategoryColor = (categorie: string) => {
        const colors = {
            werktools: 'bg-blue-100 text-blue-800',
            'hr-systemen': 'bg-green-100 text-green-800',
            'it-ondersteuning': 'bg-purple-100 text-purple-800',
            training: 'bg-orange-100 text-orange-800',
            'externe-partners': 'bg-indigo-100 text-indigo-800',
            overheidsdiensten: 'bg-red-100 text-red-800',
            vakorganisaties: 'bg-pink-100 text-pink-800',
            software: 'bg-cyan-100 text-cyan-800',
            communicatie: 'bg-yellow-100 text-yellow-800',
            projectmanagement: 'bg-emerald-100 text-emerald-800',
            algemeen: 'bg-gray-100 text-gray-800'
        }
        return colors[categorie as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }

    const getTypeIcon = (type: string) => {
        const icons = {
            'intern-systeem': '🏢',
            'externe-website': '🌐',
            applicatie: '📱',
            document: '📄',
            video: '📹',
            training: '🎓',
            handleiding: '📖'
        }
        return icons[type as keyof typeof icons] || '🔗'
    }

    const handleLinkClick = (link: HandigeLink) => {
        // Track popularity (in real app, this would be an API call)
        window.open(link.url, '_blank', 'noopener,noreferrer')
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

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

    if (error) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-4">Handige Links</h1>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-800">{error}</p>
                </div>
            </main>
        )
    }

    const popularLinks = links.filter(link => link.populariteit > 50).sort((a, b) => b.populariteit - a.populariteit).slice(0, 6)
    const newLinks = links.filter(link => link.nieuw).slice(0, 4)

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-4">Handige Links</h1>
                <p className="text-gray-600 text-lg">
                    Alle belangrijke links en tools op één plek
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Zoek links..."
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
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            {types.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
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

            {/* Popular Links */}
            {searchTerm === '' && selectedCategory === 'alle' && selectedType === 'alle' && !showFavoritesOnly && popularLinks.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
                        <FiTrendingUp className="mr-2" />
                        Populaire links
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {popularLinks.map(link => (
                            <div
                                key={link.id}
                                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => handleLinkClick(link)}
                            >
                                <div className="flex items-start mb-3">
                                    <div className="text-2xl mr-3">
                                        {link.icoon || getTypeIcon(link.type)}
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
                                    <span>{link.populariteit} clicks</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* New Links */}
            {searchTerm === '' && selectedCategory === 'alle' && selectedType === 'alle' && !showFavoritesOnly && newLinks.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
                        <FiStar className="mr-2" />
                        Nieuwe links
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {newLinks.map(link => (
                            <div
                                key={link.id}
                                className="bg-green-50 rounded-lg p-4 border border-green-200 cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => handleLinkClick(link)}
                            >
                                <div className="flex items-start mb-2">
                                    <div className="text-xl mr-2">
                                        {link.icoon || getTypeIcon(link.type)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-green-900 mb-1 line-clamp-1">
                                            {link.titel}
                                        </h3>
                                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            NIEUW
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Links */}
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
                                        {link.icoon || getTypeIcon(link.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg mb-1 line-clamp-2">
                                            {link.titel}
                                        </h3>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(link.categorie)}`}>
                                                {link.categorie.replace('-', ' ')}
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
                                    <span className="mr-3">{link.type.replace('-', ' ')}</span>
                                    {link.populariteit > 0 && (
                                        <span>{link.populariteit} clicks</span>
                                    )}
                                </div>
                                {link.laatstGecontroleerd && (
                                    <span>Gecontroleerd: {formatDate(link.laatstGecontroleerd)}</span>
                                )}
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
                        {searchTerm || selectedCategory !== 'alle' || selectedType !== 'alle' || showFavoritesOnly
                            ? 'Probeer andere zoektermen of filters'
                            : 'Er zijn nog geen links beschikbaar'
                        }
                    </p>
                </div>
            )}
        </main>
    )
}