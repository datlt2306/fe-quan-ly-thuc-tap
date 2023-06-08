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
import {
	adminNavigation,
	managerNavigation,
	staffNavigation,
	studentNavigation
} from './constants/navigationConstants';

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
			<MobileSidebar isOpen={sidebarOpen} onToggleSidebar={setSidebarOpen} navigation={navigation} />
			{/* Static sidebar for desktop */}
			<DesktopSidebar navigation={navigation} />
			<Main>
				<Navbar onToggleSidebar={setSidebarOpen} navigation={navigation} />
				{/* Page content */}
				<Main.Content>
					<Wrapper>
						<Suspense fallback={<LoadingProgressBar />}>
							<ErrorBoundary>
								<Outlet />
							</ErrorBoundary>
						</Suspense>
					</Wrapper>
				</Main.Content>
			</Main>
		</Fragment>
	);
};

const Main = tw.div`lg:pl-72 h-screen flex flex-col overflow-hidden`;
Main.Content = tw.div`py-10 px-4 sm:px-6 lg:px-8 h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-200`;
const SidebarContent = tw.div`flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 py-4`;
const Image = tw.img`max-w-[10rem] object-contain translate-x-2`;
const SidebarWrapper = tw.div`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col`;
const Navigation = tw.nav`flex flex-1 flex-col`;
const Wrapper = tw.div`min-h-fit`;

export { Image, SidebarContent, SidebarWrapper, Navigation };
export default MainLayout;
