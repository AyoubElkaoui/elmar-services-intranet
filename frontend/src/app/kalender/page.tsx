import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kalender - Elmar Services Intranet',
    description: 'Evenementenkalender van Elmar Services',
}

export default function KalenderPagina() {
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-primary mb-6">Kalender</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <p>Kalender overzichtspagina - wordt verder uitgewerkt</p>
            </div>
        </main>
    )
}