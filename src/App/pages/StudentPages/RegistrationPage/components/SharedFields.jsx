import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import { Fragment } from 'react';
import { Input } from '@/Core/components/common/FormControl/InputFieldControl';
import FormControl from '@/Core/components/common/FormControl/FormControl';
import Text from '@/Core/components/common/Text/Text';

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
				<ReadOnlyField key={index} title={field.title} value={field.value} />
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

const ReadOnlyField = ({ title, value }) => {
	return (
		<FormControl>
			<Text as='label' className='font-semibold text-base-content'>
				{title}
			</Text>
			<Input disabled value={value}></Input>
		</FormControl>
	);
};

export default SharedFields;
