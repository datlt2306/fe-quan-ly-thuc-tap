import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import { Fragment } from 'react';
import tw from 'twin.macro';
const SharedFields = ({ control, student, inputFields = [] }) => {
	const readOnlyFields = [
		{ title: 'Họ và tên', value: student?.name },
		{ title: 'Mã sinh viên', value: student?.mssv },
		{ title: 'Chuyên ngành', value: student?.major?.name }
	];

	const fields = [
		{ label: 'Số điện thoại', name: 'phoneNumber', placeholder: 'Số điện thoại' },
		{ label: 'Địa chỉ', name: 'address', placeholder: 'Địa chỉ' },
		{
			label: 'Vị trí thực tập',
			name: 'dream',
			placeholder: 'VD: Web Back-end, Dựng phim, Thiết kế nội thất'
		},
		...inputFields
	];
	return (
		<Fragment>
			{readOnlyFields.map((field, index) => (
				<ReadOnly key={index} title={field.title} value={field.value} />
			))}
			{fields.map((item, index) => (
				<InputFieldControl
					key={index}
					label={item.label}
					control={control}
					name={item.name}
					placeholder={item.placeholder}
				/>
			))}
		</Fragment>
	);
};

const Input = tw.input` block w-full rounded-md border-0 duration-300 px-2.5 py-1.5 text-gray-900 outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6`;

const ReadOnly = ({ title, value }) => {
	return (
		<div>
			<label>{title}</label>
			<Input readOnly value={value}></Input>
		</div>
	);
};

export const SharedDefaultValues = ({ user }) => {
	return {
		phoneNumber: user?.phoneNumber,
		address: user?.address,
		dream: user?.dream
	};
};
export default SharedFields;
