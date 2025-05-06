import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kennisbank - Elmar Services Intranet',
    description: 'Kennisbank en interne documentatie van Elmar Services',
}

export default function KennisbankPagina() {
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-primary mb-6">Kennisbank</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <p>Kennisbank overzichtspagina - wordt verder uitgewerkt</p>
            </div>
        </main>
    )
}