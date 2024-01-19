import { useDeleteMajorMutation, useGetAllMajorQuery } from '@/App/store/apis/major.api';
import Button from '@/Core/components/common/Button';
import PopConfirm from '@/Core/components/common/Popup/PopConfirm';
import DataTable from '@/Core/components/common/Table/DataTable';
import { InputColumnFilter } from '@/Core/components/common/Table/components/TableFilter';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Fragment, useCallback, useContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import AddMajorSlideOver from './components/AddMajorSlideOver';
import UpdateMajorSlideOver from './components/UpdateMajorSlideOver';
import { TableContext } from '@/Core/components/common/Table/context/TableProvider';
import Box from '@/Core/components/common/Box';
import TableRowActions from './components/TableRowActions';

const MajorListPage = () => {
	const [major, setMajor] = useState();
	const { data: majors, isLoading, refetch, isFetching } = useGetAllMajorQuery();
	const [handleRemoveMajor] = useDeleteMajorMutation();

	const [slideOverVisibility, setSlideOverVisibility] = useState({
		AddSlide: false,
		UpdateSlide: false
	});
	const handleAddSlideOver = () => {
		setSlideOverVisibility((prevVisibility) => ({
			...prevVisibility,
			AddSlide: !prevVisibility.AddSlide
		}));
	};
	const handleUpdateSlideOver = useCallback(() => {
		setSlideOverVisibility((prevVisibility) => ({
			...prevVisibility,
			UpdateSlide: !prevVisibility.UpdateSlide
		}));
	}, []);

	const tableData = useMemo(() => {
		return Array.isArray(majors) ? majors?.map((item, index) => ({ ...item, index: index + 1 })) : [];
	}, [majors]);

	const onDeleteSubmit = useCallback(
		async (id) => {
			const result = await handleRemoveMajor(id);
			if (result?.error) {
				toast.error('Xóa không thành công!');
				return;
			}
			toast.success('Xóa chuyên ngành thành công!');
		},
		[handleRemoveMajor]
	);

	const onOpenUpdate = useCallback(
		(data) => {
			const getMajor = majors && majors?.find((item) => item?._id === data);
			if (getMajor) {
				setMajor(getMajor);
				handleUpdateSlideOver();
			}
		},
		[majors, handleUpdateSlideOver]
	);

	const columnsData = useMemo(
		() => [
			{
				Header: 'STT',
				accessor: 'index'
			},
			{
				Header: 'Tên chuyên ngành',
				accessor: 'name',
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true
			},
			{
				Header: 'Mã chuyên ngành',
				accessor: 'majorCode',
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true
			},
			{
				Header: 'Thao tác',
				accessor: '_id',
				canFilter: false,
				canSort: false,
				filterable: false,
				isSort: false,
				Cell: ({ value }) => <TableRowActions value={value} onUpdate={onOpenUpdate} onDelete={onDeleteSubmit} />
			}
		],
		[onDeleteSubmit, onOpenUpdate]
	);

	return (
		<Fragment>
			<AddMajorSlideOver
				majors={majors}
				open={slideOverVisibility.AddSlide}
				onOpen={handleAddSlideOver}
				panelTitle={'Thêm ngành học'}
			/>

			<UpdateMajorSlideOver
				major={major}
				majors={majors}
				open={slideOverVisibility.UpdateSlide}
				onOpenStateChange={handleUpdateSlideOver}
				title={'Sửa ngành học'}
			/>

			<Box className='flex flex-col gap-y-6'>
				<Button type='button' variant='primary' size='sm' className='w-fit' onClick={handleAddSlideOver}>
					<PlusIcon className='h-4 w-4 text-[inherit] ' />
					Thêm ngành học
				</Button>

				<DataTable columns={columnsData} data={tableData} loading={isLoading} onHandleRefetch={refetch} />
			</Box>
		</Fragment>
	);
};

export default MajorListPage;
