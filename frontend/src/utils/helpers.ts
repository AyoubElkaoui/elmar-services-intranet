// src/utils/helpers.ts
// Algemene helper functies

/**
 * Formatteert een datum naar een leesbaar formaat (bijv. "12 mei 2023")
 */
export function formateerDatum(datumString: string): string {
    const datum = new Date(datumString);
    return datum.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Kort een tekst in tot een bepaalde lengte en voegt ... toe
 */
export function korteTekst(tekst: string, lengte: number = 100): string {
    if (!tekst || tekst.length <= lengte) return tekst || '';
    return tekst.substring(0, lengte) + '...';
}

/**
 * Genereert een willekeurige kleur in hexadecimale notatie
 */
export function randomKleur(): string {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

/**
 * Formatteert een getal als valuta (euro)
 */
export function formateerValuta(bedrag: number): string {
    return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR'
    }).format(bedrag);
}

/**
 * Genereert een unieke ID
 */
export function genereerId(): string {
    return Math.random().toString(36).substring(2, 9);
}

/**
 * Sorteert objecten in een array op een bepaald veld
 */
export function sorteerOp<T>(array: T[], veld: keyof T, oplopend: boolean = true): T[] {
    return [...array].sort((a, b) => {
        if (a[veld] < b[veld]) return oplopend ? -1 : 1;
        if (a[veld] > b[veld]) return oplopend ? 1 : -1;
        return 0;
    });
}