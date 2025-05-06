import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Documenten - Elmar Services Intranet',
    description: 'Documenten en bestanden van Elmar Services',
}

export default function DocumentenPagina() {
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-primary mb-6">Documenten</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <p>Documenten overzichtspagina - wordt verder uitgewerkt</p>
            </div>
        </main>
    )
}