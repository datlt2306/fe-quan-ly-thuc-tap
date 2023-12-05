import { UserRoleEnum } from '@/App/constants/userRoles';
import LoadingProgressBar from '@/Core/components/common/Loading/LoadingProgressBar';
import UnsupportScreen from '@/Core/components/customs/UnsupportScreen';
import ErrorBoundary from '@/Core/components/error/ErrorBoundary';
import { Fragment, Suspense, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import tw from 'twin.macro';
import DesktopSidebar from './components/DesktopSidebar';
import MobileSidebar from './components/MobileSidebar';
import Navbar from './components/Navbar';
import { adminNavigation, managerNavigation, staffNavigation, studentNavigation } from './config/navigation.config';
import { Main } from './components/Styled';

const MainLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const user = useSelector((state) => state.auth?.user);

	const navigation = useMemo(() => {
		switch (user.role) {
			case UserRoleEnum.STUDENT:
				return studentNavigation;
			case UserRoleEnum.STAFF:
				return staffNavigation;
			case UserRoleEnum.MANAGER:
				return managerNavigation;
			case UserRoleEnum.ADMIN:
				return adminNavigation;
			default:
				return [];
		}
	}, [user]);

	return (
		<Fragment>
			<UnsupportScreen />
			{/* Drawer menu on mobile */}
			<MobileSidebar open={sidebarOpen} onToggleSidebar={setSidebarOpen} navigation={navigation} />
			{/* Static sidebar for desktop */}
			<DesktopSidebar navigation={navigation} />
			<Main>
				<Navbar onToggleSidebar={setSidebarOpen} navigation={navigation} />
				{/* Page content */}
				<Main.Content>
					<Suspense fallback={<LoadingProgressBar />}>
						<ErrorBoundary>
							<Outlet />
						</ErrorBoundary>
					</Suspense>
				</Main.Content>
			</Main>
		</Fragment>
	);
};

export default MainLayout;
