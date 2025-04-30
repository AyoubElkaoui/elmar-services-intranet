// src/components/ui/SnelleToolLinks.tsx
import Link from 'next/link';
import { Tool } from '@/types/tools';
import {
    FiMail, FiMessageSquare, FiCalendar, FiFileText,
    FiUser, FiUsers, FiBarChart2, FiGrid
} from 'react-icons/fi';

interface SnelleToolLinksProps {
    tools: Tool[];
    maxItems?: number;
}

export default function SnelleToolLinks({ tools, maxItems = 8 }: SnelleToolLinksProps) {
    // Verkrijg icoon op basis van de icoonstring
    const getToolIcoon = (icoonString: string) => {
        switch(icoonString) {
            case 'microsoft-office':
                return <FiFileText size={20} className="text-blue-600" />;
            case 'microsoft-teams':
                return <FiMessageSquare size={20} className="text-blue-500" />;
            case 'expense':
                return <FiBarChart2 size={20} className="text-green-600" />;
            case 'calendar':
                return <FiCalendar size={20} className="text-red-500" />;
            case 'project':
                return <FiGrid size={20} className="text-purple-600" />;
            case 'crm':
                return <FiUsers size={20} className="text-orange-500" />;
            default:
                return <FiFileText size={20} className="text-gray-600" />;
        }
    };

    // Verkrijg kleurklasse op basis van de categorie
    const getCategoryColorClass = (category: string) => {
        switch(category) {
            case 'communicatie':
                return 'bg-blue-50 border-blue-200';
            case 'productiviteit':
                return 'bg-green-50 border-green-200';
            case 'hr':
                return 'bg-orange-50 border-orange-200';
            case 'project':
                return 'bg-purple-50 border-purple-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="grid grid-cols-4 gap-3">
            {tools.slice(0, maxItems).map(tool => (
                <Link
                    key={tool.id}
                    href={tool.url}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border hover:shadow-sm transition-shadow ${getCategoryColorClass(tool.categorie)}`}
                >
                    <div className="mb-2">
                        {getToolIcoon(tool.icoon)}
                    </div>
                    <span className="text-xs text-center font-medium">{tool.naam}</span>
                </Link>
            ))}
        </div>
    );
}
