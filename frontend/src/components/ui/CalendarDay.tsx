// src/components/ui/CalendarDay.tsx
import { formatDatumKort } from '@/utils/dateUtils';

interface CalendarDayProps {
    date: Date;
    events: Array<{id: number; title: string; type: string}>;
    isCurrentMonth: boolean;
    isToday: boolean;
    onClick: (date: Date) => void;
}

export default function CalendarDay({ date, events, isCurrentMonth, isToday, onClick }: CalendarDayProps) {
    // Maximaal aantal events om te tonen
    const MAX_VISIBLE_EVENTS = 3;

    // Event dot kleur op basis van type
    const getEventColor = (type: string) => {
        switch(type) {
            case 'meeting':
                return 'bg-blue-500';
            case 'birthday':
                return 'bg-pink-500';
            case 'anniversary':
                return 'bg-yellow-500';
            case 'holiday':
                return 'bg-green-500';
            case 'deadline':
                return 'bg-red-500';
            default:
                return 'bg-purple-500';
        }
    };

    return (
        <div
            className={`h-24 p-1 border border-gray-200 overflow-hidden ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
            } ${
                isToday ? 'ring-2 ring-accent ring-offset-2' : ''
            }`}
            onClick={() => onClick(date)}
        >
            <div className="flex justify-between">
    <span className={`text-sm ${isCurrentMonth ? '' : 'text-gray-400'} ${
        isToday ? 'font-bold text-accent' : ''
    }`}>
    {date.getDate()}
    </span>
                <span className="text-xs text-gray-400">
        {events.length > 0 && `${events.length} items`}
        </span>
            </div>

            <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                {events.slice(0, MAX_VISIBLE_EVENTS).map(event => (
                    <div key={event.id} className="flex items-center text-xs overflow-hidden">
                        <span className={`h-2 w-2 rounded-full mr-1 flex-shrink-0 ${getEventColor(event.type)}`}></span>
                        <span className="truncate">{event.title}</span>
                    </div>
                ))}

                {events.length > MAX_VISIBLE_EVENTS && (
                    <div className="text-xs text-gray-500 pl-3">
                        +{events.length - MAX_VISIBLE_EVENTS} meer
                    </div>
                )}
            </div>
        </div>
    );
}