'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiDownload, FiEye, FiUser, FiClock, FiFolder, FiTag, FiAlertCircle, FiFileText, FiMaximize2 } from 'react-icons/fi'
import { bestandenAPI, fileHelpers, type Bestand } from '@/lib/strapiApi'

export default function DocumentDetailPagina() {
    const params = useParams()
    const router = useRouter()
    const [document, setDocument] = useState<Bestand | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [viewerMode, setViewerMode] = useState<'preview' | 'fullscreen' | null>(null)

    useEffect(() => {
        const loadDocument = async () => {
            try {
                setLoading(true)
                setError(null)

                const id = params.id as string
                console.log('🔍 Loading document with documentId:', id)

                // Haal alle documenten op en zoek op documentId
                const allDocs = await bestandenAPI.getAll()
                const foundDoc = allDocs.data.find(doc => doc.documentId === id)

                if (foundDoc) {
                    console.log('✅ Found document:', foundDoc)
                    setDocument(foundDoc)
                } else {
                    setError(`Document met ID "${id}" kon niet worden gevonden.`)
                }

            } catch (err: any) {
                console.error('❌ Error loading document:', err)
                setError('Er is een fout opgetreden bij het laden van het document.')
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            loadDocument()
        }
    }, [params.id])

    const getFileViewerUrl = (fileUrl: string, fileType: string) => {
        const encodedUrl = encodeURIComponent(fileUrl)

        switch (fileType) {
            case '.pdf':
                return fileUrl // PDF kan direct in browser
            case '.docx':
            case '.doc':
                return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`
            case '.xlsx':
            case '.xls':
                return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`
            case '.pptx':
            case '.ppt':
                return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`
            default:
                return null
        }
    }

    const canPreview = (fileExt?: string) => {
        if (!fileExt) return false
        const supportedTypes = ['.pdf', '.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt']
        return supportedTypes.includes(fileExt.toLowerCase())
    }

    const handleView = () => {
        if (document && document.bestand) {
            const fileUrl = fileHelpers.getFileUrl(document.bestand)
            if (fileUrl) {
                if (canPreview(document.bestand.ext)) {
                    setViewerMode('preview')
                } else {
                    window.open(fileUrl, '_blank')
                }
            }
        }
    }

    const handleFullscreen = () => {
        if (document && document.bestand) {
            const fileUrl = fileHelpers.getFileUrl(document.bestand)
            if (fileUrl) {
                const viewerUrl = getFileViewerUrl(fileUrl, document.bestand.ext || '')
                if (viewerUrl) {
                    window.open(viewerUrl, '_blank')
                } else {
                    window.open(fileUrl, '_blank')
                }
            }
        }
    }

    const handleDownload = () => {
        if (document && document.bestand) {
            const fileUrl = fileHelpers.getFileUrl(document.bestand)
            if (fileUrl) {
                const link = window.document.createElement('a')
                link.href = fileUrl
                link.download = document.bestand.name
                window.document.body.appendChild(link)
                link.click()
                window.document.body.removeChild(link)
            }
        }
    }

    const formatDatum = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return 'Onbekend'
        }
    }

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link href="/documenten" className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors">
                        <FiArrowLeft className="mr-2" />
                        Terug naar documenten
                    </Link>
                </div>

                <div className="animate-pulse">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (error || !document) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link href="/documenten" className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors">
                        <FiArrowLeft className="mr-2" />
                        Terug naar documenten
                    </Link>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                    <div className="flex items-center">
                        <FiAlertCircle className="text-red-600 mr-4" size={32} />
                        <div>
                            <h1 className="text-2xl font-bold text-red-900 mb-2">Bestand niet gevonden</h1>
                            <p className="text-red-700 mb-4">
                                {error || `Het bestand met ID ${params.id} kon niet worden gevonden.`}
                            </p>
                            <Link
                                href="/documenten"
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Terug naar documenten
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    const fileUrl = document.bestand ? fileHelpers.getFileUrl(document.bestand) : null
    const viewerUrl = fileUrl && document.bestand ? getFileViewerUrl(fileUrl, document.bestand.ext || '') : null

    return (
        <main className="container mx-auto px-4 py-8">
            {/* Header met navigation */}
            <div className="mb-8">
                <Link href="/documenten" className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors">
                    <FiArrowLeft className="mr-2" />
                    Terug naar documenten
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        {/* Document Header */}
                        <div className="flex items-start space-x-6 mb-8">
                            <div className="text-6xl flex-shrink-0">
                                {fileHelpers.getFileIcon(document.bestand?.ext)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {document.titel}
                                </h1>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                                        {document.bestand?.ext?.replace('.', '').toUpperCase() || 'DOCUMENT'}
                                    </span>
                                    <span>{fileHelpers.formatFileSize(document.bestand?.size)}</span>
                                    {document.versie && (
                                        <span>Versie {document.versie}</span>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 flex-wrap">
                                    {document.bekijkbaar !== false && (
                                        <button
                                            onClick={handleView}
                                            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <FiEye className="mr-2" />
                                            {canPreview(document.bestand?.ext) ? 'Voorvertoning' : 'Bekijk bestand'}
                                        </button>
                                    )}

                                    {canPreview(document.bestand?.ext) && (
                                        <button
                                            onClick={handleFullscreen}
                                            className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                        >
                                            <FiMaximize2 className="mr-2" />
                                            Volledig scherm
                                        </button>
                                    )}

                                    {document.downloadbaar !== false && (
                                        <button
                                            onClick={handleDownload}
                                            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <FiDownload className="mr-2" />
                                            Download
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* File Preview */}
                        {viewerMode === 'preview' && viewerUrl && canPreview(document.bestand?.ext) && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Voorvertoning</h2>
                                    <button
                                        onClick={() => setViewerMode(null)}
                                        className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded"
                                    >
                                        Sluiten ✕
                                    </button>
                                </div>
                                <div className="border rounded-lg overflow-hidden" style={{ height: '600px' }}>
                                    {document.bestand?.ext === '.pdf' ? (
                                        <iframe
                                            src={viewerUrl}
                                            className="w-full h-full"
                                            title={`Voorvertoning: ${document.titel}`}
                                        />
                                    ) : (
                                        <iframe
                                            src={viewerUrl}
                                            className="w-full h-full"
                                            title={`Voorvertoning: ${document.titel}`}
                                            sandbox="allow-scripts allow-same-origin"
                                        />
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    💡 Tip: Klik op "Volledig scherm" voor een betere weergave
                                </p>
                            </div>
                        )}

                        {/* Beschrijving */}
                        {document.beschrijving && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <FiFileText className="mr-2" />
                                    Beschrijving
                                </h2>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed">
                                        {document.beschrijving}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {document.tags && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <FiTag className="mr-2" />
                                    Tags
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {document.tags.split(',').map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* File Type Info */}
                        {canPreview(document.bestand?.ext) && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-blue-800 text-sm">
                                    <strong>📄 Online preview beschikbaar!</strong><br/>
                                    Dit bestand kan direct in de browser bekeken worden zonder te downloaden.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Document Info */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Document informatie</h2>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <FiFolder className="text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">Categorie</p>
                                    <p className="font-medium capitalize">
                                        {document.Categorie.replace('-', ' ')}
                                    </p>
                                </div>
                            </div>

                            {document.afdeling && (
                                <div className="flex items-center">
                                    <FiUser className="text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Afdeling</p>
                                        <p className="font-medium">{document.afdeling}</p>
                                    </div>
                                </div>
                            )}

                            {document.auteur && (
                                <div className="flex items-center">
                                    <FiUser className="text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Auteur</p>
                                        <p className="font-medium">{document.auteur}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center">
                                <FiClock className="text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">Laatst bijgewerkt</p>
                                    <p className="font-medium">{formatDatum(document.updatedAt)}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <FiClock className="text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">Aangemaakt</p>
                                    <p className="font-medium">{formatDatum(document.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bestand Details */}
                    {document.bestand && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Bestand details</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Bestandsnaam</p>
                                    <p className="font-medium text-sm break-all">{document.bestand.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Type</p>
                                    <p className="font-medium">{document.bestand.mime}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Grootte</p>
                                    <p className="font-medium">{fileHelpers.formatFileSize(document.bestand.size)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Preview ondersteuning</p>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        canPreview(document.bestand.ext)
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {canPreview(document.bestand.ext) ? '✅ Ja' : '❌ Nee'}
                                    </span>
                                </div>
                                {document.bestand.alternativeText && (
                                    <div>
                                        <p className="text-sm text-gray-600">Alt tekst</p>
                                        <p className="font-medium text-sm">{document.bestand.alternativeText}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Permissies */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Permissies</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Bekijkbaar</span>
                                <span className={`text-sm font-medium ${
                                    document.bekijkbaar !== false ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {document.bekijkbaar !== false ? 'Ja' : 'Nee'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Downloadbaar</span>
                                <span className={`text-sm font-medium ${
                                    document.downloadbaar !== false ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {document.downloadbaar !== false ? 'Ja' : 'Nee'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Supported File Types Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">📄 Preview ondersteuning</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>✅ PDF documenten</p>
                            <p>✅ Word (.docx, .doc)</p>
                            <p>✅ Excel (.xlsx, .xls)</p>
                            <p>✅ PowerPoint (.pptx, .ppt)</p>
                            <p className="text-xs mt-2 text-gray-500">
                                Andere bestanden kunnen gedownload worden
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}