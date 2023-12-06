import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import { InboxIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';
import Button from '../Button';

/**
 *
 * @typedef TNotificationProps
 * @prop {boolean} open
 * @prop {React.Dispatch<React.SetStateAction<boolean>>}onOpenStateChange
 * @prop {(...args: any[])=> unknown} onOk
 * @prop {React.ElementType} icon
 * @prop {string} okText
 * @prop {string}dismissText
 * @prop {string} message
 * @prop {string} title
 */

/** @type {React.FC<TNotificationProps>} */
const NotificationWithAction = (props) => {
	return (
		<>
			{/* Global notification live region, render this permanently at the end of the document */}
			<div
				aria-live='assertive'
				className='pointer-events-none fixed bottom-1 right-0 z-50 w-full max-w-sm items-end px-4 py-6 sm:items-start sm:p-6'>
				<div className='flex w-full flex-col items-center space-y-4 sm:items-end'>
					{/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
					<Transition
						show={props.open}
						as={Fragment}
						enter='transform ease-out duration-300 transition'
						enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
						enterTo='translate-y-0 opacity-100 sm:translate-x-0'
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'>
						<div className='pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5'>
							<div className='p-4'>
								<div className='flex items-start'>
									<div className='flex-shrink-0'>
										<props.icon className='h-6 w-6 text-gray-400' aria-hidden='true' />
									</div>
									<div className='ml-3 w-0 flex-1 pt-0.5'>
										<p className='text-sm font-medium text-gray-900'>{props.title}</p>
										<p className='mt-1 text-sm text-gray-500'>{props.message}</p>
										<div className='mt-3 flex space-x-1'>
											<Button
												variant='outline'
												size='xs'
												text={props.okText}
												onClick={() => {
													if (props.onOk) props.onOk();
													props.onOpenStateChange(!props.open);
												}}
											/>
											<Button
												variant='ghost'
												size='xs'
												text={props.dismissText}
												onClick={() => props.onOpenStateChange(!props.open)}
											/>
										</div>
									</div>
									<div className='ml-4 flex flex-shrink-0'>
										<button
											type='button'
											className='inline-flex rounded-md bg-white text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:text-gray-500'
											onClick={() => {
												props.onOpenStateChange(!props.open);
											}}>
											<span className='sr-only'>Close</span>
											<XMarkIcon className='h-5 w-5' aria-hidden='true' />
										</button>
									</div>
								</div>
							</div>
						</div>
					</Transition>
				</div>
			</div>
		</>
	);
};

NotificationWithAction.defaultProps = {
	okText: 'Ok',
	dismissText: 'Để sau',
	icon: InboxIcon
};

export default NotificationWithAction;
