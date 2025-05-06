// src/data/mockTools.ts
import { Tool } from '@/types/tools';

export const mockTools: Tool[] = [
    {
        id: 1,
        naam: 'Office 365',
        beschrijving: 'Microsoft Office suite (Word, Excel, PowerPoint, etc.)',
        url: 'https://office.com',
        icoon: 'microsoft-office',
        categorie: 'productiviteit'
    },
    {
        id: 2,
        naam: 'Teams',
        beschrijving: 'Microsoft Teams voor chat en videovergaderingen',
        url: 'https://teams.microsoft.com',
        icoon: 'microsoft-teams',
        categorie: 'communicatie'
    },
    {
        id: 3,
        naam: 'Declaraties',
        beschrijving: 'Declaratieformulieren en goedkeuring',
        url: '/personeelszaken/declaraties',
        icoon: 'expense',
        categorie: 'hr'
    },
    {
        id: 4,
        naam: 'Verlofaanvraag',
        beschrijving: 'Systeem voor het aanvragen van vakantie en verlof',
        url: '/personeelszaken/verlof',
        icoon: 'calendar',
        categorie: 'hr'
    },
    {
        id: 5,
        naam: 'ProjectPlanner',
        beschrijving: 'Projectmanagement en planning tool',
        url: 'https://projectplanner.elmarservices.nl',
        icoon: 'project',
        categorie: 'project'
    },
    {
        id: 6,
        naam: 'CRM Systeem',
        beschrijving: 'Klantrelatiebeheer',
        url: 'https://crm.elmarservices.nl',
        icoon: 'crm',
        categorie: 'productiviteit'
    }
];