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

const index = () => {
	const { data, refetch, isLoading } = useGetRequestOfStudentQuery();
	const [handleAccept] = useResetStudentRequestMutation();
	const [handleReject] = useRemoveRequestApiMutation();
	const [tableData, setTableData] = useState([]);
	useEffect(() => {
		setTableData(data?.data.filter((item) => item.status === 1));
	}, [data]);

	const columnsData = useMemo(
		() => [
			{
				Header: 'STT',
				accessor: 'STT',
				Cell: ({ row }) => <span className='font-medium'>{row.index + 1}</span>
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
				Cell: ({ value }) => <div className='max-w-xs whitespace-normal'>{value}</div>
			},
			{
				Header: 'Ngày tạo',
				accessor: 'createAt',
				Filter: InputColumnFilter,
				sortable: true,
				Cell: ({ value }) => <div>{moment(value.substring(0, 10), 'YYYY-MM-DD').format('DD/MM/YYYY')}</div>
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
								onConfirm={async () => {
									await handleAccept({
										userId: row.original.userId._id,
										type: row.original.type,
										id: row.original._id
									});
									refetch();
								}}>
								<Button type='button' size='xs' variant='success'>
									Đồng ý
								</Button>
							</PopConfirm>
							<PopConfirm
								okText='Ok'
								cancelText='Cancel'
								title={'Từ chối yêu cầu'}
								description={'Bạn muốn từ chối yêu cầu này ?'}
								onConfirm={async () => {
									await handleReject(row.original._id);
									refetch();
								}}>
								<Button type='button' size='xs' variant='error'>
									Từ chối
								</Button>
							</PopConfirm>
						</ActionList>
					);
				}
			}
		],
		[data]
	);

	return (
		<div>
			<SelectBox>
				<label
					htmlFor='semester-list'
					className='inline-flex items-center gap-2 whitespace-nowrap text-base-content'>
					Trạng thái
				</label>
				<Select
					className='max-w-[12rem] capitalize sm:text-sm'
					onChange={(e) => setTableData(data?.data.filter((item) => item.status == e.target.value))}>
					{Object.entries(RequestStudentStatusEnum).map(([key, value]) => (
						<Option value={key} key={key} selected={key === 1}>
							{value}
						</Option>
					))}
				</Select>
			</SelectBox>
			<ReactTable columns={columnsData} data={tableData || []} loading={isLoading} />
		</div>
	);
};

const ActionList = tw.div`flex items-stretch gap-1`;
const SelectBox = tw.div`flex basis-1/4 items-center gap-2 mb-4`;

export default index;
