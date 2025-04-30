// src/data/mockWeerVerkeer.ts
import { WeerInfo, VerkeerInfo } from '@/types/weer';

export const mockWeerData: WeerInfo = {
    stad: 'Amsterdam',
    temperatuur: 14,
    beschrijving: 'Gedeeltelijk bewolkt',
    icoon: 'partly-cloudy',
    windsnelheid: 12,
    windrichting: 'ZW',
    luchtvochtigheid: 75,
    dagVoorspelling: [
        {
            dag: 'Vandaag',
            temperatuurHoog: 15,
            temperatuurLaag: 8,
            beschrijving: 'Gedeeltelijk bewolkt',
            icoon: 'partly-cloudy'
        },
        {
            dag: 'Morgen',
            temperatuurHoog: 17,
            temperatuurLaag: 10,
            beschrijving: 'Zonnig',
            icoon: 'sunny'
        },
        {
            dag: 'Woensdag',
            temperatuurHoog: 13,
            temperatuurLaag: 7,
            beschrijving: 'Regenachtig',
            icoon: 'rainy'
        },
        {
            dag: 'Donderdag',
            temperatuurHoog: 12,
            temperatuurLaag: 8,
            beschrijving: 'Bewolkt',
            icoon: 'cloudy'
        },
    ]
};

export const mockVerkeerData: VerkeerInfo = {
    status: 'matig',
    beschrijving: 'Enkele files op de hoofdwegen',
    files: [
        {
            traject: 'A1 Amsterdam → Amersfoort',
            vertraging: '+15 min',
            lengte: '8 km'
        },
        {
            traject: 'A4 Amsterdam → Den Haag',
            vertraging: '+25 min',
            lengte: '12 km'
        },
        {
            traject: 'A2 Utrecht → Amsterdam',
            vertraging: '+10 min',
            lengte: '5 km'
        }
    ]
};