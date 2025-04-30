export interface CalendarEvent {
    id: number;
    title: string;
    start: string; // ISO date string
    end: string; // ISO date string
    allDay?: boolean;
    type: 'meeting' | 'birthday' | 'anniversary' | 'holiday' | 'deadline' | 'other';
    location?: string;
    description?: string;
}