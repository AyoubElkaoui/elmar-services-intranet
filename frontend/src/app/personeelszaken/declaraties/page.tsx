import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Personeelszaken - Elmar Services Intranet',
    description: 'Informatie over personeelszaken bij Elmar Services',
}

export default function PersoneelszakenPagina() {
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-primary mb-6">Personeelszaken</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <p>Personeelszaken overzichtspagina - wordt verder uitgewerkt</p>
            </div>
        </main>
    )
}