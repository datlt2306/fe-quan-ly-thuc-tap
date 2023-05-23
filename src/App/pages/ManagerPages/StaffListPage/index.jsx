import { useDeleteStaffMutation, useGetAllStaffQuery } from '@/App/providers/apis/staffListApi';
import { staffDataValidator } from '@/App/schemas/staffSchema';
import Button from '@/Core/components/common/Button';
import PopConfirm from '@/Core/components/common/Popup/PopConfirm';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import { InputColumnFilter, SelectColumnFilter } from '@/Core/components/common/Table/ReactTableFilters';
import { PencilSquareIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Fragment, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AddStaffSlideOver from './components/AddStaffSlideOver';
import UpdateStaffModal from './components/UpdateStaffModal';
import { RoleStaffEnum } from '@/App/constants/userRoles';
import tw from 'twin.macro';

const StaffListPage = () => {
	const { data: managers } = useGetAllStaffQuery();
	const [isEditing, setIsEditing] = useState(false);
	const [user, setUser] = useState();
	const [slideOverVisibility, setSlideOverVisibility] = useState(false);
	const { reset } = useForm({
		resolver: yupResolver(staffDataValidator)
	});

	console.log(managers);
	const tableData = useMemo(() => {
		return Array.isArray(managers?.list)
			? managers?.list?.map((user, index) => ({ ...user, index: index + 1, role: RoleStaffEnum[user?.role] }))
			: [];
	}, [managers]);

	const [handleRemoveStaff] = useDeleteStaffMutation();

	const onDeleteSubmit = async (id) => {
		const { error } = await handleRemoveStaff(id);
		if (error) {
			toast.error('Xóa không thành công!');
			return;
		}
		toast.success('Xóa nhân viên thành công!');
	};

	const onOpenUpdate = (data) => {
		const selectedUser = Array.isArray(managers?.list) && managers?.list?.find((item) => item?._id === data);
		if (selectedUser) {
			setUser(selectedUser);
			setIsEditing(!isEditing);
		}
	};

	const columnsData = useMemo(
		() => [
			{
				Header: 'STT',
				accessor: 'index'
			},
			{
				Header: 'Tên nhân viên',
				accessor: 'name',
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true
			},
			{
				Header: 'Email nhân viên',
				accessor: 'email',
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true
			},
			{
				Header: 'Quyền Hạn nhân viên',
				accessor: 'role',
				Filter: SelectColumnFilter,
				filterable: true,
				isSort: true
			},
			{
				Header: 'Cơ sở đang làm việc',
				accessor: 'campus_id',
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
				Cell: ({ value }) => value.name
			},
			{
				Header: 'Thao tác',
				accessor: '_id',
				canFilter: false,
				canSort: false,
				filterable: false,
				isSort: false,
				Cell: ({ value }) => (
					<ButtonList>
						<Button size='xs' variant='default' shape='square' onClick={() => onOpenUpdate(value)}>
							<PencilSquareIcon className='h-4 w-4' />
						</Button>
						<PopConfirm
							okText='Ok'
							cancelText='Cancel'
							title={'Xóa nhân viên'}
							description={'Bạn muốn xóa nhân viên này ?'}
							onConfirm={() => onDeleteSubmit(value)}>
							<Button size='xs' variant='error' shape='square'>
								<TrashIcon className='h-4 w-4' />
							</Button>
						</PopConfirm>
					</ButtonList>
				)
			}
		],
		[]
	);

	return (
		<Fragment>
			<AddStaffSlideOver open={slideOverVisibility} onOpen={setSlideOverVisibility} panelTitle={'Thêm nhân viên'} />
			<UpdateStaffModal
				openState={isEditing}
				onOpenStateChange={setIsEditing}
				title={'Sửa nhân viên'}
				userData={user}
			/>
			<Box>
				<ButtonList>
					<Button
						type='button'
						variant='primary'
						size='sm'
						onClick={() => {
							reset();
							setSlideOverVisibility(!slideOverVisibility);
						}}>
						<UserPlusIcon className='h-4 w-4 text-[inherit] ' /> Thêm nhân viên
					</Button>
				</ButtonList>

				<ReactTable columns={columnsData} data={tableData} />
			</Box>
		</Fragment>
	);
};

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex items-center gap-1`;

export default StaffListPage;
