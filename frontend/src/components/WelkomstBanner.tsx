'use client'

import { useState, useEffect } from 'react'
import { FiSun, FiMoon, FiClock } from 'react-icons/fi'

interface WelkomstBannerProps {
    currentTime: Date
}

export default function WelkomstBanner({ currentTime }: WelkomstBannerProps) {
    const [gebruiker, setGebruiker] = useState('Medewerker')

    useEffect(() => {
        // Hier zou je de gebruiker kunnen ophalen uit je auth systeem
        // Voor nu gebruiken we een placeholder
        setGebruiker('Medewerker')
    }, [])

    const getBegroeting = (tijd: Date) => {
        const uur = tijd.getHours()
        if (uur < 12) return 'Goedemorgen'
        if (uur < 18) return 'Goedemiddag'
        return 'Goedenavond'
    }

    const getBegroetingIcon = (tijd: Date) => {
        const uur = tijd.getHours()
        if (uur >= 6 && uur < 18) {
            return <FiSun className="text-yellow-500" size={24} />
        }
        return <FiMoon className="text-blue-400" size={24} />
    }

    const formatDatum = (datum: Date) => {
        return datum.toLocaleDateString('nl-NL', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const formatTijd = (tijd: Date) => {
        return tijd.toLocaleTimeString('nl-NL', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {getBegroetingIcon(currentTime)}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            {getBegroeting(currentTime)}, {gebruiker}!
                        </h1>
                        <p className="text-blue-100 mt-1">
                            Welkom terug bij het Elmar Services intranet
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="flex items-center text-lg font-semibold mb-1">
                        <FiClock className="mr-2" />
                        {formatTijd(currentTime)}
                    </div>
                    <p className="text-sm text-blue-100 capitalize">
                        {formatDatum(currentTime)}
                    </p>
                </div>
            </div>

            <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-blue-100">
                    💡 <strong>Tip van de dag:</strong> Vergeet niet je verlofaanvragen in te dienen voor de feestdagen.
                    Ga naar Personeelszaken → Verlofaanvraag om je aanvraag te starten.
                </p>
            </div>
        </div>
    )
}