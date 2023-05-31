import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import tw from 'twin.macro';
const SharedFields = (control, student) => {
	return [
		{
			content: <ReadOnly title='Họ và tên' value={student?.name} />
		},
		{
			content: (
				<div>
					<label>Mã sinh viên</label>
					<Input className='mt-2' readOnly value={student?.mssv}></Input>
				</div>
			)
		},
		{
			content: (
				<InputFieldControl label='Số điện thoại' control={control} name='phoneNumber' placeholder='Số điện thoại' />
			)
		},
		{
			content: <InputFieldControl label='Địa chỉ' control={control} name='address' placeholder='Địa chỉ' />
		},
		{
			content: <ReadOnly title='Chuyên ngành' value={student?.major?.name} />
		},
		{
			content: (
				<InputFieldControl
					label='Vị trí thực tập'
					control={control}
					name='dream'
					placeholder='VD: Web Back-end, Dựng phim, Thiết kế nội thất'
				/>
			)
		}
	];
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
