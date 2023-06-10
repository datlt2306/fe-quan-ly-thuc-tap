import useServerPagination from '@/App/hooks/useServerPagination';
import { useDeleteStaffMutation, useGetAllManagerQuery } from '@/App/providers/apis/staffListApi';
import { staffDataValidator } from '@/App/schemas/staffSchema';
import Button from '@/Core/components/common/Button';
import PopConfirm from '@/Core/components/common/Popup/PopConfirm';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import { InputColumnFilter } from '@/Core/components/common/Table/ReactTableFilters';
import { PencilSquareIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Fragment, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import AddStaffSlideOver from './components/AddManagerSlideOver';
import UpdateStaffModal from './components/UpdateManagerModal';

const ManagerListPage = () => {
	const currentUser = useSelector((state) => state.auth?.user);
	const [isEditing, setIsEditing] = useState(false);
	const [user, setUser] = useState();
	const [slideOverVisibility, setSlideOverVisibility] = useState(false);
	const { paginationState, handlePaginate } = useServerPagination();
	const { data, isLoading, refetch, isFetching } = useGetAllManagerQuery({
		page: paginationState?.pageIndex,
		limit: paginationState?.pageSize
	});
	const tableData = useMemo(() => data?.data ?? [], [data]);

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

	const onOpenUpdate = (data) => {
		const selectedUser = Array.isArray(tableData) && tableData?.find((item) => item?._id === data);
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
		[tableData]
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

				<ReactTable
					onHandleRefetch={refetch}
					loading={isLoading || isFetching}
					columns={columnsData}
					data={tableData}
					serverSidePagination={true}
					serverPaginationProps={{
						...paginationState,
						pageIndex: data?.page,
						totalPages: data?.totalPages,
						canNextPage: data?.hasNextPage,
						canPreviousPage: data?.hasPrevPage
					}}
					onServerPaginate={handlePaginate}
				/>
			</Box>
		</Fragment>
	);
};

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex items-center gap-px`;

export default ManagerListPage;
