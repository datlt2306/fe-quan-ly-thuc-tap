import { useGetAllCompanyQuery } from '@/App/store/apis/businessApi';
import { useGetSetTimeQuery } from '@/App/store/apis/configTimesApi';
import { useGetAllSemestersQuery } from '@/App/store/apis/semesterApi';
import Button from '@/Core/components/common/Button';
import Modal from '@/Core/components/common/Modal';
import DataTable from '@/Core/components/common/Table/DataTable';
import { InputColumnFilter, SelectColumnFilter } from '@/Core/components/common/Table/components/ReactTableFilters';
import Text from '@/Core/components/common/Text/Text';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import tw from 'twin.macro';
import { columnAccessors } from '../../StaffPages/CompanyPages/constants';
import EmptyStateSection from '../Shared/EmptyStateSection';
import LoadingData from '../Shared/LoadingData';

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

	const {
		data: companies,
		isLoading: companyLoading,
		refetch,
		isFetching
	} = useGetAllCompanyQuery({ semester_id: currentSemester });

	const columnsData = useMemo(
		() => [
			{
				Header: columnAccessors.index,
				accessor: 'index'
			},
			{
				Header: columnAccessors.business_code,
				accessor: 'business_code',
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
				Cell: ({ value }) => <Text className='font-medium uppercase'>{value}</Text>
			},
			{
				Header: columnAccessors.tax_code,
				accessor: 'tax_code',
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
				Cell: ({ value }) => <Text className='font-medium uppercase'>{value}</Text>
			},
			{
				Header: columnAccessors.name,
				accessor: 'name',
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true
			},
			{
				Header: columnAccessors.internship_position,
				accessor: 'internship_position',
				Filter: InputColumnFilter,
				filterable: true
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
				Cell: ({ value }) => <Text className='truncate whitespace-normal'>{value}</Text>
			},
			{
				Header: 'Chi tiết',
				accessor: '',
				Cell: ({ row }) => (
					<Button
						variant='ghost'
						size='sm'
						className='font-normal'
						onClick={() => {
							setDataModal({ data: row.original, title: row.original?.name });
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
		<Container>
			{deadlineCheck ? (
				<Fragment>
					<Modal openState={modal} onOpenStateChange={setModal} title={dataModal.title}>
						<Modal.Content>
							<List>
								<List.Item>{columnAccessors.requirement}</List.Item>
								<List.Item>{dataModal.data?.requirement || 'Không có'}</List.Item>
							</List>
							<List>
								<List.Item>{columnAccessors.description}</List.Item>
								<List.Item>{dataModal.data?.description || 'Không có'}</List.Item>
							</List>
							<List>
								<List.Item>{columnAccessors.benefit}</List.Item>
								<List.Item>{dataModal.data?.benefit || 'Không có'}</List.Item>
							</List>
						</Modal.Content>
					</Modal>

					<DataTable
						columns={columnsData}
						data={companies ?? []}
						loading={companyLoading || isFetching}
						onHandleRefetch={refetch}
					/>
				</Fragment>
			) : (
				<EmptyStateSection title={'Thời gian hiển thị thông tin tuyển dụng đã kết thúc'} />
			)}
		</Container>
	);
};

const Container = tw.div`h-full`;
const List = tw.ol`grid grid-cols-[1fr,3fr] [&>:first-child]:(font-medium)`;
List.Item = tw.li`whitespace-normal first-letter:uppercase p-4`;
Modal.Content = tw.div`flex flex-col items-stretch divide-y divide-gray-200 max-w-2xl`;

export default CompanyListPage;
