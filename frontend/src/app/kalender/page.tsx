// frontend/src/app/kalender/page.tsx - WERKENDE KALENDER PAGINA
'use client'

import { useState, useEffect } from 'react'
import { FiCalendar, FiClock, FiMapPin, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface Evenement {
    id: number
    attributes: {
        titel: string
        beschrijving?: string
        startDatum: string
        eindDatum: string
        locatie?: string
        type: string
    }
}

export default function KalenderPagina() {
    const [evenementen, setEvenementen] = useState<Evenement[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState(new Date())

    const fetchEvenementen = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/evenementen?populate=*&sort=startDatum:asc`)

            if (response.ok) {
                const data = await response.json()
                setEvenementen(data.data || [])
            }
        } catch (error) {
            console.error('Error fetching evenementen:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvenementen()
    }, [])

    const formatDatum = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('nl-NL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            })
        } catch {
            return 'Onbekende datum'
        }
    }

    const formatTijd = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleTimeString('nl-NL', {
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return '--:--'
        }
    }

    const getEventTypeColor = (type: string) => {
        const colors = {
            vergadering: 'bg-blue-100 text-blue-800',
            verjaardag: 'bg-pink-100 text-pink-800',
            presentatie: 'bg-purple-100 text-purple-800',
            sociaal: 'bg-green-100 text-green-800'
        }
        return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
        setSelectedDate(prevDate => {
            const newDate = new Date(prevDate)
            newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
            return newDate
        })
    }

    const getMonthTitle = () => {
        return selectedDate.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-4">Kalender</h1>
                <p className="text-gray-600 text-lg">
                    Overzicht van alle evenementen en belangrijke data.
                </p>
            </div>

            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigateMonth('prev')}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                        >
                            <FiChevronLeft />
                        </button>
                        <h2 className="text-xl font-bold text-primary">
                            {getMonthTitle()}
                        </h2>
                        <button
                            onClick={() => navigateMonth('next')}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                        >
                            <FiChevronRight />
                        </button>
                    </div>

                    <button
                        onClick={() => setSelectedDate(new Date())}
                        className="px-4 py-2 text-accent hover:text-accent-dark font-medium"
                    >
                        Vandaag
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {evenementen.map(event => (
                        <div key={event.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-primary">{event.attributes.titel}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.attributes.type)}`}>
                  {event.attributes.type}
                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-gray-600">
                                    <FiCalendar className="mr-2" />
                                    <span>{formatDatum(event.attributes.startDatum)}</span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <FiClock className="mr-2" />
                                    <span>
                    {formatTijd(event.attributes.startDatum)} - {formatTijd(event.attributes.eindDatum)}
                  </span>
                                </div>

                                {event.attributes.locatie && (
                                    <div className="flex items-center text-gray-600">
                                        <FiMapPin className="mr-2" />
                                        <span>{event.attributes.locatie}</span>
                                    </div>
                                )}
                            </div>

                            {event.attributes.beschrijving && (
                                <p className="text-gray-600 text-sm">{event.attributes.beschrijving}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {evenementen.length === 0 && !loading && (
                <div className="text-center py-12">
                    <FiCalendar className="mx-auto text-6xl text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">Geen evenementen gevonden</p>
                </div>
            )}
        </main>
    )
}