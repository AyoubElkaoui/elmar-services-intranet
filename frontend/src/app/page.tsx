'use client'

import { useState, useEffect } from 'react'
import WelkomstBanner from '@/components/WelkomstBanner'
import SnelleToolLinksSectie from '@/components/SnelleToolLinksSectie'
import NieuwsSectie from '@/components/NieuwsSectie'
import KalenderSectie from '@/components/KalenderSectie'
import DagagendaSectie from '@/components/DagagendaSectie'
import VerjaardagenJubileaSectie from '@/components/VerjaardagenJubileaSectie'
import VergaderzaalSectie from '@/components/VergaderzaalSectie'

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
      <main className="min-h-screen bg-gray-50">
        {/* Welkomst Banner */}
        <WelkomstBanner currentTime={currentTime} />

        {/* Snelle Links */}
        <SnelleToolLinksSectie />

        {/* Main Content Grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Linker kolom - Hoofdcontent */}
            <div className="lg:col-span-2 space-y-8">
              <NieuwsSectie />
              <KalenderSectie />
              <DagagendaSectie />
            </div>

            {/* Rechter kolom - Sidebar */}
            <div className="space-y-8">
              <VerjaardagenJubileaSectie />
              <VergaderzaalSectie />
            </div>
          </div>
        </div>
      </main>
  )
}