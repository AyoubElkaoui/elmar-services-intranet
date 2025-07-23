'use client'

import React from 'react'
import WelkomstBanner from '@/components/WelkomstBanner'
import NieuwsSectie from '@/components/NieuwsSectie'
import KalenderSectie from '@/components/KalenderSectie'
import DagagendaSectie from '@/components/DagagendaSectie'
import WeerSectie from '@/components/WeerSectie'
import SnelkoppelingenGrid from '@/components/SnelkoppelingenGrid'
import VerjaardagenJubileaSectie from '@/components/VerjaardagenJubileaSectie'
import SnelleToolLinksSectie from '@/components/SnelleToolLinksSectie'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header Banner */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <WelkomstBanner />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content - 8 columns */}
                    <div className="lg:col-span-8">
                        <div className="space-y-8">
                            {/* Top Row - Nieuws & Kalender */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <NieuwsSectie />
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <KalenderSectie />
                                </div>
                            </div>

                            {/* Snelkoppelingen */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <SnelkoppelingenGrid />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - 4 columns */}
                    <div className="lg:col-span-4">
                        <div className="space-y-6 sticky top-24">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <DagagendaSectie />
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <WeerSectie />
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <VerjaardagenJubileaSectie />
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <SnelleToolLinksSectie />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}