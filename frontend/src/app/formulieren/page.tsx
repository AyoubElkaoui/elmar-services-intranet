import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Formulieren - Elmar Services Intranet',
    description: 'Bedrijfsformulieren van Elmar Services',
}

export default function FormulierenPagina() {
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-primary mb-6">Formulieren</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <p>Formulieren overzichtspagina - wordt verder uitgewerkt</p>
            </div>
        </main>
    )
}