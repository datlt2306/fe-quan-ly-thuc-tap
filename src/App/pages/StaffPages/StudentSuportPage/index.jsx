import {
	useGetRequestOfStudentQuery,
	useRemoveRequestApiMutation,
	useResetStudentRequestMutation
} from '@/App/providers/apis/requestStudentsApi';
import Button from '@/Core/components/common/Button';
import { Option, Select } from '@/Core/components/common/FormControl/SelectFieldControl';
import PopConfirm from '@/Core/components/common/Popup/PopConfirm';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import { InputColumnFilter, SelectColumnFilter } from '@/Core/components/common/Table/ReactTableFilters';
import moment from 'moment';
import React, { useMemo, useState, useEffect } from 'react';
import tw from 'twin.macro';
import { RequestStudentStatusEnum } from '@/App/constants/requestStudents';
import { RequestSupportType } from '@/App/constants/studentConstants';
import { toast } from 'react-toastify';
import Text from '@/Core/components/common/Text/Text';

const StudentSupportPage = () => {
	const { data: studentRequests, refetch, isLoading } = useGetRequestOfStudentQuery();
	const [handleAccept] = useResetStudentRequestMutation();
	const [handleReject] = useRemoveRequestApiMutation();
	const [tableData, setTableData] = useState([]);

	useEffect(() => {
		setTableData((_prev) =>
			Array.isArray(studentRequests?.data) ? studentRequests?.data.filter((item) => item.status === 1) : []
		);
	}, [studentRequests]);

	const handleAcceptRequest = async (data) => {
		try {
			await handleAccept({
				userId: data?.userId?._id,
				type: data?.type,
				id: data?._id
			});
			refetch();
			toast.success('Đã chấp nhận yêu cầu của sinh viên.');
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

	const columnsData = useMemo(
		() => [
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
				Cell: ({ value }) => <Text>{moment(value).format('DD/MM/YYYY')}</Text>
			},
			{
				Header: 'Hành động',
				accessor: '_id',
				Cell: ({ row }) => {
					return (
						<ActionList className={row.original.status !== 1 ? 'hidden' : ''}>
							<PopConfirm
								okText='Ok'
								cancelText='Cancel'
								title={'Chấp nhận yêu cầu'}
								description={'Bạn muốn chấp nhận yêu cầu này ?'}
								onConfirm={() => handleAcceptRequest(row.original)}>
								<Button type='button' size='xs' variant='success'>
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
						</ActionList>
					);
				}
			}
		],
		[studentRequests]
	);

	return (
		<div>
			<SelectBox>
				<Text
					as='label'
					htmlFor='semester-list'
					className='inline-flex items-center gap-2 whitespace-nowrap text-base-content'>
					Trạng thái
				</Text>
				<Select
					className='max-w-[12rem] capitalize sm:text-sm'
					onChange={(e) => setTableData(studentRequests?.data.filter((item) => item.status == e.target.value))}>
					{Object.entries(RequestStudentStatusEnum).map(([key, value]) => (
						<Option value={key} key={key} selected={key === 1}>
							{value}
						</Option>
					))}
				</Select>
			</SelectBox>
			<ReactTable columns={columnsData} data={tableData} loading={isLoading} />
		</div>
	);
};

const ActionList = tw.div`flex items-stretch gap-1`;
const SelectBox = tw.div`flex basis-1/4 items-center gap-2 mb-4`;

export default StudentSupportPage;
