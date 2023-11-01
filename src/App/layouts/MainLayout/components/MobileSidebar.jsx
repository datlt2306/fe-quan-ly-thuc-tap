import Button from '@/Core/components/common/Button';
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import tw from 'twin.macro';
import { Aside, Image } from '..';
import Logo from '/logo.png';

const Overlay = tw.div`fixed inset-0 bg-gray-800/80`;

const MobileSidebar = ({ isOpen = false, onToggleSidebar: handleShowSlideOver, navigation }) => {
	const navlinkClasses = (isActive) =>
		classNames('hover:bg-gray-100', {
			'flex items-center gap-2 p-2 ': true,
			'text-primary bg-gray-50': isActive,
			'text-base-content': !isActive
		});

	return (
		<Transition.Root show={isOpen} as={Fragment}>
			<Dialog as='div' className='relative z-50 lg:hidden' onClose={() => handleShowSlideOver(!isOpen)}>
				<Transition.Child
					as={Fragment}
					enter='transition-opacity ease-linear duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='transition-opacity ease-linear duration-300'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<Overlay />
				</Transition.Child>

				<div className='fixed inset-0 flex'>
					<Transition.Child
						as={Fragment}
						enter='transition ease-in-out duration-300 transform'
						enterFrom='-translate-x-full'
						enterTo='translate-x-0'
						leave='transition ease-in-out duration-300 transform'
						leaveFrom='translate-x-0'
						leaveTo='-translate-x-full'>
						<Dialog.Panel className='relative mr-16 flex w-full max-w-xs flex-1'>
							<Transition.Child
								as={Fragment}
								enter='ease-in-out duration-300'
								enterFrom='opacity-0'
								enterTo='opacity-100'
								leave='ease-in-out duration-300'
								leaveFrom='opacity-100'
								leaveTo='opacity-0'>
								<div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
									<Button
										shape='circle'
										variant='ghost'
										className='text-white hover:text-base-content '
										onClick={() => handleShowSlideOver(!isOpen)}>
										<XMarkIcon className='h-6 w-6' />
									</Button>
								</div>
							</Transition.Child>
							{/* Sidebar component, swap this element with another sidebar if you like */}
							<Aside.Content>
								<Image src={Logo} />

								<Menu as='div' className='grid gap-1'>
									{navigation.map((item) =>
										item.children ? (
											<Menu.Item key={item.name} className='rounded-md'>
												<Disclosure as='div'>
													<Disclosure.Button className='z-10 flex w-full items-center justify-between p-2 text-gray-800 ui-open:bg-gray-50 hover:bg-gray-50'>
														<span className='flex flex-1 items-center gap-2 text-base-content'>
															<item.icon className='h-6 w-6' />
															{item.name}
														</span>
														<ChevronDownIcon className='ui-open:tranform h-4 w-4 rotate-180 transform text-base-content duration-200 ease-in-out' />
													</Disclosure.Button>
													<Transition
														className='overflow-hidden'
														enter='transition-max-height duration-200 [transition-timing-function:cubic-bezier(0,0.2,0.2,1)]'
														enterFrom='max-h-0 opacity-0'
														enterTo='max-h-full'
														leave='transition-max-height duration-200 [transition-timing-function:cubic-bezier(0,0.2,0.2,1)]'
														leaveFrom='max-h-full'
														leaveTo='max-h-0'>
														<Disclosure.Panel className='z-0 bg-gray-50 ' as={Menu.Items}>
															{item.children.map((child, index) => {
																return (
																	child?.show === true && (
																		<Menu.Item
																			key={index}
																			className='py-2 pl-10 pr-2 transition-[height_350ms_ease-in-out_transform] duration-300 hover:bg-gray-100 focus:active:bg-gray-100'
																			onClick={() => handleShowSlideOver(!isOpen)}>
																			<NavLink
																				to={child.path}
																				className={({ isActive }) => navlinkClasses(isActive)}>
																				<child.icon className='h-6 w-6  shrink-0 text-[inherit]' />{' '}
																				{child.name}
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
											<Menu.Item
												key={item.name}
												className='rounded-md'
												onClick={() => handleShowSlideOver(!isOpen)}>
												<NavLink to={item.path} className={({ isActive }) => navlinkClasses(isActive)}>
													<item.icon className='h-6 w-6 shrink-0 text-[inherit]' aria-hidden='true' />
													{item.name}
												</NavLink>
											</Menu.Item>
										)
									)}
								</Menu>
							</Aside.Content>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default MobileSidebar;
