import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Afdelingen - Elmar Services Intranet',
    description: 'Overzicht van afdelingen binnen Elmar Services',
}

export default function AfdelingenPagina() {
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-primary mb-6">Afdelingen</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <p>Afdelingen overzichtspagina - wordt verder uitgewerkt</p>
            </div>
        </main>
    )
}