// frontend/src/utils/helpers.ts - Enhanced helper functions
/**
 * Formatteert een datum naar een leesbaar formaat (bijv. "12 mei 2025")
 */
export function formateerDatum(datumString: string): string {
    try {
        const datum = new Date(datumString);
        if (isNaN(datum.getTime())) {
            return 'Ongeldige datum';
        }
        return datum.toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch (error) {
        return 'Ongeldige datum';
    }
}

/**
 * Formatteert een tijd uit een datum string (bijv. "14:30")
 */
export function formatTijd(datumString: string): string {
    try {
        const datum = new Date(datumString);
        if (isNaN(datum.getTime())) {
            return '--:--';
        }
        return datum.toLocaleTimeString('nl-NL', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return '--:--';
    }
}

/**
 * Kort een tekst in tot een bepaalde lengte en voegt ... toe
 */
export function korteTekst(tekst: string, lengte: number = 100): string {
    if (!tekst || tekst.length <= lengte) return tekst || '';
    return tekst.substring(0, lengte) + '...';
}

/**
 * Formatteert bestandsgrootte in leesbaar formaat
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

/**
 * Controleert of een string een geldig email adres is
 */
export function isGeldigEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Controleert of een string een geldig Nederlands telefoonnummer is
 */
export function isGeldigTelefoonnummer(telefoon: string): boolean {
    // Nederlands telefoonnummer patroon
    const telefooonRegex = /^(\+31|0)[1-9][0-9]{8}$/;
    const cleanTelefoon = telefoon.replace(/[\s\-\(\)]/g, '');
    return telefooonRegex.test(cleanTelefoon);
}

/**
 * Formatteert een telefoonnummer naar een leesbaar formaat
 */
export function formateerTelefoonnummer(telefoon: string): string {
    const clean = telefoon.replace(/[\s\-\(\)]/g, '');

    if (clean.startsWith('+31')) {
        const nummer = clean.substring(3);
        return `+31 ${nummer.substring(0, 1)} ${nummer.substring(1, 5)} ${nummer.substring(5)}`;
    } else if (clean.startsWith('0')) {
        return `${clean.substring(0, 3)}-${clean.substring(3, 6)} ${clean.substring(6)}`;
    }

    return telefoon;
}

/**
 * Berekent de leeftijd op basis van geboortedatum
 */
export function berekenLeeftijd(geboortedatum: string): number {
    const vandaag = new Date();
    const geboorte = new Date(geboortedatum);
    let leeftijd = vandaag.getFullYear() - geboorte.getFullYear();
    const maandVerschil = vandaag.getMonth() - geboorte.getMonth();

    if (maandVerschil < 0 || (maandVerschil === 0 && vandaag.getDate() < geboorte.getDate())) {
        leeftijd--;
    }

    return leeftijd;
}

/**
 * Berekent het aantal werkjaren op basis van startdatum
 */
export function berekenWerkjaren(startdatum: string): number {
    const vandaag = new Date();
    const start = new Date(startdatum);
    let jaren = vandaag.getFullYear() - start.getFullYear();
    const maandVerschil = vandaag.getMonth() - start.getMonth();

    if (maandVerschil < 0 || (maandVerschil === 0 && vandaag.getDate() < start.getDate())) {
        jaren--;
    }

    return jaren;
}

/**
 * Formatteert een datum naar relatieve tijd (bijv. "2 dagen geleden")
 */
export function relatieveTijd(datumString: string): string {
    const datum = new Date(datumString);
    const nu = new Date();
    const verschil = nu.getTime() - datum.getTime();

    const seconden = Math.floor(verschil / 1000);
    const minuten = Math.floor(seconden / 60);
    const uren = Math.floor(minuten / 60);
    const dagen = Math.floor(uren / 24);
    const weken = Math.floor(dagen / 7);
    const maanden = Math.floor(dagen / 30);
    const jaren = Math.floor(dagen / 365);

    if (jaren > 0) return `${jaren} jaar geleden`;
    if (maanden > 0) return `${maanden} maand${maanden > 1 ? 'en' : ''} geleden`;
    if (weken > 0) return `${weken} week${weken > 1 ? 'en' : ''} geleden`;
    if (dagen > 0) return `${dagen} dag${dagen > 1 ? 'en' : ''} geleden`;
    if (uren > 0) return `${uren} uur geleden`;
    if (minuten > 0) return `${minuten} minu${minuten > 1 ? 'ten' : 'ut'} geleden`;

    return 'Zojuist';
}

/**
 * Controleert of een datum vandaag is
 */
export function isVandaag(datumString: string): boolean {
    const datum = new Date(datumString);
    const vandaag = new Date();

    return datum.getDate() === vandaag.getDate() &&
        datum.getMonth() === vandaag.getMonth() &&
        datum.getFullYear() === vandaag.getFullYear();
}

/**
 * Controleert of een datum deze week valt
 */
export function isDezeWeek(datumString: string): boolean {
    const datum = new Date(datumString);
    const vandaag = new Date();

    // Begin van de week (maandag)
    const beginWeek = new Date(vandaag);
    const dag = vandaag.getDay();
    const verschil = dag === 0 ? 6 : dag - 1; // Zondag = 0, we willen maandag als start
    beginWeek.setDate(vandaag.getDate() - verschil);
    beginWeek.setHours(0, 0, 0, 0);

    // Eind van de week (zondag)
    const eindWeek = new Date(beginWeek);
    eindWeek.setDate(beginWeek.getDate() + 6);
    eindWeek.setHours(23, 59, 59, 999);

    return datum >= beginWeek && datum <= eindWeek;
}

/**
 * Controleert of een datum deze maand valt
 */
export function isDezeMaand(datumString: string): boolean {
    const datum = new Date(datumString);
    const vandaag = new Date();

    return datum.getMonth() === vandaag.getMonth() &&
        datum.getFullYear() === vandaag.getFullYear();
}

/**
 * Genereert een slug van een string (voor URLs)
 */
export function geneerSlug(tekst: string): string {
    return tekst
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Verwijder speciale karakters
        .replace(/\s+/g, '-') // Vervang spaties door streepjes
        .replace(/-+/g, '-') // Vervang meerdere streepjes door één
        .trim();
}

/**
 * Debounce functie voor zoekfuncties
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Throttle functie voor performance optimalisatie
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
        }
    };
}

/**
 * Kopieert tekst naar het klembord
 */
export async function kopieerNaarKlembord(tekst: string): Promise<boolean> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(tekst);
            return true;
        } else {
            // Fallback voor oudere browsers
            const textArea = document.createElement('textarea');
            textArea.value = tekst;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand('copy');
            textArea.remove();
            return success;
        }
    } catch (error) {
        console.error('Fout bij kopiëren naar klembord:', error);
        return false;
    }
}

/**
 * Download een bestand via een URL
 */
export function downloadBestand(url: string, bestandsnaam?: string): void {
    const link = document.createElement('a');
    link.href = url;
    if (bestandsnaam) {
        link.download = bestandsnaam;
    }
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}