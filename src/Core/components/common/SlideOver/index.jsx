import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '@/Core/components/common/Button';

export default function SlideOver({ open, onOpen, children, panelTitle }) {
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as='div' className='relative z-50' onClose={onOpen}>
				<Transition.Child
					as={Fragment}
					enter='ease-in-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in-out duration-300'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-hidden'>
					<div className='absolute inset-0 overflow-hidden'>
						<div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
							<Transition.Child
								as={Fragment}
								enter='transform transition ease-in-out duration-300 sm:duration-700'
								enterFrom='translate-x-full'
								enterTo='translate-x-0'
								leave='transform transition ease-in-out duration-300 sm:duration-700'
								leaveFrom='translate-x-0'
								leaveTo='translate-x-full'>
								<Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
									<div className='flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl'>
										<div className='px-4 sm:px-6'>
											<div className='flex items-start justify-between'>
												<Dialog.Title className='text-xl font-semibold leading-6 text-gray-900'>
													{panelTitle || 'Panel title'}
												</Dialog.Title>
												<div className='ml-3 flex h-7 items-center'>
													<Button type='button' shape='circle' variant='ghost' onClick={() => onOpen(false)}>
														<XMarkIcon className='h-4 w-4' aria-hidden='true' />
													</Button>
												</div>
											</div>
										</div>
										<div className='relative mt-6 flex-1 px-4 sm:px-6'>{children}</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
