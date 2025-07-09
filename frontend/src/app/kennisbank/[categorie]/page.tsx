'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiUser, FiClock, FiTag, FiStar, FiEye, FiDownload, FiAlertCircle, FiRefreshCw } from 'react-icons/fi'

interface KennisbankArtikel {
    id: number
    documentId: string
    titel: string
    samenvatting: string
    inhoud: Array<{
        type: string
        children: Array<{
            text: string
            type: string
        }>
    }>
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
        size: number
    }>
    moeilijkheidsgraad: 'beginner' | 'gemiddeld' | 'gevorderd' | 'expert'
    leestijd?: number
    toegankelijkVoor: string
    populair: boolean
    weergaven: number
    waardering?: number
    status: string
    versie: string
    zoekwoorden?: string
    createdAt: string
    updatedAt: string
}

export default function KennisbankDetailPagina() {
    const params = useParams()
    const [artikel, setArtikel] = useState<KennisbankArtikel | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [retrying, setRetrying] = useState(false)

    useEffect(() => {
        const fetchArtikel = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/kennisbank-artikelen/${params.id}?populate=*`)

                if (!response.ok) {
                    throw new Error('Artikel niet gevonden')
                }

                const data = await response.json()
                setArtikel(data.data)
            } catch (error) {
                console.error('Error fetching artikel:', error)
                setError('Kon artikel niet laden')
            } finally {
                setLoading(false)
                setRetrying(false)
            }
        }

        if (params.id) {
            fetchArtikel()
        }
    }, [params.id])

    const handleRetry = async () => {
        setRetrying(true)
        await fetchArtikel()
    }

    const richTextToHtml = (blocks: KennisbankArtikel['inhoud']): string => {
        if (!blocks || !Array.isArray(blocks)) return ''

        return blocks.map(block => {
            if (block.type === 'paragraph') {
                const text = block.children?.map(child => child.text || '').join('') || ''
                return `<p>${text}</p>`
            }
            if (block.type === 'heading') {
                const text = block.children?.map(child => child.text || '').join('') || ''
                return `<h2>${text}</h2>`
            }
            return ''
        }).join('')
    }

    const getDifficultyColor = (difficulty: string) => {
        const colors = {
            beginner: 'bg-green-100 text-green-800',
            gemiddeld: 'bg-yellow-100 text-yellow-800',
            gevorderd: 'bg-orange-100 text-orange-800',
            expert: 'bg-red-100 text-red-800'
        }
        return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FiStar
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ))
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
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
                <div className="max-w-4xl mx-auto">
                    <Link href="/kennisbank" className="inline-flex items-center text-accent hover:text-accent-dark mb-6">
                        <FiArrowLeft className="mr-2" />
                        Terug naar kennisbank
                    </Link>
                    <div className="animate-pulse bg-white rounded-lg shadow-md p-8">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-16 bg-gray-200 rounded mb-6"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (error || !artikel) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/kennisbank" className="inline-flex items-center text-accent hover:text-accent-dark mb-6">
                        <FiArrowLeft className="mr-2" />
                        Terug naar kennisbank
                    </Link>
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {error || 'Artikel niet gevonden'}
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Het artikel kon niet worden geladen.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={handleRetry}
                                disabled={retrying}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                            >
                                <FiRefreshCw className={retrying ? 'animate-spin' : ''} />
                                {retrying ? 'Bezig...' : 'Probeer opnieuw'}
                            </button>
                            <Link
                                href="/kennisbank"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Terug naar overzicht
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/kennisbank" className="inline-flex items-center text-accent hover:text-accent-dark">
                        <FiArrowLeft className="mr-2" />
                        Terug naar kennisbank
                    </Link>
                </div>

                <article className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 md:p-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                {artikel.categorie.replace('-', ' ')}
                            </span>
                            {artikel.subcategorie && (
                                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                    {artikel.subcategorie}
                                </span>
                            )}
                            <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(artikel.moeilijkheidsgraad)}`}>
                                {artikel.moeilijkheidsgraad}
                            </span>
                            {artikel.populair && (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                    ⭐ Populair
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {artikel.titel}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
                            <div className="flex items-center">
                                <FiUser className="mr-2" />
                                <span>{artikel.auteur}</span>
                            </div>
                            {artikel.leestijd && (
                                <div className="flex items-center">
                                    <FiClock className="mr-2" />
                                    <span>{formatReadingTime(artikel.leestijd)}</span>
                                </div>
                            )}
                            <div className="flex items-center">
                                <FiEye className="mr-2" />
                                <span>{artikel.weergaven} weergaven</span>
                            </div>
                            {artikel.waardering && (
                                <div className="flex items-center">
                                    <div className="flex mr-2">
                                        {renderStars(artikel.waardering)}
                                    </div>
                                    <span>({artikel.waardering})</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Samenvatting */}
                        <div className="text-xl text-gray-700 mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-primary">
                            {artikel.samenvatting}
                        </div>

                        {/* Inhoud */}
                        <div
                            className="prose prose-lg max-w-none prose-headings:text-primary prose-links:text-accent prose-links:hover:text-accent-dark"
                            dangerouslySetInnerHTML={{
                                __html: richTextToHtml(artikel.inhoud)
                            }}
                        />

                        {/* Tags */}
                        {artikel.tags && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex items-center mb-3">
                                    <FiTag className="mr-2 text-gray-400" />
                                    <span className="font-medium text-gray-700">Tags:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {artikel.tags.split(',').map((tag, index) => (
                                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                            {tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bijlagen */}
                        {artikel.bijlagen && artikel.bijlagen.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="font-bold text-lg text-primary mb-4">Bijlagen</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {artikel.bijlagen.map((bijlage, index) => (
                                        <a
                                            key={index}
                                            href={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${bijlage.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <FiDownload className="mr-3 text-gray-400" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{bijlage.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {bijlage.ext.toUpperCase()} • {formatFileSize(bijlage.size)}
                                                </p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Metadata footer */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-500">
                                <div>
                                    <p><strong>Versie:</strong> {artikel.versie}</p>
                                    <p><strong>Laatst bijgewerkt:</strong> {formatDate(artikel.updatedAt)}</p>
                                    {artikel.reviewDatum && (
                                        <p><strong>Laatste review:</strong> {formatDate(artikel.reviewDatum)}</p>
                                    )}
                                </div>
                                <div>
                                    <p><strong>Toegankelijk voor:</strong> {artikel.toegankelijkVoor.replace('-', ' ')}</p>
                                    {artikel.geldigTot && (
                                        <p><strong>Geldig tot:</strong> {formatDate(artikel.geldigTot)}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Navigation */}
                <div className="mt-8 text-center">
                    <Link
                        href="/kennisbank"
                        className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                        <FiArrowLeft className="mr-2" />
                        Terug naar kennisbank
                    </Link>
                </div>
            </div>
        </main>
    )
}