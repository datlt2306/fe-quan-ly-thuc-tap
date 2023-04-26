import { Menu, Transition } from "@headlessui/react";
import {
	ArrowLeftOnRectangleIcon,
	Bars3Icon,
	BellIcon,
	ChevronDownIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import React, { Fragment } from "react";
import tw from "twin.macro";
import { classNames } from "..";
import { Link } from "react-router-dom";
import Button from "@/Core/components/common/Button";

const userNavigation = [{ name: "", path: "/signout" }];

const StickyHeader = tw.div`sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8`;
const Avatar = tw.img`h-8 w-8 rounded-full bg-gray-50`;
const Separator = tw.div`hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200`;
const SidebarToggler = tw.button`-m-2.5 p-2.5 text-gray-700 lg:hidden`;

const Navbar = ({ onToggleSidebar }) => {
	return (
		<StickyHeader>
			<SidebarToggler onClick={() => onToggleSidebar(true)}>
				<Bars3Icon className="h-6 w-6" aria-hidden="true" />
			</SidebarToggler>

			{/* Separator */}
			<Separator aria-hidden="true" />

			<div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
				<form className="relative flex flex-1" action="#" method="GET">
					<label htmlFor="search-field" className="sr-only">
						Search
					</label>
					<MagnifyingGlassIcon
						className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
						aria-hidden="true"
					/>
					<input
						id="search-field"
						className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
						placeholder="Search..."
						type="search"
						name="search"
					/>
				</form>
				<div className="flex items-center gap-x-4 lg:gap-x-6">
					{/* Profile dropdown */}
					<Menu as="div" className="relative">
						<Menu.Button className="-m-1.5 flex items-center p-1.5">
							<Avatar
								className="h-8 w-8 rounded-full bg-gray-50"
								src="https://ui-avatars.com/api/?background=random&name=A"
								alt="picture"
							/>
							<span className="hidden lg:flex lg:items-center">
								<span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
									Admin
								</span>
								<ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
							</span>
						</Menu.Button>
						<Transition
							as={Fragment}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95">
							<Menu.Items className="absolute right-0 z-10 mt-2.5 w-fit origin-top-right rounded-md bg-white p-1 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
								{({ active }) => (
									<button
										className={`${
											active ? "bg-primary text-white" : "text-gray-900"
										} group flex w-full items-center gap-2 rounded-md p-2 text-sm duration-200 hover:bg-gray-100`}>
										<ArrowLeftOnRectangleIcon className="h-5 w-5 text-gray-700" /> Đăng xuất
									</button>
								)}
							</Menu.Items>
						</Transition>
					</Menu>
				</div>
			</div>
		</StickyHeader>
	);
};

export default Navbar;
