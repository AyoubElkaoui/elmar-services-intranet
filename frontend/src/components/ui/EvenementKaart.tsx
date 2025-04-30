import { FiCalendar, FiBriefcase, FiUsers, FiGift, FiAward } from 'react-icons/fi'
import { formateerDatum } from '@/utils/helpers'
import { Evenement } from '@/types'

interface EvenementKaartProps {
    evenement: Evenement
}

export default function EvenementKaart({ evenement }: EvenementKaartProps) {
    // Kies icoon op basis van evenement type
    const getIcoon = (type: string) => {
        switch(type) {
            case 'vergadering':
                return <FiBriefcase size={20} />;
            case 'verjaardag':
                return <FiGift size={20} />;
            case 'presentatie':
                return <FiAward size={20} />;
            case 'sociaal':
                return <FiUsers size={20} />;
            default:
                return <FiCalendar size={20} />;
        }
    };

    return (
        <div className="flex items-start">
            <div className="bg-primary text-white rounded p-2 mr-3">
                {getIcoon(evenement.type)}
            </div>
            <div>
                <p className="font-medium">{evenement.titel}</p>
                <p className="text-sm text-gray-500">{formateerDatum(evenement.datum)}</p>
            </div>
        </div>
    )
}
