/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Suspense, lazy, Fragment, useMemo, useState, useEffect, useCallback } from 'react';
import tw from 'twin.macro';
import { toast } from 'react-toastify';

import Button from '@/Core/components/common/Button';
import PopConfirm from '@/Core/components/common/Popup/PopConfirm';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import { InputColumnFilter, SelectColumnFilter } from '@/Core/components/common/Table/ReactTableFilters';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useGetAllMajorQuery, useDeleteMajorMutation } from '@/App/providers/apis/majorApi';
import LoadingProgressBar from '@/Core/components/common/Loading/LoadingProgressBar';

const UpdateMajorSlideOver = lazy(() => import('./components/UpdateMajorSlideOver'));
const AddMajorSlideOver = lazy(() => import('./components/AddMajorSlideOver'));
// import AddMajorSlideOver from './components/AddMajorSlideOver';

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex items-center gap-2`;

const MajorListPage = () => {
	const [major, setMajor] = useState();

	const { data: majors,isLoading } = useGetAllMajorQuery();
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
							variant='default'
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
							<Button size='xs' variant='error' shape='square'>
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
			<Suspense fallback={<LoadingProgressBar />}>
				{slideOverVisibility.AddSlide && (
					<AddMajorSlideOver
						majors={majors}
						open={slideOverVisibility.AddSlide}
						onOpen={handleAddSlideOver}
						panelTitle={'Thêm ngành học'}
					/>
				)}
				{slideOverVisibility.UpdateSlide && (
					<UpdateMajorSlideOver
						major={major}
						majors={majors}
						open={slideOverVisibility.UpdateSlide}
						onOpen={handleUpdateSlideOver}
						panelTitle={'Sửa ngành học'}
					/>
				)}
			</Suspense>

			<Box>
				<ButtonList>
					<Button type='button' variant='primary' size='sm' onClick={handleAddSlideOver}>
						<PlusIcon className='h-4 w-4 text-[inherit] ' />
						Thêm ngành học
					</Button>
				</ButtonList>

				<ReactTable columns={columnsData} data={tableData} loading={isLoading} />
			</Box>
		</Fragment>
	);
};

export default MajorListPage;
