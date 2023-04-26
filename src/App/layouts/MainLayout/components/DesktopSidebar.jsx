import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import React from "react";
import Logo from "/logo.svg";
import { classNames } from "..";
import tw from "twin.macro";
import { NavLink } from "react-router-dom";
import { Menu } from "@headlessui/react";

const Container = tw.div`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col`;
const SidebarWrapper = tw.div`flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4`;
const SideBarMenu = tw.ul`-mx-2 space-y-1 gap-2`;
const Image = (props) => <img {...props} tw="max-w-[160px] object-contain" />;
const Navigation = tw.nav`flex flex-1 flex-col`;

const DesktopSidebar = ({ navigation }) => {
	return (
		<Container>
			<SidebarWrapper>
				<Image src={Logo} alt="FPT Polytechnic" />

				<Navigation>
					<Menu>
						{navigation.map((item) => (
							<Menu.Item key={item.label}>
								<NavLink
									to={item.path}
									className={({ isActive }) => {
										return isActive
											? "flex items-center gap-2 bg-gray-100 p-2 text-primary"
											: "flex items-center gap-2 p-2 text-gray-500 hover:bg-gray-50";
									}}>
									<item.icon className="h-6 w-6 shrink-0 text-[inherit]" aria-hidden="true" />
									{item.label}
								</NavLink>
							</Menu.Item>
						))}
					</Menu>
					<SideBarMenu role="list"></SideBarMenu>
				</Navigation>
			</SidebarWrapper>
		</Container>
	);
};

export default DesktopSidebar;
