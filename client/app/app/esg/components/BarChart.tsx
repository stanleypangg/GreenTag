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
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [chartWidth, setChartWidth] = useState(700);
    const [chartHeight, setChartHeight] = useState(400);

    const chartData: BarChartDataPoint[] = [
        { label: "Recycled Products", yourCompany: 71, industryAverage: 43, icon: FaRecycle },
        { label: "Landfill Diversion", yourCompany: 94, industryAverage: 69, icon: FaTrashAlt },
        { label: "CO2 Emissions", yourCompany: 79, industryAverage: 49, icon: FaCloud },
        { label: "Items Resold", yourCompany: 52, industryAverage: 21, icon: FaTag },
        { label: "Revenue Recovery", yourCompany: 90, industryAverage: 54, icon: FaMoneyBill },
        { label: "Items Donated", yourCompany: 69, industryAverage: 38, icon: FaHandHoldingHeart },
    ];

    useEffect(() => {
        const drawChart = () => {
            if (!svgRef.current) return;

            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove();  //Clear contents

            const margin = { top: 20, right: 30, bottom: 100, left: 60 }; // Increased bottom margin for labels
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

            // Add the Y axis
            g.append("g")
                .call(d3.axisLeft(y)
                    .ticks(10)
                    .tickFormat(d => `${d}%`));

            // Add custom text labels on x axis
            g.selectAll(".x-label")
                .data(chartData)
                .enter()
                .append("text")
                .attr("class", "x-label")
                .attr("x", d => (x(d.label) as number) + x.bandwidth() / 2)
                .attr("y", height + 20) // Position below x axis
                .attr("text-anchor", "middle")
                .attr("transform", d => `rotate(-45, ${(x(d.label) as number) + x.bandwidth() / 2}, ${height + 20})`)
                .text(d => d.label)
                .style("font-size", "12px");

            // Move legend to the right side
            const legend = svg.append("g")
                .attr("transform", `translate(${width + margin.left - 160}, 20)`);

            // Legend - Your Company
            const companyLegend = legend.append("g")
                .attr("transform", `translate(0, 0)`);

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
                .style("font-size", "12px");

            // Legend - Industry Avg
            const industryLegend = legend.append("g")
                .attr("transform", `translate(120, 0)`); // Horizontal layout

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
                .style("font-size", "12px");
        };

        drawChart();
    }, [chartData, chartWidth, chartHeight]);

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md" style={{ width: 'fit-content' }}>
            <svg ref={svgRef} width={chartWidth} height={chartHeight}></svg>
        </div>
    );
};

export default BarChart;