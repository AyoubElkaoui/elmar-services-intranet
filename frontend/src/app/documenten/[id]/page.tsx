// frontend/src/app/documenten/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiDownload, FiEye, FiUser, FiClock, FiFolder, FiAlertCircle } from 'react-icons/fi'
import { bestandenAPI, fileHelpers, APIError, type BestandItem } from '@/lib/strapiApi'

export default function DocumentDetailPagina() {
    const params = useParams()
    const [bestand, setBestand] = useState<BestandItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBestand = async () => {
            try {
                console.log('Fetching bestand with ID:', params.id)
                const response = await bestandenAPI.getById(Number(params.id))
                console.log('Bestand response:', response)
                setBestand(response.data)
            } catch (error) {
                console.error('Error fetching bestand:', error)
                if (error instanceof APIError) {
                    setError(error.status === 404 ? 'Bestand niet gevonden' : error.message)
                } else {
                    setError('Fout bij laden van bestand')
                }
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchBestand()
        }
    }, [params.id])

    const handleView = () => {
        if (bestand?.bestand && bestand.bekijkbaar) {
            fileHelpers.viewFile(bestand.bestand)
        }
    }

    const handleDownload = () => {
        if (bestand?.bestand && bestand.downloadbaar) {
            fileHelpers.downloadFile(bestand.bestand, bestand.titel)
        }
    }

    const formatDatum = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/documenten" className="inline-flex items-center text-accent hover:text-accent-dark mb-6">
                        <FiArrowLeft className="mr-2" />
                        Terug naar documenten
                    </Link>
                    <div className="animate-pulse bg-white rounded-lg shadow-md p-8">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-16 bg-gray-200 rounded mb-6"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (error || !bestand) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/documenten" className="inline-flex items-center text-accent hover:text-accent-dark mb-6">
                        <FiArrowLeft className="mr-2" />
                        Terug naar documenten
                    </Link>
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {error || 'Bestand niet gevonden'}
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Het bestand met ID {params.id} kon niet worden gevonden.
                        </p>
                        <Link
                            href="/documenten"
                            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                        >
                            <FiArrowLeft className="mr-2" />
                            Terug naar documenten
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    const fileInfo = fileHelpers.getFileInfo(bestand.bestand)

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/documenten" className="inline-flex items-center text-accent hover:text-accent-dark mb-6">
                    <FiArrowLeft className="mr-2" />
                    Terug naar documenten
                </Link>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 md:p-8">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center flex-1 min-w-0">
                                <div className="text-6xl mr-4">
                                    {fileInfo?.icon || '📎'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                        {bestand.titel}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
                                        <span className="bg-white/20 px-3 py-1 rounded-full">
                                            {fileInfo?.ext.toUpperCase() || 'FILE'}
                                        </span>
                                        <span className="bg-white/20 px-3 py-1 rounded-full">
                                            {fileInfo?.size || 'Onbekend'}
                                        </span>
                                        <span className="bg-white/20 px-3 py-1 rounded-full">
                                            Versie {bestand.versie}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 ml-4">
                                {bestand.bekijkbaar && fileInfo?.viewable && (
                                    <button
                                        onClick={handleView}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                    >
                                        <FiEye size={18} />
                                        <span className="hidden sm:inline">Bekijken</span>
                                    </button>
                                )}
                                {bestand.downloadbaar && (
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                    >
                                        <FiDownload size={18} />
                                        <span className="hidden sm:inline">Download</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        {/* Beschrijving */}
                        {bestand.beschrijving && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-3">Beschrijving</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {bestand.beschrijving}
                                </p>
                            </div>
                        )}

                        {/* Metadata grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-primary">Bestandsinformatie</h3>

                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <FiFolder className="mr-3 text-gray-400" />
                                        <div>
                                            <span className="text-sm text-gray-500">Categorie</span>
                                            <p className="font-medium capitalize">
                                                {bestand.Categorie?.replace('-', ' ') || 'Algemeen'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <FiUser className="mr-3 text-gray-400" />
                                        <div>
                                            <span className="text-sm text-gray-500">Afdeling</span>
                                            <p className="font-medium">{bestand.afdeling || 'Alle'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-primary">Details</h3>

                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <FiUser className="mr-3 text-gray-400" />
                                        <div>
                                            <span className="text-sm text-gray-500">Auteur</span>
                                            <p className="font-medium">{bestand.auteur}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <FiClock className="mr-3 text-gray-400" />
                                        <div>
                                            <span className="text-sm text-gray-500">Laatst bijgewerkt</span>
                                            <p className="font-medium">{formatDatum(bestand.updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/documenten"
                                className="flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                            >
                                <FiArrowLeft className="mr-2" />
                                Terug naar overzicht
                            </Link>

                            <div className="flex gap-3">
                                {bestand.bekijkbaar && fileInfo?.viewable && (
                                    <button
                                        onClick={handleView}
                                        className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        <FiEye className="mr-2" />
                                        Bekijk bestand
                                    </button>
                                )}

                                {bestand.downloadbaar && (
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        <FiDownload className="mr-2" />
                                        Download
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}