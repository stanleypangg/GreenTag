"use client"

import React from 'react';
import LineChart from './components/LineChart';
import PiChart from './components/PiChart'
import MetricTracker from './components/MetricTracker';
import BarChart from './components/BarChart';

const ESGPage: React.FC = () => {
    return (
        <div className="container mx-auto p-2">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-120px)]">
                <div className="w-full h-full">
                    <LineChart />
                </div>
                <div className="w-full h-full">
                    <PiChart />
                </div>
                <div className="w-full h-full">
                    <MetricTracker />
                </div>
                <div className="w-full h-full">
                    <BarChart />
                </div>
            </div>
        </div>
    );
};

export default ESGPage;