import { useAddCompanyMutation } from '@/App/providers/apis/businessApi';
import { useGetAllMajorQuery } from '@/App/providers/apis/majorApi';
import { companySchema } from '@/App/schemas/companySchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import SelectFieldControl from '@/Core/components/common/FormControl/SelectFieldControl';
import TextareaFieldControl from '@/Core/components/common/FormControl/TextareaFieldControl';
import Typography from '@/Core/components/common/Text/Typography';
import { StaffPaths } from '@/Core/constants/routePaths';
import { PlusIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

const AddBusinessForm = () => {
	const navigate = useNavigate();

	// get list campus and major
	const { data: major } = useGetAllMajorQuery(null, { refetchOnMountOrArgChange: true });

	// handle add new company
	const { handleSubmit, control } = useForm({
		resolver: yupResolver(companySchema)
	});
	const [handleAddCompany, { isLoading }] = useAddCompanyMutation();
	const onSubmit = async (data) => {
		const result = await handleAddCompany([data]);
		if (result?.error) {
			toast.error('Thêm mới thất bại');
			return;
		}
		toast.success('Thêm doanh nghiệp mới thành công!');
		navigate(StaffPaths.COMPANY_LIST);
	};

	return (
		<Container>
			<Typography level={6} fontWeight='semibold' className='mb-10'>
				Thêm Mới Doanh Nghiệp
			</Typography>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Form.Group>
					<InputFieldControl
						control={control}
						name='name'
						label='Tên Doanh Nghiệp'
						placeholder='Công ty TNHH ...'
					/>
					<InputFieldControl control={control} name='tax_code' label='Mã Số Thuế' placeholder='0123456789 ...' />
				</Form.Group>
				<Form.Group>
					<InputFieldControl
						control={control}
						name='business_code'
						label='Mã Doanh Nghiệp'
						placeholder='TT01 ...'
					/>
					<InputFieldControl
						control={control}
						name='internship_position'
						label='Vị Trí Thực Tập'
						placeholder='Intern ...'
					/>
				</Form.Group>
				<Form.Group>
					<InputFieldControl control={control} name='amount' label='Số Lượng' placeholder='Số ...' type='number' />
					<SelectFieldControl
						name='major'
						control={control}
						label='Ngành'
						options={Array.isArray(major) && major.map((item) => ({ value: item._id, label: item.name }))}
					/>
					<InputFieldControl control={control} name='address' label='Địa Chỉ' placeholder='Hà Nội ...' />
				</Form.Group>
				<Form.Group>
					<TextareaFieldControl
						control={control}
						name='requirement'
						label='Yêu Cầu'
						resizable={false}
						placeholder='Sinh viên đi thực tập ...'
					/>

					<TextareaFieldControl
						resizable={false}
						control={control}
						name='benefit'
						label='Quyền Lợi'
						placeholder='Có cơ hội ...'
					/>
				</Form.Group>
				<Form.Group>
					<TextareaFieldControl
						control={control}
						resizable={false}
						name='description'
						label='Mô tả'
						placeholder='Trách nghiệm, nhiệt tình ...'
					/>
				</Form.Group>
				<Form.Group className='justify-end'>
					<Button
						variant='primary'
						type='submit'
						className='w-fit md:w-full'
						size='md'
						icon={PlusIcon}
						disabled={isLoading}
						loading={isLoading}>
						Thêm mới
					</Button>
				</Form.Group>
			</Form>
		</Container>
	);
};

const Container = tw.div`h-fit max-w-3xl md:(max-w-xl mx-auto) px-6 py-3`;
const Form = tw.form`flex flex-col gap-6`;
Form.Group = tw.div`flex grow gap-6 md:flex-wrap [&>*]:(basis-auto w-full)`;

export default AddBusinessForm;
