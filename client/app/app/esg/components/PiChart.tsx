import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FaRecycle, FaHandHoldingHeart, FaTag, FaMoneyBill } from 'react-icons/fa';

interface EsgScoreData {
    score: number;
    recycledPercent: number;
    donatedPercent: number;
    resoldPercent: number;
    revenueRecoveryPercent: number;
}

const PiChart = () => {
    // Placeholder values
    const [esgData, setEsgData] = useState<EsgScoreData>({
        score: 78,
        recycledPercent: 82,
        donatedPercent: 76,
        resoldPercent: 81,
        revenueRecoveryPercent: 73
    });

    const svgRef = useRef<SVGSVGElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    //Responsive size Management
    const [chartWidth, setChartWidth] = useState(250);
    const [chartHeight, setChartHeight] = useState(250);

    useEffect(() => {
        const handleResize = () => {
            if (wrapperRef.current) {
                const containerWidth = wrapperRef.current.clientWidth - 20;
                const containerHeight = wrapperRef.current.clientHeight - 20;
                
                // Use the smaller dimension to ensure the chart is properly sized
                const size = Math.min(containerWidth, containerHeight, 250);
                
                setChartWidth(size);
                setChartHeight(size);
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous chart

        const width = chartWidth;
        const height = chartHeight;
        const radius = Math.min(width, height) / 2;

        // Arc generator
        const arc = d3.arc()
            .innerRadius(radius * 0.7)
            .outerRadius(radius)
            .startAngle(-Math.PI / 2);

        // Define the color scale
        const colorScale = d3.scaleOrdinal()
            .domain(["complete", "remaining"])
            .range(["#7CB342", "#F1F8E9"]); // Green hues

        // Calculate angles for the arcs
        const backgroundArcAngle = Math.PI * 2;

        // Create a group to hold the chart
        const chartGroup = svg.append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // Append the background arc (the lighter grey)
        chartGroup.append("path")
            .datum({ endAngle: backgroundArcAngle })
            .style("fill", colorScale("remaining"))
            .attr("d", arc as any);

        // Append the foreground arc (the green)
        chartGroup.append("path")
            .datum({ endAngle: (esgData.score/100) * 2 * Math.PI - Math.PI /2 })
            .style("fill", colorScale("complete"))
            .attr("d", arc as any);

        // Add the score text in the center of the donut
        chartGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .style("font-size", "1.5em")
            .style("font-weight", "bold")
            .style("fill", "#374151") // Dark gray
            .text(`${esgData.score}/100`);

    }, [esgData, chartWidth, chartHeight]);

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md w-full h-full p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-3">Sustainability Score</h2>
            
            <div className="flex flex-row flex-1 overflow-hidden" ref={wrapperRef}>
                <div className="flex-shrink-0 relative">
                    <svg ref={svgRef} width={chartWidth} height={chartHeight}></svg>
                </div>

                <div className="flex flex-col justify-around ml-4 overflow-auto">
                    <h3 className="text-base font-semibold text-gray-800 mb-2">Key Contributors</h3>

                    <div className="flex items-center mb-2">
                        <FaRecycle className="text-green-500 mr-2" size="1.2em" />
                        <div>
                            <div className="font-semibold">{esgData.recycledPercent}% of Recycled Products</div>
                            <div className="text-sm text-gray-500">% of recycled-flagged returns that were recycled</div>
                        </div>
                    </div>

                    <div className="flex items-center mb-2">
                        <FaHandHoldingHeart className="text-pink-500 mr-2" size="1.2em" />
                        <div>
                            <div className="font-semibold">{esgData.donatedPercent}% Donated Products</div>
                            <div className="text-sm text-gray-500">% of donation-flagged returns that were donated</div>
                        </div>
                    </div>

                    <div className="flex items-center mb-2">
                        <FaTag className="text-blue-500 mr-2" size="1.2em" />
                        <div>
                            <div className="font-semibold">{esgData.resoldPercent}% Returned Items Resold</div>
                            <div className="text-sm text-gray-500">% of resell-flagged returns that were resold</div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <FaMoneyBill className="text-green-600 mr-2" size="1.2em" />
                        <div>
                            <div className="font-semibold">{esgData.revenueRecoveryPercent}% Revenue Recovery</div>
                            <div className="text-sm text-gray-500">% of revenue that was recovered through resales</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PiChart;