// frontend/src/app/nieuws/page.tsx - WERKENDE VERSIE
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiSearch, FiFilter, FiCalendar, FiUser } from 'react-icons/fi'

interface NieuwsItem {
    id: number
    attributes: {
        titel: string
        samenvatting: string
        createdAt: string
        categorie: string
        auteur: string
        uitgelicht: boolean
        afbeelding?: {
            data?: {
                attributes: {
                    url: string
                }
            }
        }
    }
}

export default function NieuwsPagina() {
    const [nieuws, setNieuws] = useState<NieuwsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('alle')

    const categories = [
        { value: 'alle', label: 'Alle categorieën' },
        { value: 'algemeen', label: 'Algemeen' },
        { value: 'hr', label: 'HR' },
        { value: 'it', label: 'IT' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'verkoop', label: 'Verkoop' }
    ]

    const fetchNieuws = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            params.append('populate', '*')
            params.append('sort', 'createdAt:desc')

            if (selectedCategory !== 'alle') {
                params.append('filters[categorie][$eq]', selectedCategory)
            }

            if (searchTerm) {
                params.append('filters[titel][$containsi]', searchTerm)
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/nieuws-items?${params}`)

            if (response.ok) {
                const data = await response.json()
                setNieuws(data.data || [])
            }
        } catch (error) {
            console.error('Error fetching nieuws:', error)
            setNieuws([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNieuws()
    }, [])

    const handleSearch = () => {
        fetchNieuws()
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
        const imageUrl = item.attributes.afbeelding?.data?.attributes?.url
        return imageUrl ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${imageUrl}` : '/images/placeholder.svg'
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
                    {nieuws.map(item => (
                        <article key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <Image
                                    src={getImageUrl(item)}
                                    alt={item.attributes.titel}
                                    fill
                                    className="object-cover"
                                />
                                {item.attributes.uitgelicht && (
                                    <div className="absolute top-3 left-3">
                    <span className="bg-accent text-white px-2 py-1 rounded-full text-xs font-medium">
                      Uitgelicht
                    </span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <div className="flex items-center text-xs text-gray-500 mb-2">
                                    <FiCalendar className="mr-1" />
                                    <span>{formatDatum(item.attributes.createdAt)}</span>
                                    <span className="mx-2">•</span>
                                    <FiUser className="mr-1" />
                                    <span>{item.attributes.auteur}</span>
                                </div>
                                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                                    {item.attributes.titel}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                    {item.attributes.samenvatting}
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
            )}

            {nieuws.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Geen nieuwsberichten gevonden</p>
                </div>
            )}
        </main>
    )
}





