// src/data/mockWeerVerkeer.ts
import { WeerInfo, VerkeerInfo } from '@/types/weer';

export const mockWeerData: WeerInfo = {
    stad: 'Amsterdam',
    temperatuur: 12,
    beschrijving: 'Gedeeltelijk bewolkt',
    icoon: 'partly-cloudy',
    windsnelheid: 15,
    windrichting: 'ZW',
    luchtvochtigheid: 75,
    dagVoorspelling: [
        {
            dag: 'Wo',
            temperatuurHoog: 12,
            temperatuurLaag: 7,
            beschrijving: 'Lichte regen',
            icoon: 'rainy'
        },
        {
            dag: 'Do',
            temperatuurHoog: 14,
            temperatuurLaag: 8,
            beschrijving: 'Bewolkt',
            icoon: 'cloudy'
        },
        {
            dag: 'Vr',
            temperatuurHoog: 16,
            temperatuurLaag: 9,
            beschrijving: 'Zonnig',
            icoon: 'sunny'
        },
        {
            dag: 'Za',
            temperatuurHoog: 15,
            temperatuurLaag: 10,
            beschrijving: 'Gedeeltelijk bewolkt',
            icoon: 'partly-cloudy'
        }
    ]
};

export const mockVerkeerData: VerkeerInfo = {
    status: 'matig',
    beschrijving: 'Druk op de weg',
    files: [
        {
            traject: 'A10 Amsterdam → Amstelveen',
            vertraging: '+15 min',
            lengte: '8 km'
        },
        {
            traject: 'A4 Schiphol → Amsterdam',
            vertraging: '+10 min',
            lengte: '5 km'
        },
        {
            traject: 'A2 Utrecht → Amsterdam',
            vertraging: '+20 min',
            lengte: '12 km'
        }
    ]
};

// Een functie die een voorspelling geeft voor een specifieke locatie
export function getWeerVoorLocatie(locatie: string): WeerInfo {
    // In een echte app zou dit een API-aanroep zijn
    if (locatie.toLowerCase() === 'rotterdam') {
        return {
            ...mockWeerData,
            stad: 'Rotterdam',
            temperatuur: 13,
            windsnelheid: 18,
            windrichting: 'W'
        };
    } else if (locatie.toLowerCase() === 'utrecht') {
        return {
            ...mockWeerData,
            stad: 'Utrecht',
            temperatuur: 11,
            beschrijving: 'Bewolkt',
            windsnelheid: 12,
            windrichting: 'ZW'
        };
    }

    // Standaard Amsterdam teruggeven
    return mockWeerData;
}

// Een functie die verkeersinformatie geeft voor een specifieke regio
export function getVerkeerVoorRegio(regio: string): VerkeerInfo {
    // In een echte app zou dit een API-aanroep zijn
    if (regio.toLowerCase() === 'rotterdam') {
        return {
            status: 'slecht',
            beschrijving: 'Veel files in de regio Rotterdam',
            files: [
                {
                    traject: 'A16 Rotterdam → Breda',
                    vertraging: '+25 min',
                    lengte: '15 km'
                },
                {
                    traject: 'A20 Hoek van Holland → Gouda',
                    vertraging: '+30 min',
                    lengte: '10 km'
                }
            ]
        };
    } else if (regio.toLowerCase() === 'utrecht') {
        return {
            status: 'goed',
            beschrijving: 'Rustig op de weg in de regio Utrecht',
            files: []
        };
    }

    // Standaard Amsterdam teruggeven
    return mockVerkeerData;
}