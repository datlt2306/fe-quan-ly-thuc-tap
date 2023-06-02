import { useGetAllCompanyQuery } from '@/App/providers/apis/businessApi';
import { useGetAllSemestersQuery } from '@/App/providers/apis/semesterApi';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { columnAccessors } from '../../StaffPages/CompanyPages/constants';
import { InputColumnFilter, SelectColumnFilter } from '@/Core/components/common/Table/ReactTableFilters';
import Button from '@/Core/components/common/Button';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import Modal from '@/Core/components/common/Modal';
import { useGetSetTimeQuery } from '@/App/providers/apis/configTimesApi';
import LoadingData from '../Shared/LoadingData';
import EmptyStateSection from '../Shared/EmptyStateSection';

const CompanyListPage = () => {
	const { data: times, isLoading: getTimeLoading } = useGetSetTimeQuery({ typeNumber: 1 });
	const deadlineCheck =
		times && times?.time?.endTime > new Date().getTime() && times?.time?.startTime < new Date().getTime();
	const [modal, setModal] = useState(false);
	const [dataModal, setDataModal] = useState({});
	const campus = useSelector((state) => state.campus);
	const { data: semesterData } = useGetAllSemestersQuery({ campus_id: campus?.currentCampus?._id });
	const [currentSemester, setCurrentSemester] = useState();
	useEffect(() => {
		setCurrentSemester(semesterData?.defaultSemester?._id);
	}, [semesterData]);
	const { data: company, isLoading: companyLoading } = useGetAllCompanyQuery(
		{ limit: 1000, semester_id: currentSemester },
		{ refetchOnMountOrArgChange: true }
	);

	const columnsData = useMemo(
		() => [
			{
				Header: columnAccessors.index,
				accessor: 'STT',
				Cell: ({ row }) => <span className='font-medium'>{row.index + 1}</span>
			},
			{
				Header: columnAccessors.business_code,
				accessor: 'business_code',
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
				Cell: ({ value }) => <span className='font-medium uppercase'>{value}</span>
			},
			{
				Header: columnAccessors.tax_code,
				accessor: 'tax_code',
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
				Cell: ({ value }) => <span className='font-medium uppercase'>{value}</span>
			},
			{
				Header: columnAccessors.name,
				accessor: 'name',
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
				canSort: true,
				canFilter: true,
				Cell: ({ value }) => (
					<div className='w-full max-w-xs overflow-hidden'>
						<p className='overflow-ellipsis whitespace-normal'>{value}</p>
					</div>
				)
			},
			{
				Header: columnAccessors.internship_position,
				accessor: 'internship_position',
				Filter: InputColumnFilter,
				filterable: true,
				Cell: ({ value }) => (
					<div className='w-full max-w-xs overflow-hidden'>
						<p className='overflow-ellipsis whitespace-normal'>{value}</p>
					</div>
				)
			},
			{
				Header: columnAccessors.amount,
				accessor: 'amount',
				Filter: SelectColumnFilter,
				sortable: true
			},
			{
				Header: columnAccessors.major,
				accessor: 'major.name',
				Filter: SelectColumnFilter,
				filterable: true,
				sortable: true
			},
			{
				Header: columnAccessors.address,
				accessor: 'address',
				Filter: InputColumnFilter,
				filterable: true,
				Cell: ({ value }) => (
					<div className='max-w- w-full overflow-hidden'>
						<p className='overflow-ellipsis whitespace-normal'>{value}</p>
					</div>
				)
			},
			{
				Header: columnAccessors.requirement,
				accessor: 'requirement',
				Filter: InputColumnFilter,
				Cell: ({ value }) => (
					<Button
						variant='ghost'
						size='sm'
						className='font-normal'
						onClick={() => {
							setDataModal({ data: value, title: columnAccessors.requirement });
							setModal(!modal);
						}}>
						Chi tiết
					</Button>
				)
			},
			{
				Header: columnAccessors.description,
				accessor: 'description',
				Filter: InputColumnFilter,
				Cell: ({ value }) => (
					<Button
						variant='ghost'
						size='sm'
						className='font-normal'
						onClick={() => {
							setDataModal({ data: value, title: columnAccessors.description });
							setModal(!modal);
						}}>
						Chi tiết
					</Button>
				)
			},
			{
				Header: columnAccessors.benefit,
				accessor: 'benefit',
				Filter: InputColumnFilter,
				Cell: ({ value }) => (
					<Button
						variant='ghost'
						size='sm'
						className='font-normal'
						onClick={() => {
							setDataModal({ data: value, title: columnAccessors.benefit });
							setModal(!modal);
						}}>
						Chi tiết
					</Button>
				)
			}
		],
		[]
	);
	if (getTimeLoading) {
		return <LoadingData />;
	}
	return (
		<div>
			{deadlineCheck ? (
				<div>
					<ReactTable columns={columnsData} data={company?.list || []} loading={companyLoading} />
					<Modal openState={modal} onOpenStateChange={setModal} title={dataModal?.title}>
						<p className='text-base-content'>{dataModal?.data}</p>
					</Modal>
				</div>
			) : (
				<EmptyStateSection title={'Thời gian hiển thị thông tin tuyển dụng đã kết thúc'} />
			)}
		</div>
	);
};

export default CompanyListPage;
