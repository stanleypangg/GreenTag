// components/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	FiHome,
	FiBarChart2,
	FiCreditCard,
	FiRepeat,
	FiUser,
	FiLogIn,
} from 'react-icons/fi';

interface NavItem {
	name: string;
	icon: React.ReactNode;
	href: string;
}

const Sidebar: React.FC = () => {
	const pathname = usePathname();

	const navItems: NavItem[] = [
		{ name: 'Dashboard', icon: <FiHome />, href: '/app/dashboard' },
		{ name: 'Returns', icon: <FiBarChart2 />, href: '/app/returns' },
		{ name: 'ESG', icon: <FiCreditCard />, href: '/app/esg' },
		{ name: 'Routing', icon: <FiRepeat />, href: '/app/routing' },
	];

	const accountItems: NavItem[] = [
		{ name: 'Profile', icon: <FiUser />, href: '#' },
		{ name: 'Sign In', icon: <FiLogIn />, href: '#' },
	];

	return (
		<aside className="w-64 bg-gray-[#F8F9FA] flex flex-col text-gray-700">
			<nav className="flex-1 px-4 py-6">
				<ul className="space-y-2">
					{navItems.map((item) => {
						const isActive = pathname === item.href;

						return (
							<li key={item.name}>
								<Link
									href={item.href}
									className={`
										flex items-center px-4 py-2 space-x-3 rounded-lg text-sm font-medium
										${
											isActive
												? 'bg-white shadow text-gray-900'
												: 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
										}
									`}
								>
									<span className="text-xl">{item.icon}</span>
									<span>{item.name}</span>
								</Link>
							</li>
						);
					})}
				</ul>

				<div className="text-xs text-gray-400 uppercase mt-8 mb-2 tracking-wider">
					Account Pages
				</div>
				<ul className="space-y-2">
					{accountItems.map((item) => {
						const isActive = pathname === item.href;

						return (
							<li key={item.name}>
								<Link
									href={item.href}
									className={`
										flex items-center px-4 py-2 space-x-3 rounded-lg text-sm font-medium
										${
											isActive
												? 'bg-white shadow text-gray-900'
												: 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
										}
									`}
								>
									<span className="text-xl">{item.icon}</span>
									<span>{item.name}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			<div className="m-4 p-4 rounded-lg bg-green-50 text-center">
				<p className="font-semibold text-sm mb-2">Need help?</p>
				<button className="bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-600">
					Documentation
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
