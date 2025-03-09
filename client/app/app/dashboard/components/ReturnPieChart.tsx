"use client"

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface ReturnItem {
    id: string;
    composition: { [key: string]: number };
    score: number;
    status: string;
    date: string;
    batch_no?: string;
}

interface ChartData {
    category: string;
    value: number;
    color: string;
}

const ReturnsPieChart: React.FC = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ChartData[]>([
        { category: 'Resell', value: 0, color: '#3B82F6' },
        { category: 'Recycle', value: 0, color: '#10B981' },
        { category: 'Donate', value: 0, color: '#8B5CF6' },
        { category: 'Routed Away', value: 0, color: '#F59E0B' }
    ]);
    const [totalReturns, setTotalReturns] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("http://localhost:8080/items");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const responseData = await response.json();
                
                // Process the data
                let items: ReturnItem[] = [];
                if (Array.isArray(responseData)) {
                    items = responseData;
                } else if (responseData && responseData.items && Array.isArray(responseData.items)) {
                    items = responseData.items;
                }
                
                // Set total returns count
                setTotalReturns(items.length);
                
                // Count items by status
                const countByStatus = {
                    'Resell': 0,
                    'Recycle': 0,
                    'Donate': 0,
                    'Routed': 0, // For any other status
                };
                
                items.forEach(item => {
                    const status = item.status || '';
                    if (status.toLowerCase().includes('resell')) {
                        countByStatus['Resell']++;
                    } else if (status.toLowerCase().includes('recycle')) {
                        countByStatus['Recycle']++;
                    } else if (status.toLowerCase().includes('donate')) {
                        countByStatus['Donate']++;
                    } else {
                        countByStatus['Routed']++;
                    }
                });
                
                // Calculate percentages
                const processedCount = items.length;
                const routedCount = countByStatus['Resell'] + countByStatus['Recycle'] + countByStatus['Donate'];
                const processedPercentage = items.length > 0 ? Math.round((processedCount / items.length) * 100) : 0;
                const routedPercentage = items.length > 0 ? Math.round((routedCount / items.length) * 100) : 0;
                
                // Update chart data
                setData([
                    { category: 'Resell', value: countByStatus['Resell'], color: '#3B82F6' },
                    { category: 'Recycle', value: countByStatus['Recycle'], color: '#10B981' },
                    { category: 'Donate', value: countByStatus['Donate'], color: '#8B5CF6' },
                    { category: 'Routed Away', value: countByStatus['Routed'], color: '#F59E0B' }
                ]);
                
                setError(null);
            } catch (err) {
                console.error("Could not fetch items:", err);
                setError("Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        
        // Set up polling for real-time updates
        const pollInterval = setInterval(() => {
            fetchData();
        }, 10000); // Poll every 10 seconds
        
        return () => clearInterval(pollInterval);
    }, []);

    useEffect(() => {
        if (isLoading || error || !data.length || !svgRef.current) {
            return;
        }

        const drawChart = () => {
            // Clear the SVG first
            const svg = d3.select(svgRef.current);
            svg.selectAll('*').remove();
            
            // Measure the container to make the chart responsive
            const containerWidth = containerRef.current?.clientWidth || 400;
            const containerHeight = 240;
            const margin = { top: 20, right: 20, bottom: 40, left: 20 };
            const width = containerWidth - margin.left - margin.right;
            const height = containerHeight - margin.top - margin.bottom;
            const radius = Math.min(width, height) / 2;
            
            // Create the main group element
            const g = svg.append('g')
                .attr('transform', `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);
            
            // Filter out zero values to avoid empty pie slices
            const filteredData = data.filter(d => d.value > 0);
            
            // Setup pie layout
            const pie = d3.pie<ChartData>()
                .value(d => d.value)
                .sort(null);
                
            // Setup arc generator
            const arc = d3.arc<d3.PieArcDatum<ChartData>>()
                .innerRadius(radius * 0.4) // Make it a donut chart
                .outerRadius(radius * 0.8);
            
            // Add slices
            const slices = g.selectAll('.arc')
                .data(pie(filteredData))
                .enter()
                .append('g')
                .attr('class', 'arc');
                
            // Add path (slices)
            slices.append('path')
                .attr('d', arc)
                .attr('fill', d => d.data.color)
                .attr('stroke', 'white')
                .style('stroke-width', '2px')
                .style('opacity', 0.8)
                .on('mouseover', function(event, d) {
                    d3.select(this)
                        .style('opacity', 1)
                        .attr('transform', 'scale(1.05)');
                })
                .on('mouseout', function() {
                    d3.select(this)
                        .style('opacity', 0.8)
                        .attr('transform', 'scale(1)');
                });
                
            // Add the percentage value in the center
            g.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '.35em')
                .style('font-size', '20px')
                .style('font-weight', 'bold')
                .style('fill', '#4b5563')
                .text(`${filteredData.reduce((sum, item) => sum + item.value, 0)}`);
                
            g.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '1.5em')
                .style('font-size', '12px')
                .style('fill', '#6b7280')
                .text('Items');
                
            // Add legend at the bottom
            const legend = svg.append('g')
                .attr('transform', `translate(${margin.left}, ${height + margin.top + 15})`);
                
            const legendSpacing = width / Math.min(filteredData.length, 4);
            
            const legendItems = legend.selectAll('.legend-item')
                .data(filteredData)
                .enter()
                .append('g')
                .attr('class', 'legend-item')
                .attr('transform', (d, i) => `translate(${i * legendSpacing}, 0)`);
                
            legendItems.append('rect')
                .attr('width', 12)
                .attr('height', 12)
                .attr('fill', d => d.color);
                
            legendItems.append('text')
                .attr('x', 16)
                .attr('y', 9)
                .attr('font-size', '11px')
                .style('text-anchor', 'start')
                .text(d => `${d.category} (${d.value})`);
        };

        drawChart();

        // Update chart on window resize
        const handleResize = () => {
            drawChart();
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        
    }, [data, isLoading, error]);

    return (
        <div ref={containerRef} className="w-full">
            {isLoading ? (
                <div className="flex items-center justify-center h-60">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
            ) : error ? (
                <div className="flex items-center justify-center h-60 text-red-500">
                    {error}
                </div>
            ) : (
                <div className="mb-4">
                    <svg ref={svgRef} width="100%" height="250" />
                </div>
            )}
        </div>
    );
};

export default ReturnsPieChart;