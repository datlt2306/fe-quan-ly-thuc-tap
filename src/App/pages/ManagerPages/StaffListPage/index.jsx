import { staffDataValidator } from '@/App/schemas/staff.schema';
import { useDeleteStaffMutation, useGetAllStaffQuery, usePrefetch } from '@/App/store/apis/staff-list.api';
import Button from '@/Core/components/common/Button';
import PopConfirm from '@/Core/components/common/Popup/PopConfirm';
import DataTable from '@/Core/components/common/Table/DataTable';
import { InputColumnFilter, SelectColumnFilter } from '@/Core/components/common/Table/components/TableFilter';
import Tooltip from '@/Core/components/common/Tooltip';
import { PencilSquareIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Fragment, useContext, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import AddStaffSlideOver from './components/AddStaffSlideOver';
import UpdateStaffModal from './components/UpdateStaffModal';
import _ from 'lodash';
import useQueryParams from '@/App/hooks/useQueryParams';
import { TableContext } from '@/Core/components/common/Table/context/TableProvider';
import TableRowActions from './components/TableRowActions';
import Box from '@/Core/components/common/Box';

const StaffListPage = () => {
	const currentUser = useSelector((state) => state.auth?.user);
	const [isEditing, setIsEditing] = useState(false);
	const [user, setUser] = useState();
	const [slideOverVisibility, setSlideOverVisibility] = useState(false);
	const [params] = useQueryParams('page', 'limit');
	const { data, isLoading, refetch, isFetching } = useGetAllStaffQuery({
		page: Boolean(params.page) ? params.page : 1,
		limit: Boolean(params.limit) ? params.limit : 10
	});

	const { reset } = useForm({
		resolver: yupResolver(staffDataValidator)
	});

	const [handleRemoveStaff] = useDeleteStaffMutation();

	const onDeleteSubmit = async (id) => {
		if (currentUser.id == id) {
			toast.error('Xóa không thành công!');
			return;
		}
		const { error } = await handleRemoveStaff(id);
		if (error) {
			toast.error('Xóa không thành công!');
			return;
		}
		toast.success('Xóa nhân viên thành công!');
	};

	const prefetch = usePrefetch('getAllStaff');

	const onOpenUpdate = (data) => {
		const selectedUser = Array.isArray(data?.data) && data?.data?.find((item) => item?._id === data);
		if (selectedUser) {
			setUser(selectedUser);
		}
		setIsEditing(true);
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
				accessor: 'campus_id.name',
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
				Cell: ({ value }) => value
			},
			{
				Header: 'Thao tác',
				canFilter: false,
				canSort: false,
				filterable: false,
				isSort: false,
				Cell: ({ row }) => <TableRowActions row={row} onDelete={onDeleteSubmit} onUpdate={onOpenUpdate} />
			}
		],
		[data]
	);

	return (
		<Fragment>
			<AddStaffSlideOver
				openState={slideOverVisibility}
				onOpenStateChange={setSlideOverVisibility}
				formContext={data?.data}
				panelTitle={'Thêm nhân viên'}
			/>
			<UpdateStaffModal
				openState={isEditing}
				onOpenStateChange={setIsEditing}
				title={'Sửa nhân viên'}
				userData={user}
				users={data?.data ?? []}
			/>
			<Box className='flex flex-col gap-y-6'>
				<Button
					type='button'
					variant='primary'
					size='sm'
					className='w-fit'
					onClick={() => {
						reset();
						setSlideOverVisibility(!slideOverVisibility);
					}}>
					<UserPlusIcon className='h-4 w-4 text-[inherit] ' /> Thêm nhân viên
				</Button>

				<DataTable
					onHandleRefetch={refetch}
					loading={isLoading}
					columns={columnsData}
					data={data?.data ?? []}
					manualPagination
					onPrefetch={prefetch}
					paginationState={{
						..._.omit(data, ['data'])
					}}
				/>
			</Box>
		</Fragment>
	);
};

export default StaffListPage;
