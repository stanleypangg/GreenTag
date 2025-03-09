import React from 'react';
import { FaRecycle, FaTrashAlt, FaCloud, FaTag, FaMoneyBill, FaHandHoldingHeart, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const MetricTracker = () => {

  const metrics = [
    {
      title: "Percentage of Products Recycled",
      currentFigure: "69%",
      change: "2",
      isPositiveChange: true,
      icon: FaRecycle, //Recycle logo
    },
    {
      title: "Landfill Diversion Rate",
      currentFigure: "34%",
      change: "3",
      isPositiveChange: false,
      icon: FaTrashAlt, // Trash
    },
    {
      title: "CO2 Emissions From Disposal",
      currentFigure: "110.12 Tons",
      change: "1",
      isPositiveChange: false,
      icon: FaCloud, // Logo cloud
    },
    {
      title: "Percentage of Returned Items Resold",
      currentFigure: "19%",
      change: "6",
      isPositiveChange: true,
      icon: FaTag, // Tag
    },
    {
      title: "Resale Revenue Recovery Rate",
      currentFigure: "82%",
      change: "8",
      isPositiveChange: false,
      icon: FaMoneyBill, //Money
    },
    {
      title: "Percentage of Items Donated",
      currentFigure: "26%",
      change: "4",
      isPositiveChange: false,
      icon: FaHandHoldingHeart, // Donate
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Sustainability Metric Tracker</h2>
          <p className="text-sm text-green-600 mt-1 flex items-center">
            <FaArrowUp className="inline mr-1" />
            ~1.3% Improvement this month
          </p>
        </div>
        <div>
            {/* Add the three dots icon or menu here, if needed */}
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="font-semibold py-2">KEY PERFORMANCE INDICATORS</th>
            <th className="font-semibold py-2">CURRENT FIGURE</th>
            <th className="font-semibold py-2">% CHANGE</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric, index) => (
            <tr key={index} className="border-b border-gray-200 last:border-b-0">
              <td className="py-3 flex items-center">
                <metric.icon className="mr-2 text-gray-600" size="1.2em" />
                {metric.title}
              </td>
              <td className="py-3 text-gray-700">{metric.currentFigure}</td>
              <td className="py-3 flex items-center">
                <span className={metric.isPositiveChange ? "text-green-600" : "text-red-600"}>
                  {metric.change}%
                </span>
                {metric.isPositiveChange ? (
                  <FaArrowUp className="ml-1 text-green-600" />
                ) : (
                  <FaArrowDown className="ml-1 text-red-600" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MetricTracker;