import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Links - Elmar Services Intranet',
    description: 'Handige links voor medewerkers van Elmar Services',
}

export default function LinksPagina() {
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-primary mb-6">Handige Links</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <p>Links overzichtspagina - wordt verder uitgewerkt</p>
            </div>
        </main>
    )
}