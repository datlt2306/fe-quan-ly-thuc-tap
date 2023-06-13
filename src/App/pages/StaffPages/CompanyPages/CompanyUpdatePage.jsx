import {
	useGetAllCompanyQuery,
	useGetOneCompanyQuery,
	useUpdateCompanyMutation
} from '@/App/providers/apis/businessApi';
import { useGetAllMajorQuery } from '@/App/providers/apis/majorApi';
import { companySchema } from '@/App/schemas/companySchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import SelectFieldControl from '@/Core/components/common/FormControl/SelectFieldControl';
import TextareaFieldControl from '@/Core/components/common/FormControl/TextareaFieldControl';
import { StaffPaths } from '@/App/configs/routePaths';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

const UpdateBusinessForm = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const defaultSemester = useSelector((state) => state.semester?.defaultSemester);
	const { data: allCompanies } = useGetAllCompanyQuery({ semester_id: defaultSemester });
	const { data: company } = useGetOneCompanyQuery({ id }, { refetchOnMountOrArgChange: true });

	// get major
	const { data: major } = useGetAllMajorQuery();

	// set default value and form control
	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(companySchema),
		context: { companiesList: allCompanies, id: id }
	});
	useEffect(() => {
		if (company) {
			reset({
				name: company.name,
				internship_position: company.internship_position,
				major: company.major?._id,
				amount: company.amount,
				address: company.address,
				tax_code: company.tax_code,
				business_code: company.business_code,
				requirement: company.requirement,
				description: company.description,
				benefit: company.benefit
			});
		}
	}, [company, reset]);

	// handle update company
	const [handleUpdateCompany, { isLoading }] = useUpdateCompanyMutation();
	const onHandleUpdate = async (data) => {
		const result = await handleUpdateCompany({ data, id });
		if (result?.error) {
			toast.error('Cập nhật thất bại');
			return;
		}
		toast.success('Cập nhật doanh nghiệp mới thành công!');
		navigate(StaffPaths.COMPANY_LIST);
	};
	return (
		<Container>
			<Form onSubmit={handleSubmit(onHandleUpdate)}>
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
					<InputFieldControl control={control} name='business_code' label='Mã Tuyển Dụng' placeholder='TT01 ...' />
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
				<Form.Group>
					<Button
						variant='primary'
						type='submit'
						className='w-fit'
						size='md'
						disabled={isLoading}
						loading={isLoading}>
						Cập nhật
					</Button>
				</Form.Group>
			</Form>
		</Container>
	);
};

const Container = tw.div`h-fit max-w-3xl md:(max-w-xl mx-auto) px-6 py-3`;
const Form = tw.form`flex flex-col gap-6`;
Form.Group = tw.div`flex grow gap-6 md:flex-wrap [&>*]:(basis-auto w-full)`;

export default UpdateBusinessForm;
