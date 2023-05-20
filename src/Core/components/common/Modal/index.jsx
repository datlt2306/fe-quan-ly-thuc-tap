import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Button from '../Button';

export default function Modal({ openState, onOpenStateChange, title, children }) {
	return (
		<Transition appear show={openState} as={Fragment}>
			<Dialog as='div' className='relative z-[9999]' onClose={() => onOpenStateChange(false)}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-gray-800 bg-opacity-80' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4 text-center'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'>
							<Dialog.Panel className='relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
								{!!title && (
									<Dialog.Title as='h3' className='mb-6 text-lg font-medium leading-6 text-gray-900'>
										{title}
									</Dialog.Title>
								)}

								{children}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
