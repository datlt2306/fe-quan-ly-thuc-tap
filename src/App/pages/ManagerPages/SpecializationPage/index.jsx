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

import { useGetAllNarrowQuery, useDeleteNarrowMutation } from '@/App/providers/apis/narrowSpecializationApi';
import LoadingProgressBar from '@/Core/components/common/Loading/LoadingProgressBar';

const UpdateNarrowSlideOver = lazy(() => import('./components/UpdateNarrowSlideOver'));
const AddNarrowSlideOver = lazy(() => import('./components/AddNarrowSlideOver'));

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex items-center gap-2`;

const SpecializationPage = () => {
	const [narrow, setNarrow] = useState();

	const { data: majors } = useGetAllMajorQuery();
	const { data: narrows } = useGetAllNarrowQuery();
	const [handleRemoveNarrow] = useDeleteNarrowMutation();

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
		return Array.isArray(narrows) ? narrows?.map((item, index) => ({ ...item, index: index + 1 })) : [];
	}, [narrows]);

	const onDeleteSubmit = useCallback(
		async (id) => {
			const result = await handleRemoveNarrow(id);
			const error = result?.error;
			if (error) {
				toast.error(error?.data?.message ?? 'Xóa không thành công!');
				return;
			}
			toast.success('Xóa chuyên ngành thành công!');
		},
		[handleRemoveNarrow]
	);

	const onOpenUpdate = useCallback(
		(data) => {
			const getNarrow = narrows && narrows?.find((item) => item?._id === data);
			if (getNarrow) {
				setNarrow(getNarrow);
				handleUpdateSlideOver();
			}
		},
		[narrows, handleUpdateSlideOver]
	);

	const columnsData = useMemo(
		() => [
			{
				Header: 'STT',
				accessor: 'index'
			},
			{
				Header: 'Tên chuyên ngành',
				accessor: 'id_majors.name',
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true
			},
			{
				Header: 'Tên chuyên ngành hẹp',
				accessor: 'name',
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
					<AddNarrowSlideOver
						majors={majors}
						open={slideOverVisibility.AddSlide}
						onOpen={handleAddSlideOver}
						panelTitle={'Thêm ngành hẹp'}
					/>
				)}
				{slideOverVisibility.UpdateSlide && (
					<UpdateNarrowSlideOver
						narrow={narrow}
						majors={majors}
						open={slideOverVisibility.UpdateSlide}
						onOpen={handleUpdateSlideOver}
						panelTitle={'Sửa ngành hẹp'}
					/>
				)}
			</Suspense>

			<Box>
				<ButtonList>
					<Button type='button' variant='primary' size='sm' onClick={handleAddSlideOver}>
						<PlusIcon className='h-4 w-4 text-[inherit] ' />
						Thêm ngành hẹp
					</Button>
				</ButtonList>

				<ReactTable columns={columnsData} data={tableData} />
			</Box>
		</Fragment>
	);
};

export default SpecializationPage;
