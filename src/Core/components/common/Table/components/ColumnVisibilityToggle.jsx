import { Popover, Transition } from '@headlessui/react';
import { AdjustmentsHorizontalIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import Box from '../../Box';
import Button from '../../Button';

/**
 * @typedef {import('react-table').TableInstance} TableInstance
 */

/** @type { React.FC<{table: TableInstance<object>}>} */
const ColumnsVisibilityToggle = ({ table }) => {
	console.log(table.allColumns);
	return (
		<Popover className='relative'>
			<Popover.Button>
				<Button
					shape='square'
					variant='outline'
					className='focus:visible:outline-none outline-none'
					size='xs'
					icon={AdjustmentsHorizontalIcon}
				/>
			</Popover.Button>
			<Transition
				as={Fragment}
				enter='transition ease-in duration'
				enterFrom='opacity-0'
				leave='transition ease-out duration-200'
				leaveFrom='opacity-100'
				leaveTo='opacity-0'>
				<Popover.Panel className='absolute right-0 mt-2 rounded-md border border-gray-200 bg-white shadow'>
					<Box className='p-2'>
						<Box className='flex max-h-40 flex-col items-stretch overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200'>
							{Array.isArray(table.allColumns) &&
								table.allColumns
									.filter((column) => typeof column.Header === 'string')
									.map((column) => {
										return (
											<label
												htmlFor={column.id}
												className='btn-ghost btn btn-sm items-center justify-between font-normal'>
												<input
													type='checkbox'
													className='hidden'
													id={column.id}
													{...column.getToggleHiddenProps()}
												/>
												<span className='whitespace-nowrap'>{column.Header}</span>{' '}
												{column.isVisible && <CheckIcon className='ml-6 h-4 w-4' />}
											</label>
										);
									})}
						</Box>
					</Box>
				</Popover.Panel>
			</Transition>
		</Popover>
	);
};

export default ColumnsVisibilityToggle;
