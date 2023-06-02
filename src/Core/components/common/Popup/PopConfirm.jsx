import { Popover, Transition } from '@headlessui/react';
import React, { Fragment, useCallback, useState } from 'react';
import Button from '../Button';
import tw from 'twin.macro';

const ButtonGroup = tw.div`flex items-center gap-1`;

const PopConfirm = ({ onConfirm, onCancel, title = '', description, children, okText = 'Ok', cancelText = 'Hủy' }) => {
	const handleConfirm = useCallback((done) => {
		if (onConfirm) {
			onConfirm();
		}
		done();
	}, []);
	const handleCancel = useCallback((done) => {
		if (onCancel) {
			onCancel();
		}
		done();
	}, []);
	return (
		<Popover className='relative'>
			<Popover.Button className={'outline-none'} as={'div'}>
				{children}
			</Popover.Button>

			<Transition
				as={Fragment}
				enter='transition transform duration-300 ease-in-out'
				enterFrom='opacity-0 translate-y-4'
				enterTo='opacity-100 translate-y-0'
				leave='transition transform duration-300 ease-in-out'
				leaveFrom='opacity-100 translate-y-0'
				leaveTo='opacity-0 translate-y-4'>
				<Popover.Panel className='absolute right-0 z-10 rounded-md bg-white p-4 shadow-lg'>
					{({ close }) => (
						<>
							<h3 className='mb-3 text-base font-medium text-gray-600'>{title}</h3>
							<p className='mb-6 text-gray-500'>{description}</p>

							<ButtonGroup>
								<Button size='xs' variant='outline' onClick={() => handleConfirm(close)}>
									{okText}
								</Button>
								<Button size='xs' variant='error' onClick={() => handleCancel(close)}>
									{cancelText}
								</Button>
							</ButtonGroup>
						</>
					)}
				</Popover.Panel>
			</Transition>
		</Popover>
	);
};

export default PopConfirm;
