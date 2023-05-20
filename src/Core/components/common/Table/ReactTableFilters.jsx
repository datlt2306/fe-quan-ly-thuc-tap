import { Popover, Transition } from '@headlessui/react';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Fragment, useMemo, useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import 'regenerator-runtime/runtime';
import Button from '../Button';
import { Input } from '../FormControl/InputFieldControl';
import { Option, Select } from '../FormControl/SelectFieldControl';

// Table filter global
const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {
	// const count = preGlobalFilteredRows?.length;
	const [value, setValue] = useState(globalFilter);
	const onChange = useAsyncDebounce((value) => {
		setGlobalFilter(value.trim() || '');
	}, 300);
	return (
		<div className='relative'>
			<MagnifyingGlassIcon className='absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2' />
			<Input
				placeholder={`Tìm kiếm trong bảng ...`}
				className='w-full max-w-sm pl-8'
				type='search'
				value={value || ''}
				onChange={(e) => {
					setValue(e.target.value);
					onChange(e.target.value.trim());
					onChange(e.target.value);
				}}
			/>
		</div>
	);
};

// Default filter component
const InputColumnFilter = ({ column: { filterable, filterValue, preFilteredRows, setFilter } }) => {
	const count = preFilteredRows.length;
	return (
		<Popover className='relative inline-block text-left' as='div'>
			{({ open }) => (
				<Fragment>
					<Popover.Button as='div'>
						<Button variant={open ? 'primary' : 'ghost'} shape='square' size='xs'>
							<FunnelIcon className='h-3.5 w-3.5' />
						</Button>
					</Popover.Button>
					<Transition
						as={Fragment}
						enter='transition ease-out duration-100'
						enterFrom='transform opacity-0 scale-95'
						enterTo='transform opacity-100 scale-100'
						leave='transition ease-in duration-75'
						leaveFrom='transform opacity-100 scale-100'
						leaveTo='transform opacity-0 scale-95'>
						<Popover.Panel className='absolute left-0 right-0 top-8 z-10 w-[160px] rounded-md shadow-lg'>
							<Input
								value={filterValue || ''}
								type='search'
								onChange={(e) => setFilter(e.target.value)}
								className='w-full text-xs text-base-content'
								placeholder={`Tìm trong ${count} hàng...`}
							/>
						</Popover.Panel>
					</Transition>
				</Fragment>
			)}
		</Popover>
	);
};

const SelectColumnFilter = ({ column: { filterValue, setFilter, preFilteredRows, id }, customOptions }) => {
	const options = useMemo(() => {
		const options = new Set();
		preFilteredRows.forEach((row) => {
			options.add(row.values[id]);
		});
		return [...options.values()];
	}, [id, preFilteredRows]);
	return (
		<Popover className='relative inline-block text-left' as='div'>
			{({ open }) => (
				<Fragment>
					<Popover.Button as='div'>
						<Button variant={open ? 'primary' : 'ghost'} shape='square' size='xs'>
							<FunnelIcon className='h-3.5 w-3.5' />
						</Button>
					</Popover.Button>
					<Transition
						as={Fragment}
						enter='transition ease-out duration-100'
						enterFrom='transform opacity-0 scale-95'
						enterTo='transform opacity-100 scale-100'
						leave='transition ease-in duration-75'
						leaveFrom='transform opacity-100 scale-100'
						leaveTo='transform opacity-0 scale-95'>
						<Popover.Panel className='absolute left-0 right-0 top-8 z-10 w-[160px] rounded-md shadow-lg'>
							<Select
								className='min-w-[160px] py-1 text-sm'
								value={filterValue}
								onChange={(e) => {
									setFilter(e.target.value || undefined);
								}}>
								<Option value=''>All</Option>
								{options.map((option, i) => (
									<Option key={i} value={option}>
										{customOptions ? customOptions[option] : option}
									</Option>
								))}
							</Select>
						</Popover.Panel>
					</Transition>
				</Fragment>
			)}
		</Popover>
	);
};

export { GlobalFilter, InputColumnFilter, SelectColumnFilter };
