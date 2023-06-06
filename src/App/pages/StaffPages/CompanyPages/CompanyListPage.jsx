import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CalendarDaysIcon, EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useExportToExcel, useImportFromExcel } from '@/App/hooks/useExcel';
import useServerPagination from '@/App/hooks/useServerPagination';
import {
	useAddArrayCompanyMutation,
	useDeleteCompanyMutation,
	useGetAllCompanyQuery
} from '@/App/providers/apis/businessApi';
import { useGetAllMajorQuery } from '@/App/providers/apis/majorApi';
import { companyArraySchema } from '@/App/schemas/companySchema';
import Button from '@/Core/components/common/Button';
import { Option, Select } from '@/Core/components/common/FormControl/SelectFieldControl';
import PopConfirm from '@/Core/components/common/Popup/PopConfirm';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import { InputColumnFilter, SelectColumnFilter } from '@/Core/components/common/Table/ReactTableFilters';
import Text from '@/Core/components/common/Text/Text';
import { AllowedFileExtension } from '@/Core/constants/allowedFileType';
import { StaffPaths } from '@/Core/constants/routePaths';
import { convertToExcelData } from '@/Core/utils/excelDataHandler';
import getFileExtension from '@/Core/utils/getFileExtension';
import tw from 'twin.macro';
import CompanyDetailModal from './components/CompanyDetailModal';
import DesktopButtonGroup from './components/DesktopButtonGroup';
import MobileDropdownButtonGroup from './components/MobileDropdownButtonGroup';
import { columnAccessors } from './constants';

