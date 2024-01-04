import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment } from 'react';

/**
 * @typedef TModalProps
 * @prop {boolean} openState
 * @prop {React.Dispatch<React.SetStateAction<boolean>>} onOpenStateChange
 * @prop {string | undefined} title
 * @prop {React.ComponentProps<typeof Dialog.Panel>} panelProps
 */

/**
 * @type {React.FC<TModalProps & React.PropsWithChildren>}
 */
const Modal = ({ openState, onOpenStateChange, title, children, panelProps }) => {
	return (
		<Transition appear show={openState} as={Fragment}>
			<Dialog as='div' className='relative z-[999]' onClose={() => onOpenStateChange(false)}>
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

				<div className='fixed inset-0 w-auto overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4 text-center'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'>
							<Dialog.Panel
								className={classNames(
									'relative w-auto min-w-fit max-w-md transform rounded-lg bg-white text-left align-middle shadow-xl transition-all',
									panelProps.className
								)}>
								{!!title && (
									<Dialog.Title as='h3' className='mb-6 text-lg font-medium leading-6'>
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
};

Modal.defaultProps = {
	panelProps: {
		className: 'p-6'
	}
};

export default Modal;
