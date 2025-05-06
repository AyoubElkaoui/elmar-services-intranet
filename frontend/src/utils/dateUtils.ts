// src/utils/dateUtils.ts

/**
 * Formatteert een datum string naar een leesbaar formaat (bijv. "12 mei 2025")
 */
export function formatDatum(datumString: string): string {
    const datum = new Date(datumString);
    return datum.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Formatteert een tijd (bijv. "14:30")
 */
export function formatTijd(datumString: string): string {
    const datum = new Date(datumString);
    return datum.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Haalt de dag van de week op (bijv. "maandag")
 */
export function getDagVanDeWeek(datumString: string): string {
    const datum = new Date(datumString);
    return datum.toLocaleDateString('nl-NL', {
        weekday: 'long'
    });
}

/**
 * Controleert of de gegeven datum vandaag is
 */
export function isVandaag(datumString: string): boolean {
    const datum = new Date(datumString);
    const vandaag = new Date();
    return datum.toDateString() === vandaag.toDateString();
}

/**
 * Formatteert een datum naar een kort formaat (bijv. "12-05")
 */
export function formatDatumKort(datumString: string): string {
    const datum = new Date(datumString);
    return datum.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'numeric'
    });
}

/**
 * Berekent het aantal dagen tussen twee datums
 */
export function dagVerschil(datum1: string, datum2: string): number {
    const d1 = new Date(datum1);
    const d2 = new Date(datum2);
    const verschil = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(verschil / (1000 * 3600 * 24));
}

/**
 * Voegt een aantal dagen toe aan een datum
 */
export function voegDagenToe(datumString: string, aantalDagen: number): string {
    const datum = new Date(datumString);
    datum.setDate(datum.getDate() + aantalDagen);
    return datum.toISOString();
}

/**
 * Controleert of een datum in de huidige maand valt
 */
export function isDezeWeek(datumString: string): boolean {
    const datum = new Date(datumString);
    const nu = new Date();

    // Reset tijd naar begin van de dag
    const datumZonderTijd = new Date(datum.getFullYear(), datum.getMonth(), datum.getDate());
    const nuZonderTijd = new Date(nu.getFullYear(), nu.getMonth(), nu.getDate());

    // Bereken begin van de week (maandag)
    const beginVanDeWeek = new Date(nuZonderTijd);
    const dagVanDeWeek = nuZonderTijd.getDay(); // 0 = zondag, 1 = maandag, etc.
    beginVanDeWeek.setDate(nuZonderTijd.getDate() - (dagVanDeWeek === 0 ? 6 : dagVanDeWeek - 1));

    // Bereken eind van de week (zondag)
    const eindVanDeWeek = new Date(beginVanDeWeek);
    eindVanDeWeek.setDate(beginVanDeWeek.getDate() + 6);

    // Controleer of de datum binnen deze week valt
    return datumZonderTijd >= beginVanDeWeek && datumZonderTijd <= eindVanDeWeek;
}

/**
 * Controleert of een datum in de huidige maand valt
 */
export function isDezeMaand(datumString: string): boolean {
    const datum = new Date(datumString);
    const nu = new Date();
    return datum.getMonth() === nu.getMonth() && datum.getFullYear() === nu.getFullYear();
}

/**
 * Formatteert een datum naar "vandaag", "morgen", of dag van de week voor recente datums
 */
export function formatRelatieveDatum(datumString: string): string {
    const datum = new Date(datumString);
    const nu = new Date();

    // Reset tijd naar begin van de dag
    const datumZonderTijd = new Date(datum.getFullYear(), datum.getMonth(), datum.getDate());
    const nuZonderTijd = new Date(nu.getFullYear(), nu.getMonth(), nu.getDate());

    // Bereken verschil in dagen
    const verschilInDagen = Math.floor(
        (datumZonderTijd.getTime() - nuZonderTijd.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Geef relatieve datum weer
    if (verschilInDagen === 0) {
        return 'Vandaag';
    } else if (verschilInDagen === 1) {
        return 'Morgen';
    } else if (verschilInDagen > 1 && verschilInDagen < 7) {
        return getDagVanDeWeek(datumString);
    } else {
        return formatDatumKort(datumString);
    }
}