"use client";

// src/components/ui/SnelleToolLinks.tsx
import React from 'react';
import {
    FiCalendar,
    FiFolder,
    FiFileText,
    FiMail,
    FiUser,
    FiPhone,
    FiMonitor,
} from 'react-icons/fi';
import { ToolLink } from '@/types/tools';

// Intern gebruikte hardcoded snelle links
const toolLinks: ToolLink[] = [
    {
        id: 1,
        titel: 'Agenda',
        url: '/agenda',
        icon: <FiCalendar className="text-primary" size={20} />
    },
    {
        id: 2,
        titel: 'Documenten',
        url: '/documenten',
        icon: <FiFolder className="text-primary" size={20} />
    },
    {
        id: 3,
        titel: 'Formulieren',
        url: '/formulieren',
        icon: <FiFileText className="text-primary" size={20} />
    },
    {
        id: 4,
        titel: 'Webmail',
        url: '/mail',
        icon: <FiMail className="text-primary" size={20} />
    },
    {
        id: 5,
        titel: 'Personeelsgids',
        url: '/personeel',
        icon: <FiUser className="text-primary" size={20} />
    },
    {
        id: 6,
        titel: 'Telefoongids',
        url: '/telefoongids',
        icon: <FiPhone className="text-primary" size={20} />
    },
    {
        id: 7,
        titel: 'IT Helpdesk',
        url: '/helpdesk',
        icon: <FiMonitor className="text-primary" size={20} />
    }
];

export default function SnelleToolLinks() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {toolLinks.map(tool => (
                <a
                    key={tool.id}
                    href={tool.url}
                    className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <span className="mr-3">{tool.icon}</span>
                    <span className="font-medium">{tool.titel}</span>
                </a>
            ))}
        </div>
    );
}