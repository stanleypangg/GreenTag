"use client"

import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import MetricTracker from '../esg/components/MetricTracker';
import PiChart from "./components/PiChart";
import BarChart from './components/BarChart';
import Link from 'next/link';

const DashboardPage: React.FC = () => {
    return (
        <div className="bg-gray-50 min-h-[calc(100vh-80px)] p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                {/* First Column - Left Section (3 units wide) */}
                <div className="lg:col-span-3 flex flex-col space-y-6">
                    {/* Welcome Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 flex-grow-0">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome, John Doe!</h2>
                        <p className="text-gray-600">You have 8 new batches to route.</p>
                        <button className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            <Link href='/app/returns'>Take me there</Link> <FaArrowRight className="inline ml-1" />
                        </button>
                    </div>

                    {/* Orders Overview - Takes more space */}
                    <div className="bg-white rounded-lg shadow-md p-6 flex-grow">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Orders Overview</h3>
                        <p className="text-green-600 text-sm">+30% this month</p>
                        <ul className="mt-4 space-y-3">
                            <li className="border-l-4 border-green-500 pl-3 py-1">
                                <span className="text-sm text-gray-700 font-medium">$2,400, Design changes</span><br />
                                <span className="text-xs text-gray-400">22 DEC 7:20 PM</span>
                            </li>
                            <li className="border-l-4 border-blue-500 pl-3 py-1">
                                <span className="text-sm text-gray-700 font-medium">New order #4219423</span><br />
                                <span className="text-xs text-gray-400">21 DEC 11:21 PM</span>
                            </li>
                            <li className="border-l-4 border-purple-500 pl-3 py-1">
                                <span className="text-sm text-gray-700 font-medium">Return processed #3994</span><br />
                                <span className="text-xs text-gray-400">20 DEC 3:10 PM</span>
                            </li>
                            <li className="border-l-4 border-yellow-500 pl-3 py-1">
                                <span className="text-sm text-gray-700 font-medium">Payment received #8673</span><br />
                                <span className="text-xs text-gray-400">19 DEC 8:34 AM</span>
                            </li>
                        </ul>
                    </div>

                    {/* Need Help Section - Fixed size */}
                    <div className="bg-green-100 rounded-lg p-6 flex-grow-0">
                        <p className="text-sm text-gray-700 font-semibold">Need help?</p>
                        <p className="text-sm text-gray-600 mt-2 mb-4">Check our documentation for tips and guidance</p>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
                            DOCUMENTATION
                        </button>
                    </div>
                </div>

                {/* Middle Section - Made thinner (5 units wide instead of 6) */}
                <div className="lg:col-span-5 flex flex-col space-y-6">
                    {/* Returns Overview - Takes more space */}
                    <div className="bg-white rounded-lg shadow-md p-6 flex-grow">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Returns Overview</h3>
                        <div className="flex justify-between mb-6">
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-gray-800">237</span>
                                <span className="text-sm text-gray-500">Total Returns</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-green-600">94%</span>
                                <span className="text-sm text-gray-500">Processed</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-blue-600">87%</span>
                                <span className="text-sm text-gray-500">Routed</span>
                            </div>
                        </div>
                        
                        {/* Returns Chart Placeholder */}
                        <div className="bg-gray-100 h-52 rounded flex items-center justify-center">
                            <p className="text-gray-500">Returns Activity Chart</p>
                        </div>
                    </div>

                    {/* Industry Overview - Takes less space */}
                    <BarChart></BarChart>
                </div>

                {/* Right Section - Made wider (4 units wide instead of 3) */}
                <div className="lg:col-span-4 flex flex-col space-y-6">
                    {/* ESG Sustainability Score */}
                    <PiChart></PiChart>
                    {/* ESG Metric Tracker */}
                    <MetricTracker></MetricTracker>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;