const CompanyListPage = () => {
	const [handleDeleteCompany] = useDeleteCompanyMutation();
	const [handleImportFile] = useImportFromExcel();
	const [handleExportFile] = useExportToExcel();
	const [handleAddArrayCompany] = useAddArrayCompanyMutation();
	const [modalState, setModalState] = useState(false);
	const [dataModal, setDataModal] = useState({});
	const campus = useSelector((state) => state.campus);
	const { defaultSemester, listSemesters } = useSelector((state) => state.semester);
	const [currentSemester, setCurrentSemester] = useState(defaultSemester?._id);
	const { paginationState, handlePaginate } = useServerPagination();
	const fileInputRef = useRef(null);
	const { data: majors } = useGetAllMajorQuery(undefined, { refetchOnMountOrArgChange: true });
	const { data: companies, isLoading: companyLoading } = useGetAllCompanyQuery({
		page: paginationState?.pageIndex,
		limit: paginationState?.pageSize,
		semester_id: currentSemester
	});
	const tableData = useMemo(() => companies?.data ?? [], [companies]);
	console.log('tableData :>> ', tableData);

	useEffect(() => {
		setCurrentSemester(defaultSemester?._id);
	}, [defaultSemester]);

	// hanle delete company
	const onDeleteSubmit = async (id) => {
		const result = await handleDeleteCompany({ id });
		if (result?.error) {
			toast.error(result?.error?.message || 'Xóa doanh nghiệp thất bại');
			return;
		}
		toast.success('Đã xóa doanh nghiệp thành công');
	};

	// Callback function will be executed after import file excel
	const importExcelDataCallback = (excelData) => {
		if (!excelData.length) {
			toast.warn('Vui lòng nhập thông tin đầy đủ!');
		}
		if (excelData.length) {
			const newCompanyList = excelData.map((obj) => ({
				name: obj[columnAccessors.name],
				business_code: obj[columnAccessors.business_code],
				tax_code: obj[columnAccessors.tax_code],
				internship_position: obj[columnAccessors.internship_position],
				major: obj[columnAccessors.major],
				amount: obj[columnAccessors.amount],
				address: obj[columnAccessors.address],
				requirement: obj[columnAccessors.requirement],
				description: obj[columnAccessors.description],
				benefit: obj[columnAccessors.benefit]
			}));
			const newData = newCompanyList?.map((item) => ({
				...item,
				major: majors?.find((majorItem) => majorItem.majorCode === item.major)?._id
			}));
			companyArraySchema
				.validate(newData)
				.then(async (data) => {
					const response = await handleAddArrayCompany(data);
					if (response?.error) {
						toast.error('Import công ty thất bại');
					} else {
						toast.success('Import công ty thành công');
					}
				})
				.catch((error) => {
					toast.error(error?.message);
				});
		}
	};

	// Get file from device and execute callback to add new companies
	const handleImportCompanies = useCallback(
		(file) => {
			const fileExtension = getFileExtension(file);
			if (fileExtension !== AllowedFileExtension.XLSX) {
				toast.error('File import không hợp lệ');
				fileInputRef.current.value = null;
				return;
			}
			handleImportFile(file, importExcelDataCallback);
			fileInputRef.current.value = null; // reset input file after imported
		},
		[currentSemester]
	);
	const handleExportDataToExcel = useCallback(
		(data) => {
			if (!tableData.length) {
				toast.warn('Chưa có dữ liệu để xuất file !');
				return;
			}
			const exportData = tableData.map((company) => {
				return {
					...company,
					major: company.major?.name
				};
			});
			const exportedData = convertToExcelData({
				data: exportData,
				columnKeysAccessor: columnAccessors
			});
			if (!exportedData) {
				toast.error('Export dữ liệu thất bại !');
				return;
			}
			handleExportFile({ data: exportedData, fileName: 'Danh sách doanh nghiệp' });
		},
		[tableData]
	);

	// Define columns of table
	const columnsData = [
		{
			Header: columnAccessors.index,
			accessor: 'index'
		},
		{
			Header: columnAccessors.name,
			accessor: 'name',
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true
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
			Cell: ({ value }) => <Text className='whitespace-normal'>{value}</Text>
		},
		{
			Header: 'Thao tác',
			accessor: '_id',
			canFilter: false,
			canSort: false,
			filterable: false,
			isSort: false,
			Cell: ({ value, row }) => (
				<ActionList>
					<Button
						size='sm'
						shape='square'
						variant='ghost'
						icon={EyeIcon}
						onClick={() => {
							setModalState(!modalState);
							setDataModal({ data: row.original, title: row.original?.name });
						}}
					/>
					<Button
						as={Link}
						to={StaffPaths.COMPANY_UPDATE.replace(':id', value)}
						size='sm'
						shape='square'
						variant='ghost'
						icon={PencilSquareIcon}
					/>

					<PopConfirm
						title={'Xóa công ty'}
						description={'Bạn muốn xóa công ty này ?'}
						onConfirm={() => onDeleteSubmit(value)}>
						<Button size='sm' variant='ghost' className='text-error' shape='square' icon={TrashIcon} />
					</PopConfirm>
				</ActionList>
			)
		}
	];

	return (
		<Container>
			<Box>
				<SelectBox>
					<label
						htmlFor='semester-list'
						className='inline-flex items-center gap-2 whitespace-nowrap text-base-content'>
						<CalendarDaysIcon className='h-6 w-6' /> Kỳ học
					</label>
					<Select
						className='min-w-[12rem] capitalize sm:text-sm'
						defaultValue={currentSemester}
						onChange={(e) => setCurrentSemester(e.target.value)}>
						{Array.isArray(listSemesters) &&
							listSemesters.map((item, index) => (
								<Option value={item._id} key={index}>
									{item.name}
								</Option>
							))}
					</Select>
				</SelectBox>
				<DesktopButtonGroup
					tableData={tableData}
					handleExport={handleExportDataToExcel}
					handleImport={handleImportCompanies}
					canImport={currentSemester === defaultSemester?._id}
					ref={fileInputRef}
				/>
				<MobileDropdownButtonGroup
					tableData={tableData}
					handleExport={handleExportDataToExcel}
					handleImport={handleImportCompanies}
					canImport={currentSemester === defaultSemester?._id}
					ref={fileInputRef}
				/>
			</Box>
			<CompanyDetailModal modalData={dataModal} openState={modalState} onOpenStateChange={setModalState} />
			<ReactTable
				columns={columnsData}
				data={tableData}
				loading={companyLoading}
				serverSidePagination={true}
				serverPaginationProps={{
					...paginationState,
					pageIndex: companies?.page,
					totalPages: companies?.totalPages,
					canNextPage: companies?.hasNextPage,
					canPreviousPage: companies?.hasPrevPage
				}}
				onServerPaginate={handlePaginate}
			/>
		</Container>
	);
};

const ActionList = tw.div`flex items-stretch`;
const Container = tw.div`flex flex-col gap-6 h-full `;
const Box = tw.div`flex items-center justify-between lg:flex-row-reverse`;
const SelectBox = tw.div`flex basis-1/4 items-center gap-2`;

export default CompanyListPage;
