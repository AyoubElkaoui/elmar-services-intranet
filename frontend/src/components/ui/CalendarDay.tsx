"use client";

// src/components/ui/CalendarDay.tsx
import React from 'react';
import { formatDatumKort } from '@/utils/dateUtils';
import { Evenement } from '@/types/index';

interface CalendarDayProps {
    date: Date;
    events?: Evenement[];
    isCurrentMonth: boolean;
    isToday: boolean;
    onClick?: () => void;
}

export default function CalendarDay({
                                        date,
                                        events = [],
                                        isCurrentMonth,
                                        isToday,
                                        onClick
                                    }: CalendarDayProps) {

    // Format the date for accessibility
    const formattedDate = formatDatumKort(date.toISOString());
    const ariaLabel = `${formattedDate}, ${events.length} evenementen`;

    // Calculate CSS classes based on the prop values
    const dayClasses = `
        relative h-24 p-1 border border-gray-200
        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
        ${isToday ? 'ring-2 ring-primary ring-inset' : ''}
        ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}
    `.trim();

    // Display max 3 events, the rest is shown as "+X more"
    const maxDisplayEvents = 3;
    const displayEvents = events.slice(0, maxDisplayEvents);
    const remainingEvents = events.length - maxDisplayEvents;

    return (
        <div
            className={dayClasses}
            onClick={onClick}
            aria-label={ariaLabel}
            role={onClick ? "button" : undefined}
            title={ariaLabel}
        >
            {/* Day number */}
            <div className={`text-right font-medium ${isToday ? 'text-primary' : ''}`}>
                {date.getDate()}
            </div>

            {/* Events */}
            <div className="mt-1 space-y-1 overflow-hidden">
                {displayEvents.map((event, index) => (
                    <div
                        key={`${event.id}-${index}`}
                        className={`
                            text-xs truncate rounded px-1 py-0.5
                            ${event.type === 'vergadering' ? 'bg-blue-100 text-blue-800' : ''}
                            ${event.type === 'verjaardag' ? 'bg-pink-100 text-pink-800' : ''}
                            ${event.type === 'presentatie' ? 'bg-amber-100 text-amber-800' : ''}
                            ${event.type === 'sociaal' ? 'bg-green-100 text-green-800' : ''}
                            ${event.type === 'anders' ? 'bg-purple-100 text-purple-800' : ''}
                        `}
                        title={`${event.titel} (${event.startTijd} - ${event.eindTijd})`}
                    >
                        {event.titel}
                    </div>
                ))}

                {/* Show indicator for remaining events */}
                {remainingEvents > 0 && (
                    <div className="text-xs text-gray-500 px-1">
                        +{remainingEvents} meer
                    </div>
                )}
            </div>
        </div>
    );
}