export default function Footer() {
    return (
        <footer className="bg-primary-dark text-white mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p>&copy; {new Date().getFullYear()} Elmar Services. Alle rechten voorbehouden.</p>
                    </div>
                    <div>
                        <p>Intranet v1.0 | Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}