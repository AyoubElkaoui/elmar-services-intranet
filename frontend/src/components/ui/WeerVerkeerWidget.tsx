// src/components/ui/WeerVerkeerWidget.tsx
'use client'

import { useState } from 'react';
import { WeerInfo, VerkeerInfo } from '@/types/weer';
// Import verschillende icon sets uit react-icons
import { WiDaySunny, WiDayCloudy, WiCloudy, WiRain, WiStrongWind, WiHumidity } from 'react-icons/wi';
import { BsThermometerHalf } from 'react-icons/bs';
import { FaCarSide, FaExclamationTriangle } from 'react-icons/fa';
import { MdDirectionsCar } from 'react-icons/md';

interface WeerVerkeerWidgetProps {
    weerInfo: WeerInfo;
    verkeerInfo: VerkeerInfo;
}

export default function WeerVerkeerWidget({ weerInfo, verkeerInfo }: WeerVerkeerWidgetProps) {
    const [activeTab, setActiveTab] = useState<'weer' | 'verkeer'>('weer');

    const getWeerIcoon = (icoonCode: string) => {
        switch (icoonCode) {
            case 'sunny':
                return <WiDaySunny className="text-yellow-500" size={36} />;
            case 'partly-cloudy':
                return <WiDayCloudy className="text-yellow-500" size={36} />;
            case 'cloudy':
                return <WiCloudy className="text-gray-400" size={36} />;
            case 'rainy':
                return <WiRain className="text-blue-400" size={36} />;
            default:
                return <WiDaySunny className="text-yellow-500" size={36} />;
        }
    };

    const getVerkeerStatusClass = (status: 'goed' | 'matig' | 'slecht') => {
        switch (status) {
            case 'goed':
                return 'text-green-500';
            case 'matig':
                return 'text-yellow-500';
            case 'slecht':
                return 'text-red-500';
            default:
                return 'text-green-500';
        }
    };

    const getVerkeerStatusIcon = (status: 'goed' | 'matig' | 'slecht') => {
        switch (status) {
            case 'goed':
                return <MdDirectionsCar className="text-green-500" size={24} />;
            case 'matig':
                return <FaCarSide className="text-yellow-500" size={24} />;
            case 'slecht':
                return <FaExclamationTriangle className="text-red-500" size={24} />;
            default:
                return <MdDirectionsCar className="text-green-500" size={24} />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-full">
            <div className="flex mb-4 border-b">
                <button
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'weer' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('weer')}
                >
                    Weer
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'verkeer' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('verkeer')}
                >
                    Verkeer
                </button>
            </div>

            {activeTab === 'weer' && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            {getWeerIcoon(weerInfo.icoon)}
                            <div className="ml-2">
                                <p className="font-medium">{weerInfo.stad}</p>
                                <p className="text-sm text-gray-600">{weerInfo.beschrijving}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold">{weerInfo.temperatuur}°C</p>
                            <div className="flex items-center justify-end text-sm text-gray-600">
                                <WiStrongWind className="mr-1" size={20} />
                                <span>{weerInfo.windsnelheid} km/u {weerInfo.windrichting}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-2">
                        {weerInfo.dagVoorspelling.map((dag, index) => (
                            <div key={index} className="text-center p-2 bg-gray-50 rounded">
                                <p className="text-xs text-gray-600">{dag.dag}</p>
                                <div className="my-1 flex justify-center">
                                    {getWeerIcoon(dag.icoon)}
                                </div>
                                <p className="text-xs font-medium">{dag.temperatuurHoog}° / {dag.temperatuurLaag}°</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'verkeer' && (
                <div>
                    <div className="flex items-center mb-4">
                        {getVerkeerStatusIcon(verkeerInfo.status)}
                        <div className="ml-2">
                            <p className="font-medium">Verkeerssituatie</p>
                            <p className="text-sm text-gray-600">{verkeerInfo.beschrijving}</p>
                        </div>
                    </div>

                    <div className="space-y-2 mt-2 max-h-36 overflow-y-auto">
                        {verkeerInfo.files.map((file, index) => (
                            <div key={index} className="flex justify-between bg-gray-50 p-2 rounded">
                                <div className="flex items-center">
                                    <FaCarSide className="mr-2 text-gray-500" size={14} />
                                    <p className="text-sm">{file.traject}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-red-500">{file.vertraging}</p>
                                    <p className="text-xs text-gray-600">{file.lengte}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {verkeerInfo.files.length === 0 && (
                        <p className="text-center text-green-500 py-4">
                            Geen files op dit moment
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}