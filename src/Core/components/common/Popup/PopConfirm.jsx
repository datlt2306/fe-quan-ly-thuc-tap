import { Popover, Transition } from '@headlessui/react';
import React, { Fragment, useCallback, useState } from 'react';
import Button from '../Button';
import tw from 'twin.macro';
import classNames from 'classnames';
import Text from '../Text/Text';

const getPosition = (value) => {
	switch (value) {
		case 'right':
			return 'right-10 top-0';
		case 'left':
			return 'left-10 top-0';
		case 'bottom-left':
			return 'left-0';
		case 'bottom-right':
			return 'right-0';
		case 'top-left':
			return 'bottom-0 right-10';
		case 'top-right':
			return 'bottom-0 right-10';
		default:
			return 'left-10 -translate-y-1/2';
	}
};

const PopConfirm = ({
	onConfirm,
	onCancel,
	title = '',
	description,
	children,
	position = 'top-right',
	okText = 'Ok',
	cancelText = 'Cancel',
	forceClose
}) => {
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

	const transitionProps = {
		enter: 'transition transform duration-500 ease-in-out',
		enterFrom: 'opacity-0',
		enterTo: 'opacity-100',
		leave: 'transition transform duration-500 ease-in-out',
		leaveFrom: 'opacity-100',
		leaveTo: 'opacity-0'
	};

	return (
		<Popover className='relative'>
			<Popover.Button className={'outline-none'} as={'div'}>
				{children}
			</Popover.Button>

			<Transition as={Fragment} {...transitionProps}>
				<Popover.Panel
					as='div'
					className={classNames(
						'absolute z-50 w-fit min-w-[320px] rounded-md bg-white p-4 shadow-lg',
						getPosition(position)
					)}>
					{({ close }) => {
						if (forceClose) close();
						return (
							<Fragment>
								<Text as='h4' className='mb-2 text-base font-medium text-gray-600'>
									{title}
								</Text>
								<Text as='p' className='z-0 mb-6 whitespace-normal text-sm text-base-content line-clamp-4'>
									{description}
								</Text>

								<ButtonGroup>
									<Button size='xs' variant='outline' onClick={() => handleConfirm(close)}>
										{okText}
									</Button>
									<Button size='xs' variant='error' onClick={() => handleCancel(close)}>
										{cancelText}
									</Button>
								</ButtonGroup>
							</Fragment>
						);
					}}
				</Popover.Panel>
			</Transition>
		</Popover>
	);
};

const ButtonGroup = tw.div`flex items-center gap-1`;

export default PopConfirm;
