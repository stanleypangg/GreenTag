import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ChartDataPoint {
    month: string;
    Donate_percent: number;
    Resell_percent: number;
    Recycle_percent: number;
}

type LineType = 'Donate' | 'Resell' | 'Recycle';

const LineChart = () => {
    const [data, setData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLine, setSelectedLine] = useState<LineType>('Donate');
    const svgRef = useRef<SVGSVGElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    // Responsive chart size management
    const [chartWidth, setChartWidth] = useState(600);
    const [chartHeight, setChartHeight] = useState(350);

    // Colors from the reference image (approximate)
    const lineColor = '#6B8E23'; // Olive green line
    const axisColor = '#D3D3D3'; // Light gray axis

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:8080/item_stats');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();

                // Ensure we have chart data
                if (result.chart_data && Array.isArray(result.chart_data)) {
                    setData(result.chart_data);
                } else {
                    // Create some placeholder data if none is returned from the API
                    setData(generatePlaceholderData());
                }
            } catch (e: any) {
                console.error("Failed to fetch data", e);
                setError(e.message);
                // Use placeholder data when an error occurs
                setData(generatePlaceholderData());
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Generate placeholder data for development/testing
    const generatePlaceholderData = (): ChartDataPoint[] => {
        const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'];
        return months.map(month => ({
            month,
            Donate_percent: Math.random() * 40 + 30,
            Resell_percent: Math.random() * 40 + 20,
            Recycle_percent: Math.random() * 40 + 10
        }));
    };

    // Update chart dimensions on resize
    useEffect(() => {
        const handleResize = () => {
            if (wrapperRef.current) {
                const width = wrapperRef.current.clientWidth - 20; // Subtract padding
                const height = wrapperRef.current.clientHeight - 60; // Subtract header and padding
                setChartWidth(width);
                setChartHeight(height);
            }
        };

        // Initial size calculation
        handleResize();
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Chart drawing effect
    useEffect(() => {
        if (!data || data.length === 0 || !svgRef.current) {
            return;
        }

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous chart

        const margin = { top: 20, right: 30, bottom: 50, left: 60 };
        const width = chartWidth - margin.left - margin.right;
        const height = chartHeight - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        // Sort data by date to ensure proper line drawing
        const sortedData = [...data].sort((a, b) =>
            new Date(a.month + '-01').getTime() - new Date(b.month + '-01').getTime()
        );

        // Convert string months to Date objects for better handling
        const dateData = sortedData.map(d => ({
            date: d3.timeParse("%Y-%m")(d.month) as Date,
            Donate_percent: d.Donate_percent,
            Resell_percent: d.Resell_percent,
            Recycle_percent: d.Recycle_percent
        }));

        // Create a time scale for the x-axis with a continuous domain (daily)
        const xExtent = d3.extent(dateData, d => d.date) as [Date, Date];

        // Extend the domain by a few days on each end for padding
        const xMin = new Date(xExtent[0]);
        xMin.setDate(xMin.getDate() - 5);
        const xMax = new Date(xExtent[1]);
        xMax.setDate(xMax.getDate() + 5);

        const x = d3.scaleTime()
            .domain([xMin, xMax])
            .range([0, width]);

        // Fixed y-axis range from 0 to 100
        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        // Define the curve type for a smoother line
        const curveType = d3.curveMonotoneX; // Creates a smooth curve that respects monotonicity

        // Define the line generator based on selected line type
        const line = d3.line<any>()
            .x(d => x(d.date))
            .y(d => {
                switch (selectedLine) {
                    case 'Donate': return y(d.Donate_percent);
                    case 'Resell': return y(d.Resell_percent);
                    case 'Recycle': return y(d.Recycle_percent);
                    default: return y(0);
                }
            })
            .curve(curveType); // Use the smooth curve type

        // Define colors for each line type
        const getLineColor = (type: LineType): string => {
            switch (type) {
                case 'Donate': return "#4F46E5"; // Indigo
                case 'Resell': return "#10B981"; // Emerald
                case 'Recycle': return "#8B5CF6"; // Violet
                default: return "#000000";
            }
        };

        // Add x-axis with month formatting - just show month names at regular intervals
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x)
                .ticks(d3.timeMonth.every(1)) // Ensure a tick for each month
                .tickFormat(d3.timeFormat("%b"))) // Format to show abbreviated month (Jan, Feb, etc.)
            .selectAll("text")
            .style("text-anchor", "middle");

        // Add x-axis gridlines
        g.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x)
                .ticks(d3.timeMonth.every(1))
                .tickSize(-height)
                .tickFormat(() => ""))
            .selectAll("line")
            .style("stroke", "#e0e0e0")
            .style("stroke-opacity", 0.7);

        // Add y-axis with percentage formatting
        g.append("g")
            .call(d3.axisLeft(y)
                .ticks(10)
                .tickFormat(d => `${d}%`));

        // Add y-axis gridlines
        g.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y)
                .ticks(10)
                .tickSize(-width)
                .tickFormat(() => ""))
            .selectAll("line")
            .style("stroke", "#e0e0e0")
            .style("stroke-opacity", 0.7);

        // Add a subtle gradient under the line
        const gradientId = `line-gradient-${selectedLine.toLowerCase()}`;

        // Define gradient
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", gradientId)
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", getLineColor(selectedLine))
            .attr("stop-opacity", 0.4);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", getLineColor(selectedLine))
            .attr("stop-opacity", 0.0);

        // Create the area generator
        const area = d3.area<any>()
            .x(d => x(d.date))
            .y0(height)
            .y1(d => {
                switch (selectedLine) {
                    case 'Donate': return y(d.Donate_percent);
                    case 'Resell': return y(d.Resell_percent);
                    case 'Recycle': return y(d.Recycle_percent);
                    default: return y(0);
                }
            })
            .curve(curveType);

        // Add the area
        g.append("path")
            .datum(dateData)
            .attr("fill", `url(#${gradientId})`)
            .attr("d", area);

        // Draw the selected line
        g.append("path")
            .datum(dateData)
            .attr("fill", "none")
            .attr("stroke", getLineColor(selectedLine))
            .attr("stroke-width", 3)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);

        // Add dots for each data point
        g.selectAll(".dot")
            .data(dateData)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.date))
            .attr("cy", d => {
                switch (selectedLine) {
                    case 'Donate': return y(d.Donate_percent);
                    case 'Resell': return y(d.Resell_percent);
                    case 'Recycle': return y(d.Recycle_percent);
                    default: return y(0);
                }
            })
            .attr("r", 5)
            .attr("fill", "#ffffff")
            .attr("stroke", getLineColor(selectedLine))
            .attr("stroke-width", 2)
            .style("cursor", "pointer")
            .append("title")
            .text(d => {
                let value = 0;
                const formattedDate = d3.timeFormat("%B %Y")(d.date);
                switch (selectedLine) {
                    case 'Donate': value = d.Donate_percent; break;
                    case 'Resell': value = d.Resell_percent; break;
                    case 'Recycle': value = d.Recycle_percent; break;
                }
                return `${formattedDate}: ${value.toFixed(1)}%`;
            });

    }, [data, chartWidth, chartHeight, selectedLine]); // Redraw when data, size, or selected line changes

    // Handle line selection change
    const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLine(e.target.value as LineType);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md w-full h-full flex flex-col p-4">
            <h2 className="text-lg font-semibold mb-2">Trend Analysis</h2>
            
            <div className="mb-2">
                <select
                    id="line-select"
                    value={selectedLine}
                    onChange={handleLineChange}
                    className="block w-40 pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                >
                    <option value="Donate">Donate</option>
                    <option value="Resell">Resell</option>
                    <option value="Recycle">Recycle</option>
                </select>
            </div>

            <div 
                className="flex-grow relative" 
                ref={wrapperRef}
            >
                {loading && <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>}

                {error && <div className="text-red-500 text-center p-4 bg-red-50 rounded-md border border-red-200">
                    Error loading chart data: {error}
                </div>}

                {!loading && !error && (
                    <svg
                        ref={svgRef}
                        width={chartWidth}
                        height={chartHeight}
                        className="bg-white rounded-lg"
                    >
                    </svg>
                )}
            </div>
        </div>
    );
};

export default LineChart;