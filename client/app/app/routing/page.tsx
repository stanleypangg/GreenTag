"use client";

import React, { useState, useEffect } from 'react';

interface Item {
    id: string;
    batch_no?: string;
    zone?: string;
    type?: 'donate' | 'recycle' | 'resell';
    destination?: string;
    status?: string;
    score?: number;
    date?: string;
}

// Define specific routing destinations
interface DestinationOptions {
    donate: string[];
    recycle: string[];
    resell: string[];
}

const RoutingPage: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoutingType, setSelectedRoutingType] = useState<'donate' | 'recycle' | 'resell'>('donate');
    
    // Predefined destination options
    const destinations: DestinationOptions = {
        donate: [
            "Goodwill Community Center",
            "Salvation Army",
            "Red Cross Donation Center",
            "Local Shelter"
        ],
        recycle: [
            "City Recycling Facility",
            "Green Earth Recyclers",
            "Electronic Waste Center",
            "Textile Recycling Plant"
        ],
        resell: [
            "Online Marketplace",
            "Consignment Shop",
            "Thrift Store Partnership",
            "Outlet Store"
        ]
    };

    // Fetch items from API
    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:8080/items");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                let fetchedItems: Item[] = [];
                if (Array.isArray(data)) {
                    fetchedItems = data;
                } else if (data && data.items && Array.isArray(data.items)) {
                    fetchedItems = data.items;
                }
                
                // Assign initial routing types based on score or status if available
                const processedItems = fetchedItems.map(item => {
                    let suggestedType: 'donate' | 'recycle' | 'resell' | undefined = undefined;
                    
                    // If item already has a status, use it for type
                    if (item.status) {
                        if (item.status.toLowerCase().includes('donate')) {
                            suggestedType = 'donate';
                        } else if (item.status.toLowerCase().includes('recycle')) {
                            suggestedType = 'recycle';
                        } else if (item.status.toLowerCase().includes('resell') || item.status.toLowerCase().includes('resold')) {
                            suggestedType = 'resell';
                        }
                    }
                    // Otherwise use score to make a suggestion
                    else if (item.score !== undefined) {
                        if (item.score >= 80) {
                            suggestedType = 'resell';
                        } else if (item.score >= 50) {
                            suggestedType = 'donate';
                        } else {
                            suggestedType = 'recycle';
                        }
                    }
                    
                    return {
                        ...item,
                        type: suggestedType,
                        zone: item.batch_no || 'N/A' // Use batch_no as zone if available
                    };
                });
                
                setItems(processedItems);
            } catch (error) {
                console.error("Failed to fetch items:", error);
                // Fallback to empty array
                setItems([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchItems();
    }, []);

    // Function to handle destination change (combined function)
    const handleDestinationChange = (id: string, combined: string) => {
        if (!combined) {
            return; // No changes for empty selection
        }
        
        // Extract the type from the destination format "type:destination"
        const [type, destination] = combined.split(':');
        
        setItems(prevItems => 
            prevItems.map(item => 
                item.id === id ? { 
                    ...item, 
                    type: type as 'donate' | 'recycle' | 'resell',
                    destination: destination 
                } : item
            )
        );
    };

    // Filter items by type
    const donateItems = items.filter(item => item.type === 'donate');
    const recycleItems = items.filter(item => item.type === 'recycle');
    const resellItems = items.filter(item => item.type === 'resell');

    // Function to render item rows for a column
    const renderItems = (columnItems: Item[]) => {
        return columnItems.map(item => (
            <tr key={item.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                <td className="py-2 pr-3 text-sm">{item.id}</td>
                <td className="py-2 pr-3 text-sm">{item.zone || 'N/A'}</td>
                <td className="py-2">
                    <select
                        className="block w-full bg-white border border-gray-300 hover:border-gray-400 px-2 py-1 rounded text-sm"
                        value={item.type && item.destination ? `${item.type}:${item.destination}` : ''}
                        onChange={(e) => handleDestinationChange(item.id, e.target.value)}
                    >
                        <option value="">Select destination</option>
                        
                        <optgroup label="Donation Centers">
                            {destinations.donate.map(dest => (
                                <option key={`donate:${dest}`} value={`donate:${dest}`}>
                                    {dest}
                                </option>
                            ))}
                        </optgroup>
                        
                        <optgroup label="Recycling Facilities">
                            {destinations.recycle.map(dest => (
                                <option key={`recycle:${dest}`} value={`recycle:${dest}`}>
                                    {dest}
                                </option>
                            ))}
                        </optgroup>
                        
                        <optgroup label="Resell Locations">
                            {destinations.resell.map(dest => (
                                <option key={`resell:${dest}`} value={`resell:${dest}`}>
                                    {dest}
                                </option>
                            ))}
                        </optgroup>
                    </select>
                </td>
            </tr>
        ));
    };

    return (
        <div className="p-2 flex flex-col space-y-3">
            {/* Main content grid - Made a bit taller than before */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3" style={{ maxHeight: '35vh' }}>
                {/* Donate Column */}
                <div className="bg-white rounded-lg shadow p-3 border-t-4 border-purple-500">
                    {/* Centered, smaller header */}
                    <h3 className="text-sm font-medium text-purple-700 mb-2 text-center">
                        Donate <span className="text-sm bg-purple-100 text-purple-800 px-2 py-0.5 rounded ml-1">{donateItems.length}</span>
                    </h3>
                    <div className="overflow-auto" style={{ maxHeight: 'calc(35vh - 60px)' }}>
                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                            </div>
                        ) : (
                            <table className="w-full">
                                <tbody>
                                    {renderItems(donateItems)}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                
                {/* Recycle Column */}
                <div className="bg-white rounded-lg shadow p-3 border-t-4 border-green-500">
                    {/* Centered, smaller header */}
                    <h3 className="text-sm font-medium text-green-700 mb-2 text-center">
                        Recycle <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded ml-1">{recycleItems.length}</span>
                    </h3>
                    <div className="overflow-auto" style={{ maxHeight: 'calc(35vh - 60px)' }}>
                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                            </div>
                        ) : (
                            <table className="w-full">
                                <tbody>
                                    {renderItems(recycleItems)}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                
                {/* Resell Column */}
                <div className="bg-white rounded-lg shadow p-3 border-t-4 border-blue-500">
                    {/* Centered, smaller header */}
                    <h3 className="text-sm font-medium text-blue-700 mb-2 text-center">
                        Resell <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded ml-1">{resellItems.length}</span>
                    </h3>
                    <div className="overflow-auto" style={{ maxHeight: 'calc(35vh - 60px)' }}>
                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <table className="w-full">
                                <tbody>
                                    {renderItems(resellItems)}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Routing Selections Panel with centered header */}
            <div className="bg-white rounded-lg shadow overflow-hidden" style={{ minHeight: '45vh' }}>
                {/* White background for header */}
                <div className="text-center py-3 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Routing Selections</h2>
                </div>
                
                <div className="border-b border-gray-200">
                    <nav className="flex justify-center -mb-px">
                        <button
                            onClick={() => setSelectedRoutingType('donate')}
                            className={`px-6 py-3 text-sm font-medium border-b-2 ${
                                selectedRoutingType === 'donate' 
                                    ? 'border-purple-500 text-purple-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Donation Centers
                        </button>
                        <button
                            onClick={() => setSelectedRoutingType('recycle')}
                            className={`px-6 py-3 text-sm font-medium border-b-2 ${
                                selectedRoutingType === 'recycle' 
                                    ? 'border-green-500 text-green-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Recycling Facilities
                        </button>
                        <button
                            onClick={() => setSelectedRoutingType('resell')}
                            className={`px-6 py-3 text-sm font-medium border-b-2 ${
                                selectedRoutingType === 'resell' 
                                    ? 'border-blue-500 text-blue-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Resell Locations
                        </button>
                    </nav>
                </div>
                
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-700">
                            {selectedRoutingType === 'donate' ? 'Donation Centers' : 
                             selectedRoutingType === 'recycle' ? 'Recycling Facilities' : 
                             'Resell Locations'}
                        </h3>
                        <span className={`text-sm px-2 py-1 rounded ${
                            selectedRoutingType === 'donate' ? 'bg-purple-100 text-purple-800' :
                            selectedRoutingType === 'recycle' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                            {destinations[selectedRoutingType].length} locations
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {destinations[selectedRoutingType].map((destination) => (
                            <div 
                                key={destination}
                                className="border rounded-md p-3 bg-gray-50 flex items-center"
                            >
                                <div className={`w-2 h-8 rounded-sm mr-3 ${
                                    selectedRoutingType === 'donate' ? 'bg-purple-500' :
                                    selectedRoutingType === 'recycle' ? 'bg-green-500' :
                                    'bg-blue-500'
                                }`}></div>
                                <div>
                                    <p className="font-medium">{destination}</p>
                                    <p className="text-sm text-gray-500">
                                        {items.filter(
                                            item => item.type === selectedRoutingType && 
                                            item.destination === destination
                                        ).length} items routed
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoutingPage;