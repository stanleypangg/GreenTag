import React from 'react';

interface ReturnItem {
	id: number;
	composition: string;
	score: number;
	status: string;
}

const ReturnsPage: React.FC = () => {
	// Example data
	const items: ReturnItem[] = [
		{ id: 222664, composition: '95% Cotton, 5% Elastane', score: 15.0, status: 'Recycle' },
		{ id: 473905, composition: '40% Wool, 60% Silk', score: 5.3, status: 'Recycle' },
		{ id: 193842, composition: '90% Cotton, 10% Spandex', score: 24.3, status: 'Donate' },
		{ id: 392472, composition: '70% Polyester, 25% Rayon', score: 10.2, status: 'Recycle' },
		{ id: 585269, composition: '80% Cotton, 20% Acrylic', score: 13.8, status: 'Resell' },
		{ id: 256713, composition: '70% Cotton, 30% Polyester', score: 9.2, status: 'Donate' },
		{ id: 920749, composition: '50% Acrylic, 50% Wool', score: 11.5, status: 'Resell' },
		{ id: 102384, composition: '20% Nylon, 80% Spandex', score: 4.5, status: 'Recycle' },
		{ id: 704915, composition: '100% Cotton', score: 2.5, status: 'Resell' },
		{ id: 385120, composition: '75% Linen, 25% Polyester', score: 18.1, status: 'Donate' },
	];

	return (
		<>
			<h2 className="text-2xl font-semibold mb-2">Returns Processed</h2>

			{/* Scrollable container for the table */}
			<div className="overflow-x-auto overflow-y-auto max-h-96 bg-white shadow rounded-lg">
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
							<th className="px-4 py-2 font-medium text-gray-700 text-left">Sustainability Score</th>
							<th className="px-4 py-2 font-medium text-gray-700 text-left">Status</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{items.map((item) => (
							<tr key={item.id}>
								<td className="px-4 py-2">{item.id}</td>
								<td className="px-4 py-2">{item.composition}</td>
								<td className="px-4 py-2">{item.score}</td>
								<td className="px-4 py-2">{item.status}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default ReturnsPage;
