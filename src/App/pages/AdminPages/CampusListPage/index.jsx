/* eslint-disable react/prop-types */
import { useDeleteCampusMutation, useGetAllCampusQuery } from '@/App/store/apis/campusApi';
import { campusDataValidator } from '@/App/schemas/campusSchema';
import Button from '@/Core/components/common/Button';
import PopConfirm from '@/Core/components/common/Popup/PopConfirm';
import DataTable from '@/Core/components/common/Table/DataTable';
import { PlusIcon } from '@heroicons/react/20/solid';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Fragment, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import AddCampusSlideOver from './components/AddCampusSlideOver';
import UpdateCampusModal from './components/UpdateCampusModal';
import Text from '@/Core/components/common/Text/Text';

const CampusListPage = () => {
	const [handleRemoveCampus] = useDeleteCampusMutation();
	const [slideOverVisibility, setSlideOverVisibility] = useState(false);
	const [modal, setModal] = useState(false);
	const [campus, setCampus] = useState();
	const { data: campusList, isLoading, refetch, isFetching } = useGetAllCampusQuery();

	const { reset } = useForm({
		resolver: yupResolver(campusDataValidator)
	});

	const tableData = useMemo(() => campusList ?? [], [campusList]);

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
				accessor: 'name',
				Cell: ({ value }) => <Text className='capitalize'>{value}</Text>
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
							title={'Xóa cơ sở'}
							onConfirm={() => onDeleteSubmit(value)}
							description={'Bạn muốn xóa cơ sở này ?'}>
							<Button size='xs' variant='ghost' className='text-error' shape='square'>
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

				<DataTable
					columns={columnsData}
					data={tableData}
					onHandleRefetch={refetch}
					loading={isLoading || isFetching}
				/>
			</Box>
		</Fragment>
	);
};

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex items-center gap-px`;

export default CampusListPage;
