import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import Logo from '/logo.png';

import classNames from 'classnames';
import { Image, Aside } from '..';
import { Fragment, useState } from 'react';

const DesktopSidebar = ({ navigation }) => {
	const navlinkClasses = (isActive) =>
		classNames('hover:bg-gray-100', {
			'flex items-center gap-2 p-2 ': true,
			'text-primary bg-gray-50': isActive,
			'text-base-content': !isActive
		});
	const [openItem, setOpenItem] = useState(null);

	const handleItemClick = (index) => {
		setOpenItem(openItem === index ? null : index);
	};
	return (
		<Aside>
			<Aside.Content>
				<Image src={Logo} alt='FPT Polytechnic' />

				<Menu
					as='div'
					className='grid gap-1 transition-all duration-500 [transition-timing-function:cubic-bezier(0,0.2,0.2,1)]'>
					{navigation.map((item) =>
						item.children ? (
							<Menu.Item key={item.name} className='ease rounded-md outline-none transition duration-200'>
								<Disclosure as='div'>
									<Disclosure.Button className='z-10 flex w-full items-center justify-between border-none p-2 text-gray-800 outline-none focus:border-none ui-open:bg-gray-50 hover:bg-gray-50'>
										<span className='flex flex-1 items-center gap-2 text-base-content'>
											<item.icon className='h-6 w-6' />
											{item.name}
										</span>

										<ChevronDownIcon className='h-4 w-4 transform text-base-content duration-200 ease-in-out ui-open:-rotate-180' />
									</Disclosure.Button>

									<Transition
										className='overflow-hidden'
										enter='transition-max-height duration-200 [transition-timing-function:cubic-bezier(0,0.2,0.2,1)]'
										enterFrom='max-h-0 opacity-0'
										enterTo='max-h-full'
										leave='transition-max-height duration-200 [transition-timing-function:cubic-bezier(0,0.2,0.2,1)]'
										leaveFrom='max-h-full'
										leaveTo='max-h-0'>
										<Disclosure.Panel
											className='z-0 bg-gray-50 p-1 transition-all duration-300'
											as={Menu.Items}>
											{item.children.map((child, index) => {
												return (
													child?.show && (
														<Menu.Item
															key={index}
															className='rounded-sm border-none py-2 pl-10 pr-2 outline-none transition-all duration-200 ease-in-out focus:border-none hover:bg-gray-200 focus:active:bg-gray-100'>
															<NavLink
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
								</Disclosure>
							</Menu.Item>
						) : (
							<Menu.Item as='div' key={item.name} className='rounded-md outline-none transition duration-200'>
								<NavLink to={item.path} className={({ isActive }) => navlinkClasses(isActive)}>
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
