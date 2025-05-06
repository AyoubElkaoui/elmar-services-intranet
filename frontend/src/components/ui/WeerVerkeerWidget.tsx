"use client";

// src/components/ui/WeerVerkeerWidget.tsx
import React, { useState } from 'react';
import {
    WiStrongWind,
    WiHumidity,
    WiThermometer,
    WiDaySunny,
    WiCloudy,
    WiRain,
    WiSnow
} from 'react-icons/wi';
import { BsThermometerHalf } from 'react-icons/bs';
import { FaCarSide } from 'react-icons/fa';
import { WeerInfo, VerkeerInfo } from '@/types/weer';

interface WeerVerkeerWidgetProps {
    weerData: WeerInfo;
    verkeerData: VerkeerInfo;
}

export default function WeerVerkeerWidget({ weerData, verkeerData }: WeerVerkeerWidgetProps) {
    const [activeTab, setActiveTab] = useState<'weer' | 'verkeer'>('weer');

    // Functie om het juiste weericon te tonen op basis van beschrijving
    const getWeerIcon = (beschrijving: string) => {
        const lowerCase = beschrijving.toLowerCase();

        if (lowerCase.includes('zonnig')) return <WiDaySunny size={32} />;
        if (lowerCase.includes('bewolkt')) return <WiCloudy size={32} />;
        if (lowerCase.includes('regen')) return <WiRain size={32} />;
        if (lowerCase.includes('sneeuw')) return <WiSnow size={32} />;

        // Gebruik BsThermometerHalf als standaard voor verschillende weertypen
        if (weerData.temperatuur > 25) {
            return <BsThermometerHalf size={28} color="red" />;
        } else if (weerData.temperatuur < 5) {
            return <BsThermometerHalf size={28} color="blue" />;
        }

        return <WiThermometer size={32} />;
    };

    // Functie om CSS classes te bepalen voor verkeerstatus - nu daadwerkelijk gebruikt
    const getVerkeerStatusClass = (status: 'goed' | 'matig' | 'slecht') => {
        switch (status) {
            case 'goed':
                return 'text-green-600';
            case 'matig':
                return 'text-orange-600';
            case 'slecht':
                return 'text-red-600';
            default:
                return '';
        }
    };

    // Functie om luchtvochtigheidsicon te tonen - gebruikt WiHumidity
    const getHumidityIcon = () => {
        const humidity = weerData.luchtvochtigheid;

        if (humidity > 80) {
            return <WiHumidity className="text-blue-500" size={20} />;
        } else if (humidity < 30) {
            return <WiHumidity className="text-orange-500" size={20} />;
        }

        return <WiHumidity className="text-gray-500" size={20} />;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b">
                <button
                    className={`flex-1 py-3 px-4 text-center ${
                        activeTab === 'weer' ? 'bg-primary text-white' : 'bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('weer')}
                >
                    Weer
                </button>
                <button
                    className={`flex-1 py-3 px-4 text-center ${
                        activeTab === 'verkeer' ? 'bg-primary text-white' : 'bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('verkeer')}
                >
                    Verkeer
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {activeTab === 'weer' ? (
                    <div>
                        {/* Huidige weer */}
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">{weerData.stad}</h3>
                                <p className="text-sm text-gray-600">{weerData.beschrijving}</p>
                            </div>
                            <div className="flex items-center">
                                {getWeerIcon(weerData.beschrijving)}
                                <span className="text-2xl font-bold ml-1">{weerData.temperatuur}°C</span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                            <div className="flex items-center">
                                <WiStrongWind className="mr-1 text-gray-500" size={20} />
                                <span>Wind: {weerData.windsnelheid} km/u {weerData.windrichting}</span>
                            </div>
                            <div className="flex items-center">
                                {/* Gebruik het luchtvochtigheidsicoon dat WiHumidity gebruikt */}
                                {getHumidityIcon()}
                                <span className="ml-1">Luchtvochtigheid: {weerData.luchtvochtigheid}%</span>
                            </div>
                        </div>

                        {/* Voorspelling */}
                        <div className="border-t pt-3">
                            <h4 className="text-sm font-medium mb-2">Voorspelling</h4>
                            <div className="grid grid-cols-4 gap-2 text-xs text-center">
                                {weerData.dagVoorspelling.map((dag, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        <span className="font-medium">{dag.dag}</span>
                                        <span>{getWeerIcon(dag.beschrijving)}</span>
                                        <span>{dag.temperatuurHoog}° | {dag.temperatuurLaag}°</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Verkeersinformatie */}
                        <div className="mb-4">
                            <div className="flex items-center mb-2">
                                <FaCarSide className="mr-2 text-gray-600" />
                                <h3 className="text-lg font-semibold">Verkeerssituatie</h3>
                            </div>

                            {/* Gebruik de getVerkeerStatusClass functie om de kleur te bepalen */}
                            <p className={`text-sm ${getVerkeerStatusClass(verkeerData.status)}`}>
                                {verkeerData.beschrijving}
                            </p>
                        </div>

                        {/* Files */}
                        {verkeerData.files.length > 0 ? (
                            <div>
                                <h4 className="text-sm font-medium mb-2">Actuele files</h4>
                                <div className="space-y-3">
                                    {verkeerData.files.map((file, index) => (
                                        <div key={index} className="border-b pb-2 last:border-b-0">
                                            <p className="font-medium">{file.traject}</p>
                                            <div className="flex text-sm">
                                                <span className="text-red-600 mr-3">{file.vertraging}</span>
                                                <span className="text-gray-600">{file.lengte}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-green-600">Er zijn momenteel geen files gemeld.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}