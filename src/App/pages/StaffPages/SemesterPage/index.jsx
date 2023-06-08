import moment from 'moment';
import { useGetAllSemestersQuery } from '@/App/providers/apis/semesterApi';
import Button from '@/Core/components/common/Button';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import tw from 'twin.macro';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { campusDataValidator } from '@/App/schemas/campusSchema';
import AddSemesterSlideOver from './components/AddSemesterSlideOver';
import UpdateSemesterModal from './components/UpdateSemesterModal';

const SemesterPage = () => {
	const [slideOverVisibility, setSlideOverVisibility] = useState(false);
	const [modal, setModal] = useState(false);
	const [semester, setSemester] = useState();
	const { currentCampus } = useSelector((state) => state.campus);
	const { data: semesters } = useGetAllSemestersQuery({ campus_id: currentCampus?._id });
	const { reset } = useForm({
		resolver: yupResolver(campusDataValidator)
	});
	const [canCreateSemester, setCanCreateSemester] = useState(false);

	useEffect(() => {
		setCanCreateSemester(!!semesters?.defaultSemester === false);
	}, [semesters]);

	const tableData = useMemo(() => {
		return Array.isArray(semesters?.listSemesters)
			? semesters?.listSemesters?.map((semester, index) => ({
					...semester,
					name: semester.name.toUpperCase(),
					end_time: moment(semester.end_time).format('DD/MM/YYYY'),
					start_time: moment(semester.start_time).format('DD/MM/YYYY'),
					index: index + 1
			  }))
			: [];
	}, [semesters]);

	// handle update semester
	const onOpenUpdate = (data) => {
		const selectedSemester = semesters.listSemesters && semesters.listSemesters.find((item) => item?._id === data);
		if (selectedSemester) {
			setSemester(selectedSemester);
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
				Header: 'Tên kì',
				accessor: 'name'
			},
			{
				Header: 'Thời gian bắt đầu',
				accessor: 'start_time'
			},
			{
				Header: 'Thời gian kết thúc',
				accessor: 'end_time'
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
					</ButtonList>
				)
			}
		],
		[tableData]
	);

	return (
		<Fragment>
			<AddSemesterSlideOver
				curSemester={tableData}
				open={slideOverVisibility}
				onOpen={setSlideOverVisibility}
				panelTitle={'Thêm kì học'}
			/>

			<UpdateSemesterModal
				openState={modal}
				onOpenStateChange={setModal}
				title={'Sửa kì học'}
				semesterData={semester}
			/>

			<Box>
				<ButtonList>
					<Button
						type='button'
						variant={canCreateSemester ? 'primary' : 'disabled'}
						size='sm'
						onClick={() => {
							reset();
							setSlideOverVisibility(!slideOverVisibility);
						}}>
						<PlusIcon className='h-4 w-4 text-[inherit] ' /> Thêm kì học
					</Button>
				</ButtonList>

				<ReactTable columns={columnsData} data={tableData} />
			</Box>
		</Fragment>
	);
};

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex items-center gap-px`;

export default SemesterPage;
