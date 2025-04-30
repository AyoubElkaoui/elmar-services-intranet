export function formateerDatum(datumString: string): string {
    const datum = new Date(datumString)
    return datum.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

export function korteTekst(tekst: string, lengte: number = 100): string {
    if (!tekst || tekst.length <= lengte) return tekst || ''
    return tekst.substring(0, lengte) + '...'
}