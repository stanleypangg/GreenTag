"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaCamera, FaFileUpload } from 'react-icons/fa';

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
    
    // State for image upload and analysis
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    useEffect(() => {
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
    
    // New handlers for file upload
    const openFileUploadModal = () => {
        setIsModalOpen(true);
    };

    const closeFileUploadModal = () => {
        setIsModalOpen(false);
        setAnalysisResult(null);
        // Refresh items data after closing modal
        fetchItems();
    };

    const triggerFileInput = (source: 'upload' | 'camera') => {
        if (fileInputRef.current) {
            fileInputRef.current.accept = source === 'upload' 
                ? '.png,.jpg,.jpeg,.webp' 
                : 'image/*;capture=camera';
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsAnalyzing(true);
            
            // Create form data to send the file
            const formData = new FormData();
            formData.append('image', file);
            
            // Send to the analyze_image endpoint
            const response = await fetch('http://localhost:8080/analyze_image', {
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            const data = await response.json();
            setAnalysisResult(data);
            
            // Immediately refresh items list to include the new item
            fetchItems();
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to analyze image. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div style={{ height: 'calc(100vh - 200px)', overflow: 'hidden' }}>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <h2 className="text-2xl font-semibold mr-4">Returns Processed</h2>
                    <button 
                        onClick={openFileUploadModal}
                        className="flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
                    >
                        <FaCamera className="mr-2" />
                        Scan Tag
                    </button>
                </div>
                
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

            <div className="overflow-x-auto overflow-y-auto bg-white shadow rounded-lg" style={{ height: 'calc(100% - 60px)' }}>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-100 sticky top-0">
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
                                            item.status === 'Resell' ? 'bg-blue-100 text-blue-800' :
                                            item.status === 'Donate' ? 'bg-purple-100 text-purple-800' :
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

            <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Scan Product Tag</h3>
                        
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
                                <p className="text-gray-600">Analyzing tag...</p>
                            </div>
                        ) : analysisResult ? (
                            <div className="mb-4">
                                <h4 className="font-medium text-lg mb-2">Analysis Results:</h4>
                                <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-60">
                                    <pre className="text-sm">{JSON.stringify(analysisResult.result, null, 2)}</pre>
                                </div>
                                <button
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded mt-4"
                                    onClick={closeFileUploadModal}
                                >
                                    Continue
                                </button>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-600 mb-6">Upload a photo of the product tag to analyze material composition.</p>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <button 
                                        className="flex flex-col items-center justify-center py-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
                                        onClick={() => triggerFileInput('upload')}
                                    >
                                        <FaFileUpload className="text-3xl text-gray-700 mb-2" />
                                        <span className="text-gray-700">Upload File</span>
                                        <span className="text-xs text-gray-500 mt-1">.png, .jpg, .webp</span>
                                    </button>
                                    
                                    <button 
                                        className="flex flex-col items-center justify-center py-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
                                        onClick={() => triggerFileInput('camera')}
                                    >
                                        <FaCamera className="text-3xl text-gray-700 mb-2" />
                                        <span className="text-gray-700">Take Photo</span>
                                        <span className="text-xs text-gray-500 mt-1">Use camera</span>
                                    </button>
                                </div>
                                
                                <div className="flex justify-end">
                                    <button 
                                        className="text-gray-600 hover:text-gray-800"
                                        onClick={closeFileUploadModal}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnsPage;