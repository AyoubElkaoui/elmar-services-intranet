// src/utils/dateUtils.ts
export function isVandaag(datumString: string): boolean {
    const vandaag = new Date();
    vandaag.setHours(0, 0, 0, 0);

    const datum = new Date(datumString);
    datum.setHours(0, 0, 0, 0);

    return datum.getTime() === vandaag.getTime();
}

export function isDezeMaand(datumString: string): boolean {
    const vandaag = new Date();
    const datum = new Date(datumString);

    return vandaag.getFullYear() === datum.getFullYear() &&
        vandaag.getMonth() === datum.getMonth();
}

export function isDezeWeek(datumString: string): boolean {
    const vandaag = new Date();
    const datum = new Date(datumString);

    // Eerste dag van de week (maandag = 1, zondag = 0)
    const eersteWeekdag = new Date(vandaag);
    const dagVanDeWeek = vandaag.getDay();
    const verschil = dagVanDeWeek === 0 ? 6 : dagVanDeWeek - 1;
    eersteWeekdag.setDate(vandaag.getDate() - verschil);
    eersteWeekdag.setHours(0, 0, 0, 0);

    // Laatste dag van de week
    const laatsteWeekdag = new Date(eersteWeekdag);
    laatsteWeekdag.setDate(eersteWeekdag.getDate() + 6);
    laatsteWeekdag.setHours(23, 59, 59, 999);

    return datum >= eersteWeekdag && datum <= laatsteWeekdag;
}

export function formatDatum(datumString: string): string {
    return new Date(datumString).toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

export function formatDatumKort(datumString: string): string {
    return new Date(datumString).toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'numeric'
    });
}

export function formatTijd(datumString: string): string {
    return new Date(datumString).toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function getDagVanDeWeek(datumString: string): string {
    const dagen = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
    const dagIndex = new Date(datumString).getDay();
    return dagen[dagIndex];
}
