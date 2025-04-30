// src/components/ui/Calendar.tsx
'use client'

import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiList, FiGrid } from 'react-icons/fi';
import CalendarDay from './CalendarDay';
import DagagendaItem from './DagagendaItem';
import { CalendarEvent } from '@/types/calendar';
import { formatDatum, formatDatumKort, formatTijd } from '@/utils/dateUtils';

interface CalendarProps {
    events: CalendarEvent[];
    initialView?: 'month' | 'week' | 'list';
}

export default function Calendar({ events, initialView = 'month' }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'week' | 'list'>(initialView);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Terug naar huidige datum
    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(null);
    };

    // Navigatie
    const prevPeriod = () => {
        const newDate = new Date(currentDate);
        if (view === 'month') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else if (view === 'week') {
            newDate.setDate(newDate.getDate() - 7);
        } else {
            newDate.setDate(newDate.getDate() - 1);
        }
        setCurrentDate(newDate);
    };

    const nextPeriod = () => {
        const newDate = new Date(currentDate);
        if (view === 'month') {
            newDate.setMonth(newDate.getMonth() + 1);
        } else if (view === 'week') {
            newDate.setDate(newDate.getDate() + 7);
        } else {
            newDate.setDate(newDate.getDate() + 1);
        }
        setCurrentDate(newDate);
    };

    // Helper functies voor datumberekeningen
    const getMonthDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Eerste dag van de maand
        const firstDay = new Date(year, month, 1);

        // Laatste dag van de maand
        const lastDay = new Date(year, month + 1, 0);

        // Bereken hoeveel dagen we van de vorige maand nodig hebben
        // In JS: 0 = zondag, 1 = maandag, ..., 6 = zaterdag
        // We willen beginnen met maandag
        const startOffset = (firstDay.getDay() + 6) % 7;

        // Start van het grid (inclusief dagen van vorige maand)
        const start = new Date(firstDay);
        start.setDate(start.getDate() - startOffset);

        // Aantal weken (maximaal 6)
        const totalDays = startOffset + lastDay.getDate();
        const rows = Math.ceil(totalDays / 7);

        const days: Date[] = [];

        // Vul het grid met dagen
        for (let i = 0; i < rows * 7; i++) {
            const date = new Date(start);
            date.setDate(date.getDate() + i);
            days.push(date);
        }

        return days;
    };

    const getWeekDays = () => {
        // Bereken de eerste dag van de week (maandag)
        const date = new Date(currentDate);
        const day = date.getDay(); // 0 = zondag, 1 = maandag, ..., 6 = zaterdag
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // aanpassen naar maandag

        const monday = new Date(date.setDate(diff));

        // Genereer array van dagen voor de week
        const days: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            days.push(day);
        }

        return days;
    };

    // Helper functie om te controleren of een datum vandaag is
    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    // Helper functie om te controleren of een datum in de huidige maand is
    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === currentDate.getMonth();
    };

    // Filter events voor een specifieke datum
    const getEventsForDate = (date: Date) => {
        return events.filter(event => {
            const eventStart = new Date(event.start);
            const eventStartDay = new Date(
                eventStart.getFullYear(),
                eventStart.getMonth(),
                eventStart.getDate()
            );

            const compareDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );

            return eventStartDay.getTime() === compareDate.getTime();
        });
    };

    // Titelformattering voor huidige periode
    const formatTitle = () => {
        if (view === 'month') {
            return new Intl.DateTimeFormat('nl-NL', { month: 'long', year: 'numeric' }).format(currentDate);
        } else if (view === 'week') {
            const days = getWeekDays();
            const firstDay = days[0];
            const lastDay = days[6];

            const formatDayMonth = (date: Date) => {
                return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short' }).format(date);
            };

            return `${formatDayMonth(firstDay)} - ${formatDayMonth(lastDay)} ${lastDay.getFullYear()}`;
        } else {
            return new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(currentDate);
        }
    };

    // Convert calendar events naar agenda items voor lijst- en dagweergave
    const convertToAgendaItems = (calendarEvents: CalendarEvent[]) => {
        return calendarEvents.map(event => ({
            id: event.id,
            titel: event.title,
            startTijd: event.start,
            eindTijd: event.end,
            type: mapEventTypeToAgendaType(event.type),
            locatie: event.location,
            beschrijving: event.description
        }));
    };

    // Map calendar event type naar agenda item type
    const mapEventTypeToAgendaType = (eventType: string): 'vergadering' | 'verjaardag' | 'presentatie' | 'sociaal' | 'anders' => {
        switch(eventType) {
            case 'meeting': return 'vergadering';
            case 'birthday': return 'verjaardag';
            case 'anniversary': return 'sociaal';
            case 'deadline': return 'presentatie';
            default: return 'anders';
        }
    };

    // Handle click op een datum in de kalender
    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
    };

    // Get events voor de lijst weergave
    const getListViewEvents = () => {
        let startDate, endDate;

        if (view === 'list') {
            // Voor lijst weergave: huidige week
            const days = getWeekDays();
            startDate = days[0];
            endDate = days[6];
        } else {
            // Bij selectie van een specifieke datum
            startDate = selectedDate || currentDate;
            endDate = selectedDate || currentDate;
        }

        // Zet tijden op begin en eind van de dag
        startDate = new Date(startDate);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(endDate);
        endDate.setHours(23, 59, 59, 999);

        // Filter events tussen start en eind datum
        return events.filter(event => {
            const eventStart = new Date(event.start);
            return eventStart >= startDate && eventStart <= endDate;
        }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center">
                <h2 className="text-lg font-bold">{formatTitle()}</h2>
                <div className="flex items-center">
                    <button
                        className="mr-2 p-1 hover:bg-primary-light rounded"
                        onClick={goToToday}
                    >
                        Vandaag
                    </button>
                    <button
                        className="p-1 hover:bg-primary-light rounded mr-1"
                        onClick={prevPeriod}
                    >
                        <FiChevronLeft size={20} />
                    </button>
                    <button
                        className="p-1 hover:bg-primary-light rounded"
                        onClick={nextPeriod}
                    >
                        <FiChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* View controls */}
            <div className="p-3 border-b flex justify-between items-center bg-gray-50">
                <div className="text-sm text-gray-600">
                    {selectedDate ? (
                        <>
                            <span className="font-medium">{formatDatum(selectedDate.toISOString())}</span>
                            <button
                                className="ml-2 text-accent hover:underline"
                                onClick={() => setSelectedDate(null)}
                            >
                                Wissen
                            </button>
                        </>
                    ) : view === 'list' ? 'Weekoverzicht' : ''}
                </div>
                <div className="flex space-x-1">
                    <button
                        className={`p-2 rounded ${view === 'month' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => setView('month')}
                    >
                        <FiGrid size={16} />
                    </button>
                    <button
                        className={`p-2 rounded ${view === 'week' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => setView('week')}
                    >
                        <FiCalendar size={16} />
                    </button>
                    <button
                        className={`p-2 rounded ${view === 'list' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => setView('list')}
                    >
                        <FiList size={16} />
                    </button>
                </div>
            </div>

            {/* Kalender */}
            {view === 'month' && (
                <>
                    {/* Weekdagen header */}
                    <div className="grid grid-cols-7 border-b">
                        {['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'].map((day, i) => (
                            <div key={i} className="py-2 text-center text-sm font-medium">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Maand grid */}
                    <div className="grid grid-cols-7">
                        {getMonthDays().map((date, i) => {
                            const dateEvents = getEventsForDate(date);
                            return (
                                <CalendarDay
                                    key={i}
                                    date={date}
                                    events={dateEvents.map(evt => ({
                                        id: evt.id,
                                        title: evt.title,
                                        type: evt.type
                                    }))}
                                    isCurrentMonth={isCurrentMonth(date)}
                                    isToday={isToday(date)}
                                    onClick={handleDayClick}
                                />
                            );
                        })}
                    </div>
                </>
            )}

            {view === 'week' && (
                <>
                    {/* Week grid */}
                    <div className="grid grid-cols-7 border-b">
                        {getWeekDays().map((date, i) => (
                            <div
                                key={i}
                                className={`py-2 text-center ${isToday(date) ? 'bg-accent-light font-medium' : ''}`}
                            >
                                <div className="text-sm">{new Intl.DateTimeFormat('nl-NL', { weekday: 'short' }).format(date)}</div>
                                <div className={`text-lg ${isToday(date) ? 'text-accent font-bold' : ''}`}>{date.getDate()}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 h-96 overflow-y-auto">
                        {getWeekDays().map((date, i) => {
                            const dateEvents = getEventsForDate(date);

                            return (
                                <div
                                    key={i}
                                    className={`border-r border-b p-1 overflow-y-auto ${isToday(date) ? 'bg-accent-light/10' : ''}`}
                                    onClick={() => handleDayClick(date)}
                                >
                                    {dateEvents.length > 0 ? (
                                        dateEvents.map(event => (
                                            <div
                                                key={event.id}
                                                className={`p-1 mb-1 text-xs rounded ${
                                                    event.type === 'meeting' ? 'bg-blue-100 border-l-2 border-blue-500' :
                                                        event.type === 'birthday' ? 'bg-pink-100 border-l-2 border-pink-500' :
                                                            event.type === 'anniversary' ? 'bg-yellow-100 border-l-2 border-yellow-500' :
                                                                event.type === 'holiday' ? 'bg-green-100 border-l-2 border-green-500' :
                                                                    event.type === 'deadline' ? 'bg-red-100 border-l-2 border-red-500' :
                                                                        'bg-purple-100 border-l-2 border-purple-500'
                                                }`}
                                            >
                                                <div className="font-medium">{event.title}</div>
                                                {!event.allDay && (
                                                    <div className="text-gray-600">
                                                        {formatTijd(event.start)} - {formatTijd(event.end)}
                                                    </div>
                                                )}
                                                {event.location && (
                                                    <div className="text-gray-600 truncate">{event.location}</div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-gray-400 text-center h-full flex items-center justify-center">
                                            Geen events
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {(view === 'list' || selectedDate) && (
                <div className="p-4 max-h-96 overflow-y-auto">
                    <h3 className="font-medium mb-3">
                        {selectedDate
                            ? `Events op ${formatDatum(selectedDate.toISOString())}`
                            : 'Deze week'}
                    </h3>

                    {getListViewEvents().length > 0 ? (
                        <div className="space-y-2">
                            {getListViewEvents().map(event => (
                                <DagagendaItem
                                    key={event.id}
                                    item={{
                                        id: event.id,
                                        titel: event.title,
                                        startTijd: event.start,
                                        eindTijd: event.end,
                                        type: mapEventTypeToAgendaType(event.type),
                                        locatie: event.location
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-4 text-gray-500">
                            Geen events gepland{selectedDate ? ' voor deze dag' : ' deze week'}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

