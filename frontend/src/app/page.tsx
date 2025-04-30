// src/app/page.tsx (Aangepaste layout)
import { Metadata } from 'next'
import { IoDocumentText, IoPeople, IoCalendar, IoLink } from 'react-icons/io5';
import { BsBook, BsClipboard } from 'react-icons/bs';
import WelkomstBanner from '@/components/WelkomstBanner'
import NieuwsSectie from '@/components/NieuwsSectie'
import SnelkoppelingenGrid from '@/components/SnelkoppelingenGrid'
import WeerVerkeerSectie from '@/components/WeerVerkeerSectie'
import DagagendaSectie from '@/components/DagagendaSectie'
import VergaderzaalSectie from '@/components/VergaderzaalSectie'
import VerjaardagenJubileaSectie from '@/components/VerjaardagenJubileaSectie'
import PollEnqueteSectie from '@/components/PollEnqueteSectie'
import SnelleToolLinksSectie from '@/components/SnelleToolLinksSectie'
import KalenderSectie from '@/components/KalenderSectie'
import FAQSectie from '@/components/FAQSectie'
import { Nieuws, Snelkoppeling, Evenement } from '@/types'

export const metadata: Metadata = {
  title: 'Home - Elmar Services Intranet',
  description: 'Welkom bij het intranet van Elmar Services',
}

// Voorbeelddata - zou in productie van API komen
const nieuwsItems: Nieuws[] = [
  {
    id: 1,
    titel: 'Kwartaalresultaten overtreffen verwachtingen',
    datum: '2023-03-14',
    samenvatting: 'De resultaten van het eerste kwartaal zijn binnen en overtreffen alle verwachtingen. Directie deelt complimenten uit aan alle afdelingen.',
    afbeelding: '/images/placeholder.svg'
  },
  {
    id: 2,
    titel: 'Nieuwe klant: Techniek Nederland',
    datum: '2023-03-10',
    samenvatting: 'We zijn verheugd om aan te kondigen dat Techniek Nederland heeft gekozen voor onze dienstverlening.',
    afbeelding: '/images/placeholder.svg'
  },
  {
    id: 3,
    titel: 'IT-onderhoud komend weekend',
    datum: '2023-03-08',
    samenvatting: 'Aankomend weekend zal er IT-onderhoud plaatsvinden. Enkele systemen zullen tijdelijk niet beschikbaar zijn.',
    afbeelding: '/images/placeholder.svg'
  }
];

const snelkoppelingen: Snelkoppeling[] = [
  { id: 1, titel: 'Documenten', icoon: <IoDocumentText size={24} />, url: '/documenten' },
  { id: 2, titel: 'Afdelingen', icoon: <IoPeople size={24} />, url: '/afdelingen' },
  { id: 3, titel: 'Formulieren', icoon: <BsClipboard size={24} />, url: '/formulieren' },
  { id: 4, titel: 'Kennisbank', icoon: <BsBook size={24} />, url: '/kennisbank' },
  { id: 5, titel: 'Personeelszaken', icoon: <IoPeople size={24} />, url: '/personeelszaken' },
  { id: 6, titel: 'Externe links', icoon: <IoLink size={24} />, url: '/links' }
];

const aankomende_evenementen: Evenement[] = [
  { id: 1, titel: 'Teamoverleg Marketing', datum: '2023-03-16', type: 'vergadering' },
  { id: 2, titel: 'Verjaardag Jan Janssen', datum: '2023-03-18', type: 'verjaardag' },
  { id: 3, titel: 'Kwartaalpresentatie', datum: '2023-03-22', type: 'presentatie' },
  { id: 4, titel: 'Bedrijfsborrel', datum: '2023-03-24', type: 'sociaal' }
];

export default function Home() {
  return (
      <main className="container mx-auto px-4 py-8">
        <WelkomstBanner />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Linker kolom (2/3 breedte op grote schermen) */}
          <div className="lg:col-span-2 space-y-8">
            <NieuwsSectie nieuwsItems={nieuwsItems} />
            <KalenderSectie />
            <VergaderzaalSectie />
            <SnelleToolLinksSectie />
          </div>

          {/* Rechter kolom (1/3 breedte op grote schermen) */}
          <div className="space-y-8">
            <SnelkoppelingenGrid koppelingen={snelkoppelingen} />
            <VerjaardagenJubileaSectie />
            {/* Verplaatst naar rechterkolom */}
            <DagagendaSectie />
            <WeerVerkeerSectie />
            <PollEnqueteSectie />
            <FAQSectie />
          </div>
        </div>
      </main>
  )
}