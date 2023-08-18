import { RequestSupportType, StudentSupportStatus } from '@/App/constants/studentConstants';
import {
	useGetRequestOfStudentQuery,
	useRemoveRequestApiMutation,
	useResetStudentRequestMutation
} from '@/App/store/apis/requestStudentsApi';
import Button from '@/Core/components/common/Button';
import PopConfirm from '@/Core/components/common/Popup/PopConfirm';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import { InputColumnFilter, SelectColumnFilter } from '@/Core/components/common/Table/components/ReactTableFilters';
import Text from '@/Core/components/common/Text/Text';
import { formatDate } from '@/Core/utils/formatDate';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

const StudentSupportPage = () => {
	const {
		data: studentRequests,
		refetch,
		isLoading,
		isFetching
	} = useGetRequestOfStudentQuery(undefined, { refetchOnMountOrArgChange: true });
	const [handleAccept] = useResetStudentRequestMutation();
	const [handleReject] = useRemoveRequestApiMutation();
	const [tableData, setTableData] = useState([]);

	useEffect(() => {
		setTableData((_prev) =>
			Array.isArray(studentRequests)
				? studentRequests.filter((item) => item.status === StudentSupportStatus.IN_PROCESS)
				: []
		);
	}, [studentRequests]);

	const handleAcceptRequest = async (data) => {
		try {
			await handleAccept({
				userId: data?.userId?._id,
				type: data?.type,
				id: data?._id
			});
			toast.success('Đã chấp nhận yêu cầu của sinh viên.');
			refetch();
		} catch (error) {
			toast.error('Đã có lỗi xảy ra !');
		}
	};

	const handleRejectRequest = async (data) => {
		try {
			await handleReject(data?._id);
			refetch();
			toast.info('Đã từ chối yêu cầu của sinh viên.');
		} catch (error) {
			toast.error('Đã có lỗi xảy ra !');
		}
	};

	const columnsData = useMemo(() => {
		const column = [
			{
				Header: 'STT',
				accessor: 'STT',
				Cell: ({ row }) => <Text className='font-medium'>{row.index + 1}</Text>
			},
			{
				Header: 'Tên sinh viên',
				accessor: 'userId.name',
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true
			},
			{
				Header: 'MSSV',
				accessor: 'userId.mssv',
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true
			},
			{
				Header: 'Loại',
				accessor: 'type',
				Filter: SelectColumnFilter,
				filterable: true,
				Cell: ({ value }) => {
					switch (value) {
						case RequestSupportType.INTERN_REGISTRATION:
							return 'Đăng ký thực tập';
						case RequestSupportType.RECORD:
							return 'Biên bản';
						case RequestSupportType.REPORT:
							return 'Báo cáo';
						default:
							return null;
					}
				}
			},
			{
				Header: 'Mô tả',
				accessor: 'description',
				Filter: InputColumnFilter,
				Cell: ({ value }) => <Text className='max-w-xs whitespace-normal'>{value}</Text>
			},
			{
				Header: 'Ngày tạo',
				accessor: 'createAt',
				Filter: InputColumnFilter,
				sortable: true,
				Cell: ({ value }) => <Text>{formatDate(value)}</Text>
			},
			{
				Header: 'Hành động',
				accessor: '_id',
				Cell: ({ row }) => {
					return (
						<ButtonList>
							<PopConfirm
								okText='Ok'
								cancelText='Cancel'
								title={'Chấp nhận yêu cầu'}
								description={'Bạn muốn chấp nhận yêu cầu này ?'}
								onConfirm={() => handleAcceptRequest(row.original)}>
								<Button type='button' size='xs' variant='ghost'>
									Đồng ý
								</Button>
							</PopConfirm>
							<PopConfirm
								okText='Ok'
								cancelText='Cancel'
								title={'Từ chối yêu cầu'}
								description={'Bạn muốn từ chối yêu cầu này ?'}
								onConfirm={() => handleRejectRequest(row.original)}>
								<Button type='button' size='xs' variant='error'>
									Từ chối
								</Button>
							</PopConfirm>
						</ButtonList>
					);
				}
			}
		];

		return column;
	}, [studentRequests, status]);

	return (
		<ReactTable columns={columnsData} data={tableData} loading={isLoading || isFetching} onHandleRefetch={refetch} />
	);
};

const ButtonList = tw.div`flex items-center gap-1`;

export default StudentSupportPage;
