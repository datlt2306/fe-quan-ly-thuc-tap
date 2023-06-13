import { useDeleteMajorMutation, useGetAllMajorQuery } from '@/App/providers/apis/majorApi';
import Button from '@/Core/components/common/Button';
import PopConfirm from '@/Core/components/common/Popup/PopConfirm';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import { InputColumnFilter } from '@/Core/components/common/Table/ReactTableFilters';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import AddMajorSlideOver from './components/AddMajorSlideOver';
import UpdateMajorSlideOver from './components/UpdateMajorSlideOver';

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
				Cell: ({ value }) => (
					<ButtonList>
						<Button
							size='xs'
							variant='ghost'
							shape='square'
							onClick={() => {
								onOpenUpdate(value);
							}}>
							<PencilSquareIcon className='h-4 w-4' />
						</Button>
						<PopConfirm
							okText='Ok'
							cancelText='Cancel'
							title={'Xóa chuyên ngành'}
							description={'Bạn muốn xóa chuyên ngành này ?'}
							onConfirm={() => onDeleteSubmit(value)}>
							<Button size='xs' variant='ghost' className='text-error' shape='square'>
								<TrashIcon className='h-4 w-4' />
							</Button>
						</PopConfirm>
					</ButtonList>
				)
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

			<Box>
				<ButtonList>
					<Button type='button' variant='primary' size='sm' onClick={handleAddSlideOver}>
						<PlusIcon className='h-4 w-4 text-[inherit] ' />
						Thêm ngành học
					</Button>
				</ButtonList>

				<ReactTable
					columns={columnsData}
					data={tableData}
					loading={isLoading || isFetching}
					onHandleRefetch={refetch}
				/>
			</Box>
		</Fragment>
	);
};

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex items-center gap-px`;

export default MajorListPage;
