import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import DesktopSidebar from './components/DesktopSidebar';
import MobileSidebar from './components/MobileSidebar';
import Navbar from './components/Navbar';
import { UserRoleEnum } from '@/Core/constants/userRoles.enum';
import { staffNavigation, studentNavigation } from './constants/userPermissions.const';

export function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

export default function MainLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const currentUser = {
		role: UserRoleEnum.STUDENT,
	};
	const navigation = useMemo(() => {
		switch (currentUser.role) {
			case UserRoleEnum.STUDENT:
				return studentNavigation;
			case UserRoleEnum.STAFF:
				return staffNavigation;
			default:
				return [];
		}
	}, [currentUser]);
	console.log(navigation);
	return (
		<div>
			<MobileSidebar isOpen={sidebarOpen} onToggleSidebar={setSidebarOpen} navigation={navigation} />
			{/* Static sidebar for desktop */}
			<DesktopSidebar navigation={navigation} />

			<div className="lg:pl-72">
				<header>
					<Navbar onToggleSidebar={setSidebarOpen} />
				</header>
				<main className="py-10">
					<div className="px-4 sm:px-6 lg:px-8">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
