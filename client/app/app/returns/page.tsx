"use client";

import React, { useState, useEffect } from 'react';

interface ReturnItem {
    id: string;
    composition: { [key: string]: number };
    score: number;
    status: string;
    date: string;
}

const ReturnsPage: React.FC = () => {
    const [items, setItems] = useState<ReturnItem[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
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
            }
        };

        fetchItems();
    }, []);

    return (
        <div style={{ height: 'calc(100vh - 200px)', overflow: 'hidden' }}>
            <h2 className="text-2xl font-semibold mb-2">Returns Processed</h2>

            {/* Scrollable container for the table */}
            <div className="overflow-x-auto overflow-y-auto bg-white shadow rounded-lg" style={{ height: 'calc(100% - 40px)' }}>
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                        {/* Row above column headers */}
                        <tr>
                            <th
                                className="px-4 py-2 font-medium text-gray-700 text-left"
                                colSpan={4}
                            >
                                4,000 processed this month
                            </th>
                        </tr>
                        <tr>
                            <th className="px-4 py-2 font-medium text-gray-700 text-left">ID</th>
                            <th className="px-4 py-2 font-medium text-gray-700 text-left">Material Composition</th>
                            <th className="px-4 py-2 font-medium text-gray-700 text-left">Status</th>
                            <th className="px-4 py-2 font-medium text-gray-700 text-left">Sustainability Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td className="px-4 py-2">{item.id}</td>
                                <td className="px-4 py-2">
                                    {item.composition &&
                                        Object.entries(item.composition)
                                            .map(([material, percentage]) => `${material}: ${percentage}%`)
                                            .join(', ')}
                                </td>
                                <td className="px-4 py-2">{item.status}</td>
                                <td className="px-4 py-2">{item.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReturnsPage;