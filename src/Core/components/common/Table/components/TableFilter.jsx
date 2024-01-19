import { Popover, Transition } from '@headlessui/react';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Fragment, useContext, useMemo, useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import 'regenerator-runtime/runtime';
import Button from '../../Button';
import { Input } from '../../FormControl/InputFieldControl';
import { Option, Select } from '../../FormControl/SelectFieldControl';
import { TableContext } from '../context/TableProvider';

// Table filter global
const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {
	const [value, setValue] = useState(globalFilter);
	const onChange = useAsyncDebounce((value) => {
		setGlobalFilter(value.trim() || '');
	}, 300);
	return (
		<div className='relative' role='searchbox'>
			<MagnifyingGlassIcon className='absolute left-2 top-1/2 z-50 h-4 w-4 -translate-y-1/2' />
			<Input
				role='search'
				placeholder={`Tìm kiếm trong bảng ...`}
				className='w-full max-w-sm pl-8 shadow-none'
				type='search'
				value={value || ''}
				onChange={(e) => {
					setValue(e.target.value);
					onChange(e.target.value.trim());
				}}
			/>
		</div>
	);
};

// Default filter component
const InputColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }) => {
	const count = preFilteredRows.length;
	const { isScrolling } = useContext(TableContext);

	return (
		<Popover className='relative !z-0 inline-block bg-white text-left' as='div'>
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
						<Popover.Panel className='absolute right-8 top-1/2 z-0 w-[160px] -translate-y-1/2 rounded-md shadow-lg'>
							{({ close }) => {
								if (isScrolling) close();
								return (
									<Input
										value={filterValue || ''}
										type='search'
										onChange={(e) => setFilter(e.target.value)}
										className='w-full bg-white text-xs text-base-content'
										placeholder={`Tìm trong ${count} hàng...`}
									/>
								);
							}}
						</Popover.Panel>
					</Transition>
				</Fragment>
			)}
		</Popover>
	);
};

const SelectColumnFilter = ({ column: { filterValue, setFilter, preFilteredRows, id }, customOptions }) => {
	const { isScrolling } = useContext(TableContext);
	const options = useMemo(() => {
		const options = new Set();
		preFilteredRows.forEach((row) => {
			if (row.values[id]) options.add(row.values[id]);
		});
		return [...options.values()];
	}, [id, preFilteredRows]);

	return (
		<Popover className='relative !z-0 inline-block bg-white text-left' as='div'>
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
						<Popover.Panel className='absolute right-8 top-1/2 w-[160px] -translate-y-1/2 rounded-md shadow-lg'>
							{({ close }) => {
								if (isScrolling) close();
								return (
									<Select
										className='py-1 text-sm'
										value={filterValue}
										onChange={(e) => {
											setFilter(e.target.value || undefined);
										}}>
										<Option value=''>All</Option>
										{options.map((option, index) => (
											<Option key={index} value={option}>
												{option}
											</Option>
										))}
									</Select>
								);
							}}
						</Popover.Panel>
					</Transition>
				</Fragment>
			)}
		</Popover>
	);
};

export { GlobalFilter, InputColumnFilter, SelectColumnFilter };
