'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiSearch, FiFilter, FiBookOpen, FiClock, FiUser, FiTag, FiStar, FiEye, FiTrendingUp } from 'react-icons/fi'

interface KennisbankArtikel {
    id: number
    documentId: string
    titel: string
    samenvatting: string
    inhoud: any[]
    categorie: string
    subcategorie?: string
    tags?: string
    auteur: string
    reviewDatum?: string
    geldigTot?: string
    bijlagen?: Array<{
        url: string
        name: string
        ext: string
    }>
    gerelateerdeArtikelen?: KennisbankArtikel[]
    moeilijkheidsgraad: 'beginner' | 'gemiddeld' | 'gevorderd' | 'expert'
    leestijd?: number
    toegankelijkVoor: string
    populair: boolean
    weergaven: number
    waardering?: number
    status: 'concept' | 'review' | 'actief' | 'verouderd' | 'gearchiveerd'
    versie: string
    zoekwoorden?: string
    createdAt: string
    updatedAt: string
}

const categories = [
    { value: 'alle', label: 'Alle categorieën' },
    { value: 'procedures', label: 'Procedures' },
    { value: 'handleidingen', label: 'Handleidingen' },
    { value: 'it-documentatie', label: 'IT Documentatie' },
    { value: 'hr-beleid', label: 'HR Beleid' },
    { value: 'kwaliteit', label: 'Kwaliteit' },
    { value: 'veiligheid', label: 'Veiligheid' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'training', label: 'Training' },
    { value: 'veelgestelde-vragen', label: 'FAQ' },
    { value: 'troubleshooting', label: 'Troubleshooting' },
    { value: 'algemeen', label: 'Algemeen' }
]

const difficultyLevels = [
    { value: 'alle', label: 'Alle niveaus' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'gemiddeld', label: 'Gemiddeld' },
    { value: 'gevorderd', label: 'Gevorderd' },
    { value: 'expert', label: 'Expert' }
]

