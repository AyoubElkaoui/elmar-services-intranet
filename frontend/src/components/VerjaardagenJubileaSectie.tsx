'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiGift, FiAward, FiUser, FiCalendar } from 'react-icons/fi'

interface Medewerker {
    id: number
    documentId: string
    voornaam: string
    achternaam: string
    email: string
    functie: string
    afdeling: string
    geboortedatum: string
    startdatum: string
    profielfoto?: {
        id: number
        url: string
        name: string
        alternativeText?: string
    }
    actief: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
}

interface VerjaardagJubileumItem {
    type: 'verjaardag' | 'jubileum'
    medewerker: Medewerker
    datum: string
    leeftijd?: number
    aantalJaren?: number
}

export default function VerjaardagenJubileaSectie() {
    const [items, setItems] = useState<VerjaardagJubileumItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchVerjaardagenEnJubilea()
    }, [])

    const fetchVerjaardagenEnJubilea = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/medewerkers?populate=*&filters[actief][$eq]=true`
            )

            if (!response.ok) {
                throw new Error('Fout bij laden van medewerkers')
            }

            const data = await response.json()
            console.log('👥 Medewerkers received:', data)

            if (data.data) {
                const verjaardagenJubilea = processVerjaardagenEnJubilea(data.data)
                setItems(verjaardagenJubilea)
            }
        } catch (error) {
            console.error('❌ Error fetching medewerkers:', error)
            setError('Kon medewerkers niet laden. Controleer of het "medewerkers" content type bestaat.')

            // Fallback data
            setItems(generateFallbackData())
        } finally {
            setLoading(false)
        }
    }

    const processVerjaardagenEnJubilea = (medewerkers: Medewerker[]): VerjaardagJubileumItem[] => {
        const items: VerjaardagJubileumItem[] = []
        const vandaag = new Date()
        const huidigeJaar = vandaag.getFullYear()
        const huidigeMaand = vandaag.getMonth()

        medewerkers.forEach(medewerker => {
            // Verjaardagen
            if (medewerker.geboortedatum) {
                const geboorteDatum = new Date(medewerker.geboortedatum)
                const verjaardagDitJaar = new Date(huidigeJaar, geboorteDatum.getMonth(), geboorteDatum.getDate())

                // Check of verjaardag deze maand is
                if (geboorteDatum.getMonth() === huidigeMaand) {
                    const leeftijd = huidigeJaar - geboorteDatum.getFullYear()
                    if (verjaardagDitJaar >= vandaag || isVandaag(verjaardagDitJaar)) {
                        items.push({
                            type: 'verjaardag',
                            medewerker,
                            datum: verjaardagDitJaar.toISOString(),
                            leeftijd
                        })
                    }
                }
            }

            // Jubilea (jaren in dienst)
            if (medewerker.startdatum) {
                const startDatum = new Date(medewerker.startdatum)
                const jubileumDitJaar = new Date(huidigeJaar, startDatum.getMonth(), startDatum.getDate())

                // Check of jubileum deze maand is
                if (startDatum.getMonth() === huidigeMaand) {
                    const aantalJaren = huidigeJaar - startDatum.getFullYear()
                    // Alleen jubilea van 5+ jaar tonen
                    if (aantalJaren >= 5 && (jubileumDitJaar >= vandaag || isVandaag(jubileumDitJaar))) {
                        items.push({
                            type: 'jubileum',
                            medewerker,
                            datum: jubileumDitJaar.toISOString(),
                            aantalJaren
                        })
                    }
                }
            }
        })

        // Sorteer op datum
        return items.sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())
    }

    const generateFallbackData = (): VerjaardagJubileumItem[] => {
        const vandaag = new Date()
        const items: VerjaardagJubileumItem[] = []

        // Genereer enkele voorbeelden voor deze maand
        const voorbeeldMedewerkers = [
            {
                id: 1,
                voornaam: 'Jan',
                achternaam: 'Janssen',
                functie: 'Developer',
                afdeling: 'IT',
                geboortedatum: new Date(1985, vandaag.getMonth(), 15).toISOString(),
                startdatum: new Date(2015, vandaag.getMonth(), 20).toISOString()
            },
            {
                id: 2,
                voornaam: 'Sarah',
                achternaam: 'de Vries',
                functie: 'Marketing Manager',
                afdeling: 'Marketing',
                geboortedatum: new Date(1990, vandaag.getMonth(), vandaag.getDate() + 3).toISOString(),
                startdatum: new Date(2018, vandaag.getMonth(), 10).toISOString()
            },
            {
                id: 3,
                voornaam: 'Peter',
                achternaam: 'Bakker',
                functie: 'HR Manager',
                afdeling: 'HR',
                geboortedatum: new Date(1982, vandaag.getMonth(), 25).toISOString(),
                startdatum: new Date(2013, vandaag.getMonth(), 15).toISOString()
            }
        ]

        voorbeeldMedewerkers.forEach(medewerker => {
            const geboorteDatum = new Date(medewerker.geboortedatum)
            const startDatum = new Date(medewerker.startdatum)
            const huidigeJaar = vandaag.getFullYear()

            // Verjaardag
            if (geboorteDatum.getMonth() === vandaag.getMonth()) {
                items.push({
                    type: 'verjaardag',
                    medewerker: medewerker as any,
                    datum: new Date(huidigeJaar, geboorteDatum.getMonth(), geboorteDatum.getDate()).toISOString(),
                    leeftijd: huidigeJaar - geboorteDatum.getFullYear()
                })
            }

            // Jubileum
            if (startDatum.getMonth() === vandaag.getMonth()) {
                const aantalJaren = huidigeJaar - startDatum.getFullYear()
                if (aantalJaren >= 5) {
                    items.push({
                        type: 'jubileum',
                        medewerker: medewerker as any,
                        datum: new Date(huidigeJaar, startDatum.getMonth(), startDatum.getDate()).toISOString(),
                        aantalJaren
                    })
                }
            }
        })

        return items.sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())
    }

    const isVandaag = (datum: Date): boolean => {
        const vandaag = new Date()
        return datum.getDate() === vandaag.getDate() &&
            datum.getMonth() === vandaag.getMonth() &&
            datum.getFullYear() === vandaag.getFullYear()
    }

    const isDezeWeek = (datum: Date): boolean => {
        const vandaag = new Date()
        const startVanWeek = new Date(vandaag)
        const dag = vandaag.getDay()
        const verschil = dag === 0 ? 6 : dag - 1
        startVanWeek.setDate(vandaag.getDate() - verschil)
        startVanWeek.setHours(0, 0, 0, 0)

        const eindVanWeek = new Date(startVanWeek)
        eindVanWeek.setDate(startVanWeek.getDate() + 6)
        eindVanWeek.setHours(23, 59, 59, 999)

        return datum >= startVanWeek && datum <= eindVanWeek
    }

    const formatDatum = (datumString: string): string => {
        try {
            const datum = new Date(datumString)
            if (isVandaag(datum)) return 'Vandaag'

            const morgen = new Date()
            morgen.setDate(morgen.getDate() + 1)
            if (datum.getDate() === morgen.getDate() &&
                datum.getMonth() === morgen.getMonth() &&
                datum.getFullYear() === morgen.getFullYear()) {
                return 'Morgen'
            }

            if (isDezeWeek(datum)) {
                return datum.toLocaleDateString('nl-NL', { weekday: 'long' })
            }

            return datum.toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long'
            })
        } catch {
            return 'Onbekende datum'
        }
    }

    const getImageUrl = (profielfoto?: Medewerker['profielfoto']): string => {
        if (profielfoto?.url) {
            if (profielfoto.url.startsWith('http')) {
                return profielfoto.url
            }
            return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${profielfoto.url}`
        }
        return '/images/placeholder.svg'
    }

    const getInitials = (voornaam: string, achternaam: string): string => {
        return `${voornaam.charAt(0)}${achternaam.charAt(0)}`.toUpperCase()
    }

    const getBadgeColor = (type: 'verjaardag' | 'jubileum'): string => {
        return type === 'verjaardag'
            ? 'bg-blue-100 border-blue-200 text-blue-800'
            : 'bg-amber-100 border-amber-200 text-amber-800'
    }

    const getEventLabel = (item: VerjaardagJubileumItem): string => {
        const datum = new Date(item.datum)
        if (isVandaag(datum)) {
            return item.type === 'verjaardag'
                ? `Wordt ${item.leeftijd} jaar! 🎉`
                : `${item.aantalJaren} jaar in dienst! 🎉`
        }

        return item.type === 'verjaardag'
            ? `Wordt ${item.leeftijd} jaar`
            : `${item.aantalJaren} jaar in dienst`
    }

    // Filter en sorteer items
    const vandaagItems = items.filter(item => isVandaag(new Date(item.datum)))
    const dezeWeekItems = items.filter(item => {
        const datum = new Date(item.datum)
        return isDezeWeek(datum) && !isVandaag(datum)
    })
    const dezeMaandItems = items.filter(item => {
        const datum = new Date(item.datum)
        return !isDezeWeek(datum) && !isVandaag(datum)
    })

    const teTonenItems = [
        ...vandaagItems,
        ...dezeWeekItems,
        ...dezeMaandItems
    ].slice(0, 4)

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-primary mb-4">Verjaardagen & Jubilea</h2>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-primary flex items-center">
                    <FiGift className="mr-2" />
                    Verjaardagen & Jubilea
                </h2>
                <Link href="/verjaardagen" className="text-accent hover:underline text-sm">
                    Bekijk alle
                </Link>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                        ⚠️ Voorbeelddata wordt getoond. {error}
                    </p>
                </div>
            )}

            <div className="space-y-4">
                {teTonenItems.length > 0 ? (
                    teTonenItems.map((item, index) => (
                        <div
                            key={`${item.medewerker.id}-${item.type}-${index}`}
                            className={`p-4 rounded-lg border-2 ${getBadgeColor(item.type)} relative overflow-hidden`}
                        >
                            <div className="flex items-center">
                                <div className="relative w-12 h-12 mr-4 flex-shrink-0">
                                    {item.medewerker.profielfoto ? (
                                        <Image
                                            src={getImageUrl(item.medewerker.profielfoto)}
                                            alt={`${item.medewerker.voornaam} ${item.medewerker.achternaam}`}
                                            fill
                                            className="object-cover rounded-full"
                                            sizes="48px"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                            <span className="text-gray-600 font-medium text-sm">
                                                {getInitials(item.medewerker.voornaam, item.medewerker.achternaam)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Type indicator */}
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-current">
                                        {item.type === 'verjaardag' ? (
                                            <FiGift size={12} className="text-blue-600" />
                                        ) : (
                                            <FiAward size={12} className="text-amber-600" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900">
                                        {item.medewerker.voornaam} {item.medewerker.achternaam}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {item.medewerker.functie}, {item.medewerker.afdeling}
                                    </p>
                                    <p className="text-sm font-medium mt-1">
                                        {getEventLabel(item)}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <FiCalendar className="mr-1" size={14} />
                                        <span>{formatDatum(item.datum)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <FiGift className="mx-auto mb-3" size={32} />
                        <p className="font-medium">Geen verjaardagen of jubilea deze maand</p>
                        <p className="text-sm mt-1">
                            Voeg medewerkers toe in Strapi om verjaardagen en jubilea te bekijken
                        </p>
                        <a
                            href="http://localhost:1337/admin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
                        >
                            Open Strapi Admin
                        </a>
                    </div>
                )}
            </div>

            {teTonenItems.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                        href="/verjaardagen"
                        className="block w-full text-center py-2 text-accent hover:text-accent-dark font-medium text-sm"
                    >
                        Bekijk alle verjaardagen en jubilea →
                    </Link>
                </div>
            )}
        </div>
    )
}