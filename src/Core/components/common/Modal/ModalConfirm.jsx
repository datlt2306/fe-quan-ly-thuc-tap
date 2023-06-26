import { Fragment, memo, useCallback, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Button from '../Button';
import tw from 'twin.macro';
import Text from '../Text/Text';

const ModalConfirm = ({
	openState,
	title,
	message,
	onConfirm,
	onCancel,
	okText = 'Ok',
	cancelText = 'Cancel',
	modalIcon: Icon = ExclamationTriangleIcon
}) => {
	return (
		<Transition.Root show={openState} as={Fragment}>
			<Dialog as='div' className='relative z-[9999]' onClose={onCancel}>
				<Dialog.Backdrop />
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity' />
				</Transition.Child>

				<div className='fixed inset-0 z-10 overflow-y-auto'>
					<div className='flex min-h-full  items-center justify-center p-4 text-center sm:items-center sm:p-0'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
							<Dialog.Panel className='relative max-w-lg rounded-lg bg-white p-6'>
								<PanelContent>
									<div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-error bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10'>
										<Icon className='h-6 w-6 text-error' aria-hidden='true' />
									</div>
									<div className='flex-1 text-left sm:ml-4 sm:mt-0'>
										<Dialog.Title as='h3' className='text-base font-semibold leading-6 text-gray-900'>
											{title}
										</Dialog.Title>
										<Text className='whitespace-normal text-sm'>{message}</Text>
									</div>
								</PanelContent>
								<ActionList>
									<Button size='sm' type='button' variant='outline' onClick={onCancel}>
										{cancelText}
									</Button>
									<Button size='sm' type='button' variant='error' onClick={onConfirm}>
										{okText}
									</Button>
								</ActionList>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};
const PanelContent = tw.div`flex items-start justify-start w-full gap-6`;
const ActionList = tw.div`mt-5 flex justify-end gap-1`;

export default memo(ModalConfirm);
