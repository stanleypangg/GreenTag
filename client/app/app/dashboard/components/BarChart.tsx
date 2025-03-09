import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { FaRecycle, FaTrashAlt, FaCloud, FaTag, FaMoneyBill, FaHandHoldingHeart } from 'react-icons/fa';

interface BarChartDataPoint {
    label: string;
    yourCompany: number;
    industryAverage: number;
    icon: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
        title?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>>;
}

const BarChart = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [chartWidth, setChartWidth] = useState(600); // Reduced default width
    const [chartHeight, setChartHeight] = useState(350); // Reduced default height

    // Reduced data points to make chart skinnier
    const chartData: BarChartDataPoint[] = [
        { label: "Recycled", yourCompany: 71, industryAverage: 43, icon: FaRecycle },
        { label: "Diverted", yourCompany: 94, industryAverage: 69, icon: FaTrashAlt },
        { label: "Emissions", yourCompany: 79, industryAverage: 49, icon: FaCloud },
        { label: "Resold", yourCompany: 52, industryAverage: 21, icon: FaTag },
    ];

    // Update chart dimensions based on container size
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                // Set chart width to container width with more padding
                setChartWidth(Math.max(containerWidth - 60, 300));
                // Adjust height proportionally
                setChartHeight(Math.min(containerWidth * 0.6, 350));
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        const drawChart = () => {
            if (!svgRef.current) return;

            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove();  //Clear contents

            // Increased margins to prevent labels from being cut off
            const margin = { top: 40, right: 20, bottom: 80, left: 50 }; 
            const width = chartWidth - margin.left - margin.right;
            const height = chartHeight - margin.top - margin.bottom;

            const x = d3.scaleBand()
                .domain(chartData.map(d => d.label))
                .range([0, width])
                .padding(0.4);

            const barPadding = 0.1;
            const y = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);

            const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

            const barWidth = x.bandwidth() / 2 - barPadding;

            // Create the Your Company bars
            g.selectAll(".bar1")
                .data(chartData)
                .enter().append("rect")
                .attr("class", "bar1")
                .attr("x", d => (x(d.label) as number) - (x.bandwidth() / 4))
                .attr("y", d => y(d.yourCompany))
                .attr("width", barWidth)
                .attr("height", d => height - y(d.yourCompany))
                .attr("fill", "#7CB342");

            // Create the Industry Average bars
            g.selectAll(".bar2")
                .data(chartData)
                .enter().append("rect")
                .attr("class", "bar2")
                .attr("x", d => (x(d.label) as number) + (x.bandwidth() / 4))
                .attr("y", d => y(d.industryAverage))
                .attr("width", barWidth)
                .attr("height", d => height - y(d.industryAverage))
                .attr("fill", "#A9A9A9");

            // Add x-axis without labels
            g.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x).tickFormat(() => "")); // No labels here

            // Add the Y axis with fewer ticks
            g.append("g")
                .call(d3.axisLeft(y)
                    .ticks(5) // Reduced number of ticks
                    .tickFormat(d => `${d}%`));

            // Add custom text labels on x axis - smaller font and less rotation
            g.selectAll(".x-label")
                .data(chartData)
                .enter()
                .append("text")
                .attr("class", "x-label")
                .attr("x", d => (x(d.label) as number) + x.bandwidth() / 2)
                .attr("y", height + 15) // Position below x axis
                .attr("text-anchor", "middle")
                .attr("transform", d => `rotate(-30, ${(x(d.label) as number) + x.bandwidth() / 2}, ${height + 15})`)
                .text(d => d.label)
                .style("font-size", "11px");

            // Fix legend position - position it at the top of the chart
            const legend = svg.append("g")
                .attr("transform", `translate(${margin.left}, 15)`);

            // Legend - Your Company
            const companyLegend = legend.append("g");

            companyLegend.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 12)
                .attr("height", 12)
                .style("fill", "#7CB342");

            companyLegend.append("text")
                .attr("x", 18)
                .attr("y", 10)
                .text("Your Company")
                .style("font-size", "11px");

            // Legend - Industry Avg
            const industryLegend = legend.append("g")
                .attr("transform", `translate(100, 0)`); // Adjusted position

            industryLegend.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 12)
                .attr("height", 12)
                .style("fill", "#A9A9A9");

            industryLegend.append("text")
                .attr("x", 18)
                .attr("y", 10)
                .text("Industry Avg")
                .style("font-size", "11px");
        };

        drawChart();
    }, [chartData, chartWidth, chartHeight]);

    return (
        <div ref={containerRef} className="bg-white border border-gray-200 rounded-lg shadow-md w-full">
            {/* Added header */}
            <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-medium text-gray-800">Industry Overview</h3>
            </div>
            <div className="p-4 flex justify-center">
                <svg ref={svgRef} width={chartWidth} height={chartHeight}></svg>
            </div>
        </div>
    );
};

export default BarChart;