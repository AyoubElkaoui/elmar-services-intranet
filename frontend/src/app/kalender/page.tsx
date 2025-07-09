
'use client'

import KalenderComponent from '@/components/KalenderComponent'

export default function KalenderPagina() {
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">Kalender</h1>
                <p className="text-gray-600">Bekijk alle evenementen en activiteiten</p>
            </div>

            <KalenderComponent />
        </main>
    )
}