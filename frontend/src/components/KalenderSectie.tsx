"use client";

// src/components/KalenderSectie.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import Calendar from '@/components/ui/Calendar';
import { kalenderEvenementen } from '@/data/mockCalendarEvents';
import { formatDatum } from '@/utils/dateUtils';

export default function KalenderSectie() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Handler for clicking on a day
    const handleDayClick = useCallback((date: Date) => {
        setSelectedDate(date);
    }, []);

    // Use useMemo to avoid repeating the filter logic and prevent unnecessary re-renders
    const filteredEvents = useMemo(() => {
        if (!selectedDate) return [];

        return kalenderEvenementen.filter(event => {
            const eventDate = new Date(event.datum);
            return (
                eventDate.getDate() === selectedDate.getDate() &&
                eventDate.getMonth() === selectedDate.getMonth() &&
                eventDate.getFullYear() === selectedDate.getFullYear()
            );
        });
    }, [selectedDate]);

    return (
        <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FaCalendarAlt className="text-primary mr-2" />
                Kalender
            </h2>

            <Calendar
                events={kalenderEvenementen}
                onDayClick={handleDayClick}
                key="calendar-component" // Add a stable key
            />

            {selectedDate && (
                <div className="mt-6 border-t pt-4">
                    <h3 className="text-xl font-bold mb-3">
                        Evenementen op {formatDatum(selectedDate.toISOString())}
                    </h3>

                    {filteredEvents.length > 0 ? (
                        <ul className="space-y-3">
                            {filteredEvents.map(event => (
                                <li key={event.id} className="border-b pb-3 last:border-b-0">
                                    <div className="font-medium">{event.titel}</div>
                                    <div className="text-sm text-gray-600">{event.startTijd} - {event.eindTijd} • {event.locatie}</div>
                                    {event.beschrijving && <div className="text-sm mt-1">{event.beschrijving}</div>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">Geen evenementen gepland voor deze dag.</p>
                    )}
                </div>
            )}
        </section>
    );
}