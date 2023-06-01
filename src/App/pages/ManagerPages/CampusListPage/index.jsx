/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { useDeleteCampusMutation, useGetAllCampusQuery } from '@/App/providers/apis/campusApi';
import { useForm } from 'react-hook-form';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import { Fragment, useMemo, useState } from 'react';
import tw from 'twin.macro';
import Button from '@/Core/components/common/Button';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import PopConfirm from '@/Core/components/common/Popup/PopConfirm';
import AddCampusSlideOver from './components/AddCampusSlideOver';
import { campusDataValidator } from '@/App/schemas/campusSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import UpdateCampusModal from './components/UpdateCampusModal';
import { PlusIcon } from '@heroicons/react/20/solid';

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex items-center gap-2`;

const CampusListPage = () => {
	const [slideOverVisibility, setSlideOverVisibility] = useState(false);
	const [modal, setModal] = useState(false);
	const [campus, setCampus] = useState();
	const { reset } = useForm({
		resolver: yupResolver(campusDataValidator)
	});
	const { data: managers, isLoading } = useGetAllCampusQuery();

	const tableData = useMemo(() => {
		return Array.isArray(managers?.listCampus)
			? managers?.listCampus?.map((user, index) => ({ ...user, index: index + 1 }))
			: [];
	}, [managers]);

	const [handleRemoveCampus] = useDeleteCampusMutation();

	const onDeleteSubmit = async (id) => {
		const result = await handleRemoveCampus(id);

		if (result?.data?.statusCode) {
			toast.error('Xóa không thành công!');
			return;
		}
		toast.success('Xóa cơ sở thành công!');
	};

	const onOpenUpdate = (data) => {
		const selectedCampus = tableData && tableData.find((item) => item?._id === data);
		if (selectedCampus) {
			setCampus(selectedCampus);
			setModal(!modal);
		}
	};

	const columnsData = useMemo(
		() => [
			{
				Header: 'STT',
				accessor: 'index'
			},
			{
				Header: 'Tên cơ sở',
				accessor: 'name'
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
							title={'Xóa cơ sở'}
							onConfirm={() => onDeleteSubmit(value)}
							description={'Bạn muốn xóa cơ sở này ?'}>
							<Button size='xs' variant='error' shape='square'>
								<TrashIcon className='h-4 w-4' />
							</Button>
						</PopConfirm>
					</ButtonList>
				)
			}
		],
		[tableData]
	);
	return (
		<Fragment>
			<AddCampusSlideOver
				curCampus={tableData}
				open={slideOverVisibility}
				onOpen={setSlideOverVisibility}
				panelTitle={'Thêm cơ sở'}
			/>

			<UpdateCampusModal
				openState={modal}
				onOpenStateChange={setModal}
				title={'Sửa cơ sở'}
				campusData={campus}
				curCampus={tableData}
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
						<PlusIcon className='h-4 w-4 text-[inherit] ' /> Thêm cơ sở
					</Button>
				</ButtonList>

				<ReactTable columns={columnsData} data={tableData} loading={isLoading} />
			</Box>
		</Fragment>
	);
};

export default CampusListPage;
