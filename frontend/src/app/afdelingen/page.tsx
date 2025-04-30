import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Nieuws - Elmar Services Intranet',
    description: 'Nieuwsberichten van Elmar Services',
}

export default function NieuwsPagina() {
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-primary mb-6">Nieuws</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <p>Nieuws overzichtspagina - wordt verder uitgewerkt</p>
            </div>
        </main>
    )
}