export default function KennisbankPagina() {
    const [artikelen, setArtikelen] = useState<KennisbankArtikel[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('alle')
    const [selectedDifficulty, setSelectedDifficulty] = useState('alle')
    const [sortBy, setSortBy] = useState('updatedAt:desc')

    useEffect(() => {
        fetchArtikelen()
    }, [sortBy])

    const fetchArtikelen = async () => {
        try {
            setLoading(true)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/kennisbank-artikelen?populate=*&sort=${sortBy}&filters[status][$eq]=actief`
            )

            if (!response.ok) {
                throw new Error('Fout bij laden van kennisbank artikelen')
            }

            const data = await response.json()
            setArtikelen(data.data || [])
        } catch (error) {
            console.error('Error fetching kennisbank artikelen:', error)
            setError('Kon kennisbank artikelen niet laden')
        } finally {
            setLoading(false)
        }
    }

    const filteredArtikelen = artikelen.filter(artikel => {
        const matchesSearch = artikel.titel.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artikel.samenvatting.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artikel.tags?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artikel.zoekwoorden?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory = selectedCategory === 'alle' || artikel.categorie === selectedCategory
        const matchesDifficulty = selectedDifficulty === 'alle' || artikel.moeilijkheidsgraad === selectedDifficulty

        return matchesSearch && matchesCategory && matchesDifficulty
    })

    const getDifficultyColor = (difficulty: string) => {
        const colors = {
            beginner: 'bg-green-100 text-green-800',
            gemiddeld: 'bg-yellow-100 text-yellow-800',
            gevorderd: 'bg-orange-100 text-orange-800',
            expert: 'bg-red-100 text-red-800'
        }
        return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }

    const getCategoryIcon = (categorie: string) => {
        const icons = {
            procedures: '📋',
            handleidingen: '📖',
            'it-documentatie': '💻',
            'hr-beleid': '👥',
            kwaliteit: '⭐',
            veiligheid: '🛡️',
            compliance: '⚖️',
            training: '🎓',
            'veelgestelde-vragen': '❓',
            troubleshooting: '🔧',
            algemeen: '📄'
        }
        return icons[categorie as keyof typeof icons] || '📄'
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FiStar
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ))
    }

    const formatReadingTime = (minutes: number) => {
        if (minutes < 1) return '< 1 min'
        if (minutes < 60) return `${minutes} min`
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60
        return `${hours}u ${remainingMinutes}m`
    }

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-4">Kennisbank</h1>
                    <p className="text-gray-600 text-lg">Laden...</p>
                </div>
                <div className="space-y-6">
                    {[1, 2, 3, 4, 5].map(i => (
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
                    <h1 className="text-3xl font-bold text-primary mb-4">Kennisbank</h1>
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
                <h1 className="text-3xl font-bold text-primary mb-4">Kennisbank</h1>
                <p className="text-gray-600 text-lg">
                    Alle bedrijfskennis, procedures en documentatie op één plek
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Zoek in kennisbank..."
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
                        <FiBookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                        >
                            {difficultyLevels.map(level => (
                                <option key={level.value} value={level.value}>{level.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <select
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="updatedAt:desc">Laatst bijgewerkt</option>
                            <option value="titel:asc">Alfabetisch</option>
                            <option value="weergaven:desc">Populairiteit</option>
                            <option value="waardering:desc">Waardering</option>
                        </select>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                        <span>{filteredArtikelen.length} artikelen</span>
                    </div>
                </div>
            </div>

            {/* Populaire artikelen */}
            {searchTerm === '' && selectedCategory === 'alle' && selectedDifficulty === 'alle' && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
                        <FiTrendingUp className="mr-2" />
                        Populaire artikelen
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {artikelen
                            .filter(artikel => artikel.populair)
                            .slice(0, 3)
                            .map(artikel => (
                                <div key={artikel.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                                    <div className="flex items-start mb-3">
                                        <div className="text-2xl mr-3">
                                            {getCategoryIcon(artikel.categorie)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-primary mb-1 line-clamp-2">
                                                {artikel.titel}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {artikel.samenvatting}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center">
                                            <FiEye className="mr-1" />
                                            <span>{artikel.weergaven}</span>
                                        </div>
                                        {artikel.leestijd && (
                                            <div className="flex items-center">
                                                <FiClock className="mr-1" />
                                                <span>{formatReadingTime(artikel.leestijd)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Artikelen lijst */}
            <div className="space-y-6">
                {filteredArtikelen.map(artikel => (
                    <div key={artikel.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-3">
                                    <div className="text-2xl mr-3">
                                        {getCategoryIcon(artikel.categorie)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl text-primary mb-1">
                                            {artikel.titel}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                {artikel.categorie.replace('-', ' ')}
                                            </span>
                                            {artikel.subcategorie && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                    {artikel.subcategorie}
                                                </span>
                                            )}
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(artikel.moeilijkheidsgraad)}`}>
                                                {artikel.moeilijkheidsgraad}
                                            </span>
                                            {artikel.populair && (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                                    ⭐ Populair
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {artikel.samenvatting}
                                </p>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            <FiUser className="mr-1" />
                                            <span>{artikel.auteur}</span>
                                        </div>
                                        {artikel.leestijd && (
                                            <div className="flex items-center">
                                                <FiClock className="mr-1" />
                                                <span>{formatReadingTime(artikel.leestijd)}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <FiEye className="mr-1" />
                                            <span>{artikel.weergaven} weergaven</span>
                                        </div>
                                        {artikel.waardering && (
                                            <div className="flex items-center">
                                                <div className="flex mr-1">
                                                    {renderStars(artikel.waardering)}
                                                </div>
                                                <span>({artikel.waardering})</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs">
                                        Bijgewerkt: {new Date(artikel.updatedAt).toLocaleDateString('nl-NL')}
                                    </div>
                                </div>

                                {artikel.tags && (
                                    <div className="flex items-center mt-3">
                                        <FiTag className="mr-2 text-gray-400" />
                                        <div className="flex flex-wrap gap-1">
                                            {artikel.tags.split(',').map((tag, index) => (
                                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="ml-6 flex flex-col items-end">
                                <Link
                                    href={`/kennisbank/${artikel.documentId}`}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors mb-2"
                                >
                                    Lees meer
                                </Link>
                                {artikel.bijlagen && artikel.bijlagen.length > 0 && (
                                    <span className="text-xs text-gray-500">
                                        {artikel.bijlagen.length} bijlage(n)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredArtikelen.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <FiBookOpen size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Geen artikelen gevonden</h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm || selectedCategory !== 'alle' || selectedDifficulty !== 'alle'
                            ? 'Probeer andere zoektermen of filters'
                            : 'Er zijn nog geen kennisbank artikelen beschikbaar'
                        }
                    </p>
                </div>
            )}
        </main>
    )
}