// frontend/src/app/nieuws/[id]/page.tsx - WERKENDE DETAIL PAGINA
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FiArrowLeft, FiCalendar, FiUser, FiTag } from 'react-icons/fi'

interface NieuwsDetail {
    id: number
    attributes: {
        titel: string
        samenvatting: string
        inhoud: string
        createdAt: string
        categorie: string
        auteur: string
        afbeelding?: {
            data?: {
                attributes: {
                    url: string
                }
            }
        }
    }
}

export default function NieuwsDetailPagina() {
    const params = useParams()
    const [nieuws, setNieuws] = useState<NieuwsDetail | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNieuwsDetail = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/nieuws-items/${params.id}?populate=*`)

                if (response.ok) {
                    const data = await response.json()
                    setNieuws(data.data)
                }
            } catch (error) {
                console.error('Error fetching nieuws detail:', error)
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchNieuwsDetail()
        }
    }, [params.id])

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
        if (!nieuws?.attributes.afbeelding?.data?.attributes?.url) return '/images/placeholder.svg'
        return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${nieuws.attributes.afbeelding.data.attributes.url}`
    }

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </main>
        )
    }

    if (!nieuws) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel niet gevonden</h1>
                    <Link href="/nieuws" className="btn-primary">
                        Terug naar nieuws
                    </Link>
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
                            alt={nieuws.attributes.titel}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="p-6 md:p-10">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                            <div className="flex items-center">
                                <FiCalendar className="mr-2" />
                                <span>{formatDatum(nieuws.attributes.createdAt)}</span>
                            </div>
                            <div className="flex items-center">
                                <FiUser className="mr-2" />
                                <span>{nieuws.attributes.auteur}</span>
                            </div>
                            <div className="flex items-center">
                                <FiTag className="mr-2" />
                                <span className="capitalize">{nieuws.attributes.categorie}</span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                            {nieuws.attributes.titel}
                        </h1>

                        <div className="text-xl text-gray-700 mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-accent">
                            {nieuws.attributes.samenvatting}
                        </div>

                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: nieuws.attributes.inhoud }}
                        />
                    </div>
                </article>
            </div>
        </main>
    )
}