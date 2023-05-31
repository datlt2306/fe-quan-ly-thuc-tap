import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import { Fragment } from 'react';
import { Input } from '@/Core/components/common/FormControl/InputFieldControl';
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
