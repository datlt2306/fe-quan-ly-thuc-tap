import { Fragment, memo, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import DesktopSidebar from "./components/DesktopSidebar";
import MobileSidebar from "./components/MobileSidebar";
import Navbar from "./components/Navbar";
import { UserRoleEnum } from "@/Core/constants/userRoles";
import {
	managerNavigation,
	staffNavigation,
	studentNavigation,
} from "./constants/navigationConstants";
import tw from "twin.macro";
import { useSelector } from "react-redux";
import ErrorBoundary from "@/Core/components/ErrorBoundary";

const Main = tw.div`lg:pl-72`;
const OutletWrapper = tw.div`py-10 px-4 sm:px-6 lg:px-8`;

const SidebarContent = tw.div`flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 py-4`;
const Image = (props) => <img {...props} tw="max-w-[10rem] object-contain translate-x-2" />;
const SidebarWrapper = tw.div`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col`;
const Navigation = tw.nav`flex flex-1 flex-col`;

const Page = memo(Outlet);

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
			default:
				return [];
		}
	}, [user]);

	return (
		<Fragment>
			{/* Drawer menu on mobile */}
			<MobileSidebar
				isOpen={sidebarOpen}
				onToggleSidebar={setSidebarOpen}
				navigation={navigation}
			/>
			{/* Static sidebar for desktop */}
			<DesktopSidebar navigation={navigation} />
			<Main>
				<Navbar onToggleSidebar={setSidebarOpen} navigation={navigation} />
				{/* Page content */}
				<OutletWrapper>
					<ErrorBoundary>
						<Page />
					</ErrorBoundary>
				</OutletWrapper>
			</Main>
		</Fragment>
	);
};

export { Image, SidebarContent, SidebarWrapper, Navigation };
export default MainLayout;
