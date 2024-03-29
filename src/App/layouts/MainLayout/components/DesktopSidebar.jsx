import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import Logo from '/logo.png';
import classNames from 'classnames';
import { Fragment, useState } from 'react';
import { Aside, Image } from './Styled';

const navlinkClasses = (isActive) =>
	classNames({
		'flex items-center gap-2 p-2 ': true,
		'text-primary': isActive,
		'text-base-content': !isActive
	});

const DesktopSidebar = ({ navigation }) => {
	return (
		<Aside>
			<Aside.Content>
				<Image src={Logo} alt='FPT Polytechnic' role='img' />
				<Menu as='div' role='menu' className='flex min-h-fit flex-col gap-1'>
					{navigation
						.filter((item) => item.show !== false)
						.map((item) =>
							Array.isArray(item.children) ? (
								<Disclosure key={item.name} as={Menu.Item} className='overflow-hidden rounded-md outline-none'>
									<Fragment>
										<Disclosure.Button className='z-10 flex w-full items-center justify-between rounded-md border-none p-2 text-gray-800 outline-none duration-300 focus:border-none hover:bg-gray-100'>
											<span className='flex flex-1 items-center gap-2 text-base-content'>
												<item.icon className='h-6 w-6' />
												{item.name}
											</span>

											<ChevronDownIcon className='h-4 w-4 transform text-base-content duration-300 ease-in-out ui-open:-rotate-180' />
										</Disclosure.Button>

										<Transition
											className='-translate-y-1 overflow-hidden'
											enter='transition-max-height duration-300 ease-in'
											enterFrom='max-h-0'
											enterTo='max-h-full'
											leave='transition-max-height duration-300 ease-out'
											leaveFrom='max-h-full'
											leaveTo='max-h-0'>
											<Disclosure.Panel static>
												{item.children.map((child, index) => {
													return (
														child?.show && (
															<Menu.Item
																key={index}
																className='rounded-sm border-none py-2 pl-10 pr-2 outline-none transition-all duration-200 ease-in-out focus:border-none hover:bg-gray-100'>
																<NavLink
																	role='link'
																	to={child.path}
																	className={({ isActive }) => navlinkClasses(isActive)}>
																	<child.icon className='h-6 w-6' /> {child.name}
																</NavLink>
															</Menu.Item>
														)
													);
												})}
											</Disclosure.Panel>
										</Transition>
									</Fragment>
								</Disclosure>
							) : (
								<Menu.Item
									key={item.name}
									className='overflow-hidden rounded-md outline-none transition duration-500 hover:bg-gray-100'>
									<NavLink to={item.path} role='link' className={({ isActive }) => navlinkClasses(isActive)}>
										<item.icon className='h-6 w-6 shrink-0 text-[inherit]' aria-hidden='true' />
										{item.name}
									</NavLink>
								</Menu.Item>
							)
						)}
				</Menu>
			</Aside.Content>
		</Aside>
	);
};

export default DesktopSidebar;
