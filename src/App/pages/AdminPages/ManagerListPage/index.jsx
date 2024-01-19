import { staffDataValidator } from '@/App/schemas/staff.schema';
import { useDeleteStaffMutation, useGetAllManagerQuery } from '@/App/store/apis/staff-list.api';
import Button from '@/Core/components/common/Button';
import PopConfirm from '@/Core/components/common/Popup/PopConfirm';
import DataTable from '@/Core/components/common/Table/DataTable';
import { InputColumnFilter } from '@/Core/components/common/Table/components/TableFilter';
import { PencilSquareIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import { Fragment, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import AddStaffSlideOver from './components/AddManagerSlideOver';
import UpdateStaffModal from './components/UpdateManagerModal';
import useQueryParams from '@/App/hooks/useQueryParams';

const ManagerListPage = () => {
	const currentUser = useSelector((state) => state.auth?.user);
	const [isEditing, setIsEditing] = useState(false);
	const [user, setUser] = useState();
	const [slideOverVisibility, setSlideOverVisibility] = useState(false);
	const [params] = useQueryParams('page', 'limit');

	const { data, isLoading, refetch, isFetching } = useGetAllManagerQuery({
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

	const onOpenUpdate = (id) => {
		const selectedUser = Array.isArray(data) && data?.data?.find((item) => item?._id === id);
		if (selectedUser) {
			setUser(selectedUser);
		}
		setIsEditing(true);
	};

	const columnsData = useMemo(
		() => [
			{
				Header: 'STT',
				accessor: 'index',
				Cell: ({ value }) => <div>{value}</div>
			},
			{
				Header: 'Tên quản lý',
				accessor: 'name',
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true
			},
			{
				Header: 'Email quản lý',
				accessor: 'email',
				Filter: InputColumnFilter,
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
				Cell: ({ row }) => (
					<ButtonList>
						<>
							<Button size='xs' variant='ghost' shape='square' onClick={() => onOpenUpdate(row.original._id)}>
								<PencilSquareIcon className='h-4 w-4' />
							</Button>

							<PopConfirm
								okText='Ok'
								cancelText='Cancel'
								title={'Xóa nhân viên'}
								description={'Bạn muốn xóa nhân viên này ?'}
								onConfirm={() => onDeleteSubmit(row.original._id)}>
								<Button
									size='xs'
									variant='ghost'
									className='text-error'
									shape='square'
									disabled={row.original?._id === currentUser.id}>
									<TrashIcon className='h-4 w-4' />
								</Button>
							</PopConfirm>
						</>
					</ButtonList>
				)
			}
		],
		[data]
	);

	return (
		<Fragment>
			<AddStaffSlideOver open={slideOverVisibility} onOpen={setSlideOverVisibility} panelTitle={'Thêm quản lý'} />
			<UpdateStaffModal
				openState={isEditing}
				onOpenStateChange={setIsEditing}
				title={'Sửa nhân viên'}
				userData={user}
				users={data}
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
						<UserPlusIcon className='h-4 w-4 text-[inherit] ' /> Thêm quản lý
					</Button>
				</ButtonList>

				<DataTable
					onHandleRefetch={refetch}
					loading={isLoading || isFetching}
					columns={columnsData}
					data={data?.data ?? []}
					manualPagination
					paginationState={{
						..._.omit(data, ['data'])
					}}
				/>
			</Box>
		</Fragment>
	);
};

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex items-center gap-px`;

export default ManagerListPage;
