import { useController } from 'react-hook-form';
import { Combobox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import React, { forwardRef, Fragment, useState, useId, useRef, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import tw from 'twin.macro';
import Text from '@/Core/components/common/Text/Text';
import FormControl from './FormControl';

const ComboBoxFieldControl = forwardRef(
	(
		{
			loading,
			placeholder,
			initialValue = '',
			control,
			name,
			label,
			options,
			disabled,
			rules,
			displayLabel = (item) => item.label,
			...props
		},
		ref
	) => {
		const [query, setQuery] = useState('');
		const id = useId();
		const localRef = useRef(null);
		const inputRef = ref || localRef;
		const {
			field: { onChange, onBlur, value },
			fieldState: { error }
		} = useController({
			name,
			control,
			rules,
			defaultValue: initialValue,
			...props
		});
		const filteredOptions = query
			? options.filter((item) => displayLabel(item)?.toLowerCase().includes(query.toLowerCase()))
			: options;

		const optionsMap = useMemo(() => {
			return options.reduce((map, option) => {
				map[option.value] = option.label;
				return map;
			}, {});
		}, [options]);

		return (
			<FormControl>
				{label && (
					<Text as='label' className='font-medium text-base-content' htmlFor={id}>
						{label}
					</Text>
				)}

				<Combobox
					value={value}
					onChange={(event) => {
						onChange(event);
						if (props.onChange) {
							props.onChange(event);
						}
					}}
					id={id}
					ref={(e) => {
						field.ref(e);
						inputRef.current = e;
					}}
					name={name}>
					{({ open }) => (
						<Fragment>
							<Combobox.Content>
								<Combobox.Button as='div' className='flex items-center'>
									<Combobox.Input
										className='w-full border-none px-2 py-1.5 leading-6 text-base-content focus:ring-0'
										defaultValue={initialValue}
										placeholder={placeholder}
										displayValue={(selectedOption) => {
											if (selectedOption) {
												return optionsMap[selectedOption];
											}
										}}
										autoComplete='off'
										onChange={(event) => setQuery(event.target.value)}
										disabled={loading}
									/>
									<Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
										<ChevronDownIcon className='h-6 w-6 text-gray-400' aria-hidden='true' />
									</Combobox.Button>
								</Combobox.Button>
							</Combobox.Content>
							<Transition
								as={Fragment}
								leave='transition ease-in duration-100'
								leaveFrom='opacity-100'
								leaveTo='opacity-0'
								afterLeave={() => setQuery('')}>
								<Combobox.Dropdown>
									<Combobox.Options className='absolute z-10 max-h-60 w-full overflow-auto rounded-md bg-white text-base text-base-content shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
										{loading ? (
											<BoxData>Đang tải dữ liệu ...</BoxData>
										) : (filteredOptions.length === 0 && query !== '') || options?.length == 0 ? (
											<BoxData>Không tìm thấy dữ liệu</BoxData>
										) : (
											filteredOptions.map((option) => (
												<Combobox.Option
													key={option.value}
													className={({ active, selected }) =>
														classNames(
															'relative cursor-default select-none px-3 py-1.5 hover:bg-gray-50 hover:text-base-content',
															{
																'bg-gray-100': selected
															}
														)
													}
													value={option.value}>
													{displayLabel(option)}
												</Combobox.Option>
											))
										)}
									</Combobox.Options>
								</Combobox.Dropdown>
							</Transition>
						</Fragment>
					)}
				</Combobox>

				{error && (
					<Text as='small' color='error' className='font-medium'>
						{error.message}
					</Text>
				)}
			</FormControl>
		);
	}
);

const BoxData = tw.div`relative cursor-default select-none px-4 py-2 text-gray-700`;
Combobox.Content = tw.div`relative w-full min-w-[128px] cursor-default overflow-hidden rounded-md border-none text-base-content outline-none ring-1 ring-gray-300 duration-300 focus:ring-primary focus:active:ring-primary`;
Combobox.Dropdown = tw.div`relative`;

export default ComboBoxFieldControl;
