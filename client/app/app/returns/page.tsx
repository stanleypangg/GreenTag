"use client";

import React, { useState, useEffect } from 'react';

interface ReturnItem {
    id: string;
    composition: { [key: string]: number };
    score: number;
    status: string;
    date: string;
    batch_no?: string;
}

type SortField = 'score' | 'date';
type SortDirection = 'asc' | 'desc';

const ReturnsPage: React.FC = () => {
    const [items, setItems] = useState<ReturnItem[]>([]);
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("http://localhost:8080/items");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched data:", data);

                // Check if data is an array before setting items
                if (Array.isArray(data)) {
                    setItems(data);
                } else if (data && data.items && Array.isArray(data.items)) {
                    setItems(data.items);
                } else {
                    console.warn("Data format is unexpected:", data);
                    setItems([]);
                }
            } catch (error) {
                console.error("Could not fetch items:", error);
                setItems([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    }, []);

    // Format date to a more readable format
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Sort items based on selected field and direction
    const sortedItems = [...items].sort((a, b) => {
        if (sortField === 'score') {
            return sortDirection === 'asc' 
                ? a.score - b.score 
                : b.score - a.score;
        } else {
            // Sort by date
            const dateA = new Date(a.date || 0).getTime();
            const dateB = new Date(b.date || 0).getTime();
            return sortDirection === 'asc' 
                ? dateA - dateB 
                : dateB - dateA;
        }
    });

    // Handler for changing sort options
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'score_asc') {
            setSortField('score');
            setSortDirection('asc');
        } else if (value === 'score_desc') {
            setSortField('score');
            setSortDirection('desc');
        } else if (value === 'date_asc') {
            setSortField('date');
            setSortDirection('asc');
        } else {
            setSortField('date');
            setSortDirection('desc');
        }
    };

    return (
        <div style={{ height: 'calc(100vh - 200px)', overflow: 'hidden' }}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Returns Processed</h2>
                
                <div className="flex items-center">
                    <label htmlFor="sortOrder" className="mr-2 text-sm font-medium text-gray-700">
                        Order by:
                    </label>
                    <select
                        id="sortOrder"
                        className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={`${sortField}_${sortDirection}`}
                        onChange={handleSortChange}
                    >
                        <option value="date_desc">Date (Newest First)</option>
                        <option value="date_asc">Date (Oldest First)</option>
                        <option value="score_desc">Sustainability Score (High to Low)</option>
                        <option value="score_asc">Sustainability Score (Low to High)</option>
                    </select>
                </div>
            </div>

            {/* Scrollable container for the table */}
            <div className="overflow-x-auto overflow-y-auto bg-white shadow rounded-lg" style={{ height: 'calc(100% - 60px)' }}>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-100 sticky top-0">
                            {/* Row above column headers */}
                            <tr>
                                <th
                                    className="px-4 py-2 font-medium text-gray-700 text-left"
                                    colSpan={6}
                                >
                                    {items.length} processed this month
                                </th>
                            </tr>
                            <tr>
                                <th className="px-4 py-2 font-medium text-gray-700 text-center">ID</th>
                                <th className="px-4 py-2 font-medium text-gray-700 text-center">Material Composition</th>
                                <th className="px-4 py-2 font-medium text-gray-700 text-center">Status</th>
                                <th className="px-4 py-2 font-medium text-gray-700 text-center">
                                    Sustainability Score
                                    {sortField === 'score' && (
                                        <span className="ml-1">
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                                <th className="px-4 py-2 font-medium text-gray-700 text-center">Batch No</th>
                                <th className="px-4 py-2 font-medium text-gray-700 text-center">
                                    Scanned On
                                    {sortField === 'date' && (
                                        <span className="ml-1">
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sortedItems.map((item) => (
                                <tr 
                                    key={item.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-2 text-center">{item.id}</td>
                                    <td className="px-4 py-2 text-left">
                                        {item.composition &&
                                            Object.entries(item.composition)
                                                .map(([material, percentage]) => `${material}: ${percentage}%`)
                                                .join(', ')}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            item.status === 'Recycled' ? 'bg-green-100 text-green-800' : 
                                            item.status === 'Resold' ? 'bg-blue-100 text-blue-800' :
                                            item.status === 'Donated' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <span className={`font-medium ${
                                            item.score >= 80 ? 'text-green-600' :
                                            item.score >= 50 ? 'text-yellow-600' :
                                            'text-red-600'
                                        }`}>
                                            {item.score}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-center">{item.batch_no || 'N/A'}</td>
                                    <td className="px-4 py-2 text-center">{formatDate(item.date)}</td>
                                </tr>
                            ))}
                            {sortedItems.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                        No return items found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ReturnsPage;