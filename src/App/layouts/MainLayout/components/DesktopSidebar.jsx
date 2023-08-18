import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import Logo from '/logo.png';

import classNames from 'classnames';
import { Image, Navigation, SidebarContent, SidebarWrapper } from '..';
import { Fragment } from 'react';

const DesktopSidebar = ({ navigation }) => {
	const navlinkClasses = (isActive) =>
		classNames({
			'flex items-center gap-2 p-2 hover:bg-gray-100': true,
			'text-primary bg-gray-50 hover:bg-gray-100': isActive,
			'text-base-content': !isActive
		});

	return (
		<SidebarWrapper>
			<SidebarContent>
				<Image src={Logo} alt='FPT Polytechnic' />

				<Navigation>
					<Menu>
						{navigation.map((item) =>
							item.children ? (
								<Menu.Item key={item.name} className='rounded-md outline-none'>
									<Disclosure as='div'>
										{({ open }) => {
											return (
												<Fragment>
													<Disclosure.Button
														className={classNames(
															'z-10 flex w-full items-center justify-between border-none p-2 text-gray-800 outline-none focus:border-none hover:bg-gray-100',
															{
																'bg-gray-50': open
															}
														)}>
														<span className='flex flex-1 items-center gap-2 text-base-content'>
															<item.icon className='h-6 w-6' />
															{item.name}
														</span>

														<ChevronDownIcon
															className={classNames(
																'h-4 w-4 transform text-base-content duration-300 ease-in-out',
																{
																	'tranform rotate-180': open
																}
															)}
														/>
													</Disclosure.Button>
													<Transition
														enter='transition duration-500 transform'
														enterFrom='opacity-0 -translate-y-2'
														enterTo='opacity-100 translate-y-0'
														leave='transition duration-150 transform'
														leaveFrom='opacity-100 translate-y-0'
														leaveTo='opacity-0 -translate-y-2 blur-lg'>
														<Disclosure.Panel className='z-0 bg-gray-50' as={Menu.Items}>
															{item.children.map((child, index) => {
																return (
																	child?.show === true && (
																		<Menu.Item
																			key={index}
																			className='h-fit border-none py-2 pl-10 pr-2 outline-none duration-200 focus:border-none hover:bg-gray-100 focus:active:bg-gray-100'>
																			<NavLink
																				to={child.path}
																				className={({ isActive }) => navlinkClasses(isActive)}>
																				<child.icon className='h-[18px] w-[18px]' /> {child.name}
																			</NavLink>
																		</Menu.Item>
																	)
																);
															})}
														</Disclosure.Panel>
													</Transition>
												</Fragment>
											);
										}}
									</Disclosure>
								</Menu.Item>
							) : (
								<Menu.Item key={item.name} className='rounded-md outline-none duration-200'>
									<NavLink to={item.path} className={({ isActive }) => navlinkClasses(isActive)}>
										<item.icon className='h-6 w-6 shrink-0 text-[inherit]' aria-hidden='true' />
										{item.name}
									</NavLink>
								</Menu.Item>
							)
						)}
					</Menu>
				</Navigation>
			</SidebarContent>
		</SidebarWrapper>
	);
};

export default DesktopSidebar;
