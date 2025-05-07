"use client";

// src/components/ui/Calendar.tsx
import React, { useState, useEffect } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import CalendarDay from './CalendarDay';
import { Evenement } from '@/types/index';
import { getDagVanDeWeek, isVandaag } from '@/utils/dateUtils';

interface CalendarProps {
    events?: Evenement[];
    onDayClick?: (date: Date) => void;
}

export default function Calendar({ events = [], onDayClick }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState<Date[]>([]);

    // Generate calendar days when the current month changes
    useEffect(() => {
        const days = generateCalendarDays(currentDate);
        setCalendarDays(days);
    }, [currentDate]);

    // Show weekday names above each column
    const renderWeekdayHeader = () => {
        const daysOfWeek = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

        return daysOfWeek.map((day, index) => {
            const fullDayOfWeek = getDagVanDeWeek(
                new Date(2023, 0, index + 2).toISOString() // 2023-01-02 is a Monday
            );

            return (
                <div
                    key={index}
                    className="py-2 text-center text-sm font-medium text-gray-500"
                    title={fullDayOfWeek}
                >
                    {day}
                </div>
            );
        });
    };

    // Go to previous month
    const goToPreviousMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
    };

    // Go to next month
    const goToNextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
    };

    // Go to current month
    const goToCurrentMonth = () => {
        setCurrentDate(new Date());
    };

    // Generate all dates for the calendar view
    const generateCalendarDays = (date: Date): Date[] => {
        const year = date.getFullYear();
        const month = date.getMonth();

        // First day of the month
        const firstDayOfMonth = new Date(year, month, 1);
        // Last day of the month
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // Calculate the first day of the calendar view (may be in previous month)
        const startDay = new Date(firstDayOfMonth);
        const dayOfWeek = startDay.getDay(); // 0 = Sunday, 1 = Monday, ...
        // If the first day is not Monday, go back to the last Monday
        if (dayOfWeek !== 1) { // 1 = Monday
            startDay.setDate(startDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        }

        // Calculate the last day of the calendar view (may be in next month)
        const endDay = new Date(lastDayOfMonth);
        const endDayOfWeek = endDay.getDay();
        // If the last day is not Sunday, go forward to the next Sunday
        if (endDayOfWeek !== 0) { // 0 = Sunday
            endDay.setDate(endDay.getDate() + (7 - endDayOfWeek));
        }

        // Create an array with all dates within the calendar view
        const calendarDays: Date[] = [];
        const currentDay = new Date(startDay);

        while (currentDay <= endDay) {
            calendarDays.push(new Date(currentDay));
            currentDay.setDate(currentDay.getDate() + 1);
        }

        return calendarDays;
    };

    // Helper function to determine if a date is in the current month
    const isCurrentMonth = (date: Date): boolean => {
        return date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear();
    };

    // Helper function to determine if there are events on a specific day
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

    // Handler for clicking on a day
    const handleDayClick = (date: Date) => {
        if (onDayClick) {
            onDayClick(date);
        }
    };

    // Format month and year
    const formatMonthYear = (date: Date): string => {
        return date.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header with navigation */}
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

            {/* Weekdays */}
            <div className="grid grid-cols-7 bg-gray-50">
                {renderWeekdayHeader()}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                    const dayEvents = getEventsForDay(day);

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