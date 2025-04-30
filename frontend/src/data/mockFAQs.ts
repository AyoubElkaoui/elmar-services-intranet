import { FAQ } from '@/types/faq';

export const mockFAQs: FAQ[] = [
    {
        id: 1,
        vraag: 'Hoe vraag ik verlof aan?',
        antwoord: 'Verlof aanvragen kan via het HR-portaal onder "Personeelszaken > Verlofaanvraag". Vul het formulier in met de gewenste data en reden, en wacht op goedkeuring van je leidinggevende.',
        categorie: 'HR',
        populair: true
    },
    {
        id: 2,
        vraag: 'Hoe kan ik een vergaderzaal reserveren?',
        antwoord: 'Vergaderzalen kunnen gereserveerd worden via de "Vergaderzalen" sectie op de homepage of via de volledige kalender. Kies een beschikbare zaal, datum en tijd, en bevestig je reservering.',
        categorie: 'Faciliteiten',
        populair: true
    },
    {
        id: 3,
        vraag: 'Waar vind ik de bedrijfsrichtlijnen?',
        antwoord: 'Alle bedrijfsrichtlijnen zijn te vinden in de Kennisbank onder "Documenten > Richtlijnen". Hier vind je beleidsdocumenten, procedures en werkinstructies.',
        categorie: 'Algemeen',
        populair: true
    },
    {
        id: 4,
        vraag: 'Hoe dien ik een declaratie in?',
        antwoord: 'Declaraties kunnen worden ingediend via "Personeelszaken > Declaraties". Upload een foto of scan van je bonnetje, vul het bedrag en de categorie in, en dien het formulier in ter goedkeuring.',
        categorie: 'HR',
        populair: false
    },
    {
        id: 5,
        vraag: 'Wat is het wachtwoordbeleid?',
        antwoord: 'Wachtwoorden moeten minimaal 12 tekens bevatten, met hoofdletters, kleine letters, cijfers en speciale tekens. Wachtwoorden moeten elke 90 dagen worden gewijzigd en mogen niet worden hergebruikt.',
        categorie: 'IT',
        populair: false
    },
    {
        id: 6,
        vraag: 'Waar kan ik IT-ondersteuning aanvragen?',
        antwoord: 'IT-ondersteuning kan worden aangevraagd via het ticketsysteem op "IT-Support". Beschrijf je probleem zo gedetailleerd mogelijk en vermeld de urgentie.',
        categorie: 'IT',
        populair: true
    }
];