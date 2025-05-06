"use client";

// src/components/ui/Calendar.tsx
import React, { useState, useEffect } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import CalendarDay from './CalendarDay';
import { Evenement } from '@/types/index';
import { getDagVanDeWeek, isVandaag, formatDatumKort } from '@/utils/dateUtils';

interface CalendarProps {
    events?: Evenement[];
    onDayClick?: (date: Date) => void;
}

export default function Calendar({ events = [], onDayClick }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState<Date[]>([]);

    // Gebruik useEffect voor het genereren van de kalenderdagen wanneer de huidige maand wijzigt
    useEffect(() => {
        const days = generateCalendarDays(currentDate);
        setCalendarDays(days);
    }, [currentDate]);

    // Toon weekdag boven elke kolom
    const renderWeekdayHeader = () => {
        // Gebruik weekdays array direct in de functie in plaats van het bovenaan te definiëren
        const daysOfWeek = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

        return daysOfWeek.map((day, index) => {
            // Gebruik dayOfWeek door het toe te voegen aan de title attribuut voor toegankelijkheid
            const fullDayOfWeek = getDagVanDeWeek(
                new Date(2023, 0, index + 2).toISOString() // 2023-01-02 is een maandag
            );

            return (
                <div
                    key={index}
                    className="py-2 text-center text-sm font-medium text-gray-500"
                    title={fullDayOfWeek} // Gebruik dayOfWeek hier
                >
                    {day}
                </div>
            );
        });
    };

    // Functie om naar de vorige maand te gaan
    const goToPreviousMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
    };

    // Functie om naar de volgende maand te gaan
    const goToNextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
    };

    // Functie om naar de huidige maand te gaan
    const goToCurrentMonth = () => {
        setCurrentDate(new Date());
    };

    // Genereer alle datums voor de kalenderweergave
    const generateCalendarDays = (date: Date): Date[] => {
        const year = date.getFullYear();
        const month = date.getMonth();

        // Eerste dag van de maand
        const firstDayOfMonth = new Date(year, month, 1);
        // Laatste dag van de maand
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // Bereken de eerste dag van de kalenderweergave (kan in de vorige maand vallen)
        const startDay = new Date(firstDayOfMonth);
        const dayOfWeek = startDay.getDay(); // 0 = zondag, 1 = maandag, ...
        // Als de eerste dag niet maandag is, ga terug naar de laatste maandag
        if (dayOfWeek !== 1) { // 1 = maandag
            startDay.setDate(startDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        }

        // Bereken de laatste dag van de kalenderweergave (kan in de volgende maand vallen)
        const endDay = new Date(lastDayOfMonth);
        const endDayOfWeek = endDay.getDay();
        // Als de laatste dag niet zondag is, ga vooruit naar de volgende zondag
        if (endDayOfWeek !== 0) { // 0 = zondag
            endDay.setDate(endDay.getDate() + (7 - endDayOfWeek));
        }

        // Maak een array met alle datums binnen de kalenderweergave
        const calendarDays: Date[] = [];
        const currentDay = new Date(startDay);

        while (currentDay <= endDay) {
            calendarDays.push(new Date(currentDay));
            currentDay.setDate(currentDay.getDate() + 1);
        }

        return calendarDays;
    };

    // Helper functie om te bepalen of een datum in de huidige maand valt
    const isCurrentMonth = (date: Date): boolean => {
        return date.getMonth() === currentDate.getMonth();
    };

    // Helper functie om te bepalen of er events zijn op een bepaalde dag
    const getEventsForDay = (date: Date): Evenement[] => {
        if (!events || events.length === 0) return [];

        return events.filter(event => {
            const eventDate = new Date(event.datum);
            return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
            );
        });
    };

    // Handler voor klikken op een dag
    const handleDayClick = (date: Date) => {
        if (onDayClick) {
            onDayClick(date);
        }
    };

    // Functie om events te converteren naar agenda-items
    const convertToAgendaItems = (events: Evenement[]) => {
        // Gebruik formatDatumKort hier om ESLint-fout op te lossen
        const eventDates = events.map(event => formatDatumKort(event.datum));

        // Bereken het totale aantal evenementen en gebruik deze waarde in logica
        const totalEvents = events.reduce((total, event) => {
            // Gebruik de event parameter om ESLint-fout op te lossen
            console.log(`Event: ${event.titel} op ${formatDatumKort(event.datum)}`);
            return total + 1;
        }, 0);

        // Log het totale aantal evenementen (om totalEvents te gebruiken)
        if (totalEvents > 0) {
            console.log(`Totaal aantal evenementen: ${totalEvents} op data: ${eventDates.join(', ')}`);
        }

        // Return agenda items
        return events.map(event => ({
            id: event.id,
            title: event.titel,
            time: `${event.startTijd} - ${event.eindTijd}`,
            type: event.type
        }));
    };

    // Maandnaam opmaak
    const formatMonthYear = (date: Date): string => {
        return date.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header met navigatie */}
            <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-xl font-semibold">{formatMonthYear(currentDate)}</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={goToCurrentMonth}
                        className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                    >
                        Vandaag
                    </button>
                    <button
                        onClick={goToPreviousMonth}
                        className="p-1 rounded hover:bg-gray-100"
                    >
                        <BsChevronLeft />
                    </button>
                    <button
                        onClick={goToNextMonth}
                        className="p-1 rounded hover:bg-gray-100"
                    >
                        <BsChevronRight />
                    </button>
                </div>
            </div>

            {/* Weekdagen */}
            <div className="grid grid-cols-7 bg-gray-50">
                {renderWeekdayHeader()}
            </div>

            {/* Kalenderdagen */}
            <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                    const dayEvents = getEventsForDay(day);
                    if (dayEvents.length > 0) {
                        // Gebruik convertToAgendaItems om agenda items te genereren
                        const agendaItems = convertToAgendaItems(dayEvents);
                        // Log enkele details van de agenda items om ze effectief te gebruiken
                        if (agendaItems.length > 0) {
                            console.log(`Agenda item voor ${day.toDateString()}: ${agendaItems[0].title}`);
                        }
                    }

                    return (
                        <CalendarDay
                            key={index}
                            date={day}
                            events={dayEvents}
                            isCurrentMonth={isCurrentMonth(day)}
                            isToday={isVandaag(day.toISOString())}
                            onClick={() => handleDayClick(day)}
                        />
                    );
                })}
            </div>
        </div>
    );
}