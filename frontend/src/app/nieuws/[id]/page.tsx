// frontend/src/app/nieuws/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FiArrowLeft, FiCalendar, FiUser, FiTag, FiAlertCircle, FiRefreshCw } from 'react-icons/fi'
import { nieuwsAPI, mediaHelpers, contentHelpers, APIError, type NieuwsItem } from '@/lib/strapiApi'

export default function NieuwsDetailPagina() {
    const params = useParams()
    const [nieuws, setNieuws] = useState<NieuwsItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [retrying, setRetrying] = useState(false)

    const fetchNieuwsDetail = async () => {
        try {
            setLoading(true)
            setError(null)
            
            console.log('🔄 Fetching nieuws detail for ID:', params.id)
            
            try {
                // Probeer eerst normale methode
                const response = await nieuwsAPI.getById(Number(params.id))
                console.log('📰 Nieuws detail received via ID:', response.data?.titel)
                setNieuws(response.data)
            } catch (directError) {
                console.log('❌ Direct fetch failed, trying filter method...')
                
                // Fallback: gebruik filter methode
                const filterResponse = await nieuwsAPI.getByIdViaFilter(Number(params.id))
                console.log('📰 Filter response:', filterResponse)
                
                if (filterResponse.data && filterResponse.data.length > 0) {
                    console.log('✅ Found via filter:', filterResponse.data[0].titel)
                    setNieuws(filterResponse.data[0])
                } else {
                    throw new Error('Artikel niet gevonden via filter')
                }
            }
        } catch (error) {
            console.error('❌ Error fetching nieuws detail:', error)
            
            if (error instanceof APIError) {
                if (error.status === 0) {
                    setError('Kan geen verbinding maken met Strapi. Controleer of Strapi draait.')
                } else if (error.status === 404) {
                    setError(`Nieuwsartikel met ID ${params.id} bestaat niet. Probeer een ander ID of ga terug naar het overzicht.`)
                } else if (error.status === 403) {
                    setError('Geen toegang tot dit nieuwsartikel.')
                } else {
                    setError(`Fout bij laden van artikel: ${error.message}`)
                }
            } else {
                setError(`Artikel niet gevonden: ${error instanceof Error ? error.message : 'Onbekende fout'}`)
            }
        } finally {
            setLoading(false)
            setRetrying(false)
        }
    }

    useEffect(() => {
        if (params.id) {
            fetchNieuwsDetail()
        }
    }, [params.id])

    const handleRetry = async () => {
        setRetrying(true)
        await fetchNieuwsDetail()
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

    const getImageUrl = () => {
        if (!nieuws?.afbeelding) return '/images/placeholder.svg'
        return mediaHelpers.getBestImageUrl(nieuws.afbeelding, 'large')
    }

    // Clean HTML content for display
    const getCleanContent = (richTextBlocks: NieuwsItem['inhoud']) => {
        return contentHelpers.richTextToHtml(richTextBlocks)
    }

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <Link
                            href="/nieuws"
                            className="inline-flex items-center text-accent hover:text-accent-dark"
                        >
                            <FiArrowLeft className="mr-2" />
                            Terug naar nieuws
                        </Link>
                    </div>

                    <div className="animate-pulse">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="h-64 md:h-96 bg-gray-200"></div>
                            <div className="p-6 md:p-10 space-y-4">
                                <div className="flex gap-4 mb-6">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                </div>
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-16 bg-gray-200 rounded"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <Link
                            href="/nieuws"
                            className="inline-flex items-center text-accent hover:text-accent-dark"
                        >
                            <FiArrowLeft className="mr-2" />
                            Terug naar nieuws
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                                <FiAlertCircle className="text-red-500 mr-3 flex-shrink-0" size={24} />
                                <div>
                                    <p className="text-red-800 font-medium">Artikel kon niet worden geladen</p>
                                    <p className="text-red-600 text-sm mt-1">{error}</p>
                                </div>
                            </div>
                            
                            <div className="flex justify-center gap-3">
                                <button 
                                    onClick={handleRetry}
                                    disabled={retrying}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiRefreshCw className={retrying ? 'animate-spin' : ''} />
                                    {retrying ? 'Bezig...' : 'Probeer opnieuw'}
                                </button>
                                
                                <Link 
                                    href="/nieuws"
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Terug naar overzicht
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (!nieuws) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <Link
                            href="/nieuws"
                            className="inline-flex items-center text-accent hover:text-accent-dark"
                        >
                            <FiArrowLeft className="mr-2" />
                            Terug naar nieuws
                        </Link>
                    </div>
                    
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel niet gevonden</h1>
                        <Link href="/nieuws" className="btn-primary">
                            Terug naar nieuws
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/nieuws"
                        className="inline-flex items-center text-accent hover:text-accent-dark"
                    >
                        <FiArrowLeft className="mr-2" />
                        Terug naar nieuws
                    </Link>
                </div>

                <article className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-64 md:h-96">
                        <Image
                            src={getImageUrl()}
                            alt={nieuws.titel}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                        />
                        {nieuws.Uitgelicht && (
                            <div className="absolute top-4 left-4">
                                <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                                    ★ Uitgelicht
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="p-6 md:p-10">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                            <div className="flex items-center">
                                <FiCalendar className="mr-2" />
                                <span>{formatDatum(nieuws.publicatieDatum)}</span>
                            </div>
                            <div className="flex items-center">
                                <FiUser className="mr-2" />
                                <span>{nieuws.Auteur}</span>
                            </div>
                            <div className="flex items-center">
                                <FiTag className="mr-2" />
                                <span className="capitalize bg-gray-100 px-2 py-1 rounded-full">
                                    {nieuws.Categorie}
                                </span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                            {nieuws.titel}
                        </h1>

                        <div className="text-xl text-gray-700 mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-accent">
                            {nieuws.samenvatting}
                        </div>

                        <div 
                            className="prose prose-lg max-w-none prose-headings:text-primary prose-links:text-accent prose-links:hover:text-accent-dark"
                            dangerouslySetInnerHTML={{ 
                                __html: getCleanContent(nieuws.inhoud) 
                            }}
                        />

                        {/* Metadata footer */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex flex-wrap justify-between items-center text-sm text-gray-500">
                                <div>
                                    Gepubliceerd op {formatDatum(nieuws.publicatieDatum)} door {nieuws.Auteur}
                                </div>
                                <div>
                                    Laatst bijgewerkt: {formatDatum(nieuws.updatedAt)}
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Navigation to other articles */}
                <div className="mt-8 text-center">
                    <Link
                        href="/nieuws"
                        className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                        <FiArrowLeft className="mr-2" />
                        Meer nieuws lezen
                    </Link>
                </div>
            </div>
        </main>
    )
}