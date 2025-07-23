// frontend/src/components/KalenderComponent.tsx
import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi'
import { kalenderAPI, type KalenderEvenement } from '@/lib/strapiApi'

export default function KalenderComponent() {
    const [huidigeMaand, setHuidigeMaand] = useState(new Date())
    const [evenementen, setEvenementen] = useState<KalenderEvenement[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    useEffect(() => {
        fetchEvenementen()
    }, [huidigeMaand])

    const fetchEvenementen = async () => {
        try {
            setLoading(true)
            setError(null)

            // Bereken start en eind van de maand
            const startVanMaand = new Date(huidigeMaand.getFullYear(), huidigeMaand.getMonth(), 1)
            const eindVanMaand = new Date(huidigeMaand.getFullYear(), huidigeMaand.getMonth() + 1, 0)

            const response = await kalenderAPI.getAll({
                startDatum: startVanMaand.toISOString(),
                eindDatum: eindVanMaand.toISOString()
            })

            setEvenementen(response.data)
        } catch (error) {
            console.error('Error fetching evenementen:', error)
            setError('Kon evenementen niet laden')
        } finally {
            setLoading(false)
        }
    }


    const gaNaarVorigeMaand = () => {
        setHuidigeMaand(new Date(huidigeMaand.getFullYear(), huidigeMaand.getMonth() - 1))
    }

    const gaNaarVolgendeMaand = () => {
        setHuidigeMaand(new Date(huidigeMaand.getFullYear(), huidigeMaand.getMonth() + 1))
    }

    const gaNaarVandaag = () => {
        setHuidigeMaand(new Date())
    }

    const genereerKalenderDagen = () => {
        const jaar = huidigeMaand.getFullYear()
        const maand = huidigeMaand.getMonth()

        const eersteDagVanMaand = new Date(jaar, maand, 1)
        const laatsteDagVanMaand = new Date(jaar, maand + 1, 0)

        const startDag = new Date(eersteDagVanMaand)
        const dagVanWeek = startDag.getDay()
        if (dagVanWeek !== 1) { // Als het geen maandag is
            startDag.setDate(startDag.getDate() - (dagVanWeek === 0 ? 6 : dagVanWeek - 1))
        }

        const eindDag = new Date(laatsteDagVanMaand)
        const eindDagVanWeek = eindDag.getDay()
        if (eindDagVanWeek !== 0) { // Als het geen zondag is
            eindDag.setDate(eindDag.getDate() + (7 - eindDagVanWeek))
        }

        const dagen: Date[] = []
        const huidigeDag = new Date(startDag)

        while (huidigeDag <= eindDag) {
            dagen.push(new Date(huidigeDag))
            huidigeDag.setDate(huidigeDag.getDate() + 1)
        }

        return dagen
    }

    const isHuidigeMaand = (datum: Date): boolean => {
        return datum.getMonth() === huidigeMaand.getMonth() &&
            datum.getFullYear() === huidigeMaand.getFullYear()
    }

    const isVandaag = (datum: Date): boolean => {
        const vandaag = new Date()
        return datum.getDate() === vandaag.getDate() &&
            datum.getMonth() === vandaag.getMonth() &&
            datum.getFullYear() === vandaag.getFullYear()
    }

    const getEvenementenVoorDag = (datum: Date): KalenderEvenement[] => {
        return evenementen.filter(evenement => {
            const evenementDatum = new Date(evenement.startDatum)
            return evenementDatum.getDate() === datum.getDate() &&
                evenementDatum.getMonth() === datum.getMonth() &&
                evenementDatum.getFullYear() === datum.getFullYear()
        })
    }

    const formatMaandJaar = (datum: Date): string => {
        return datum.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })
    }

    const formatDatum = (datum: Date): string => {
        return datum.toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const formatTijd = (datumString: string): string => {
        try {
            return new Date(datumString).toLocaleTimeString('nl-NL', {
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return '--:--'
        }
    }

    const getCategorieKleur = (categorie: string): string => {
        const kleuren = {
            'Meeting': 'bg-blue-100 text-blue-800',
            'Training': 'bg-green-100 text-green-800',
            'Event': 'bg-purple-100 text-purple-800',
            'Deadline': 'bg-red-100 text-red-800'
        }
        return kleuren[categorie as keyof typeof kleuren] || 'bg-gray-100 text-gray-800'
    }

    const dagen = genereerKalenderDagen()
    const dagNamen = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-primary text-white">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold capitalize">
                        {formatMaandJaar(huidigeMaand)}
                    </h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={gaNaarVandaag}
                            className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                            Vandaag
                        </button>
                        <button
                            onClick={gaNaarVorigeMaand}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <FiChevronLeft size={20} />
                        </button>
                        <button
                            onClick={gaNaarVolgendeMaand}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Kalender */}
            <div className="p-6">
                {/* Dag headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {dagNamen.map(dag => (
                        <div key={dag} className="text-center font-medium text-gray-500 py-2">
                            {dag}
                        </div>
                    ))}
                </div>

                {/* Kalender grid */}
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-gray-600">Laden...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <FiCalendar className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={fetchEvenementen}
                            className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                        >
                            Probeer opnieuw
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-7 gap-2">
                        {dagen.map((dag, index) => {
                            const dagEvenementen = getEvenementenVoorDag(dag)
                            const isHuidigeMaandDag = isHuidigeMaand(dag)
                            const isVandagDag = isVandaag(dag)

                            return (
                                <div
                                    key={index}
                                    className={`
                                        min-h-[100px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
                                        ${!isHuidigeMaandDag ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                                        ${isVandagDag ? 'bg-blue-50 border-blue-300' : ''}
                                        ${selectedDate?.getTime() === dag.getTime() ? 'ring-2 ring-primary' : ''}
                                    `}
                                    onClick={() => setSelectedDate(dag)}
                                >
                                    <div className={`
                                        text-right mb-2 font-medium
                                        ${isVandagDag ? 'text-blue-600' : isHuidigeMaandDag ? 'text-gray-900' : 'text-gray-400'}
                                    `}>
                                        {dag.getDate()}
                                    </div>

                                    <div className="space-y-1">
                                        {dagEvenementen.slice(0, 2).map(evenement => (
                                            <div
                                                key={evenement.id}
                                                className={`text-xs px-2 py-1 rounded truncate ${getCategorieKleur(evenement.categorie)}`}
                                                title={`${evenement.titel} (${formatTijd(evenement.startDatum)})`}
                                            >
                                                {evenement.titel}
                                            </div>
                                        ))}
                                        {dagEvenementen.length > 2 && (
                                            <div className="text-xs text-gray-500 px-2">
                                                +{dagEvenementen.length - 2} meer
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Selected date details */}
                {selectedDate && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-bold text-lg mb-3">
                            {formatDatum(selectedDate)}
                        </h3>
                        {getEvenementenVoorDag(selectedDate).length > 0 ? (
                            <div className="space-y-3">
                                {getEvenementenVoorDag(selectedDate).map(evenement => (
                                    <div key={evenement.id} className="bg-white p-3 rounded-lg border">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium mb-1">{evenement.titel}</h4>
                                                <div className="text-sm text-gray-600">
                                                    <span>{formatTijd(evenement.startDatum)} - {formatTijd(evenement.eindDatum)}</span>
                                                    {evenement.locatie && (
                                                        <span className="ml-2">📍 {evenement.locatie}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getCategorieKleur(evenement.categorie)}`}>
                                                {evenement.categorie}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Geen evenementen op deze dag</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}