import { useExportToExcel, useImportFromExcel } from '@/App/hooks/useExcel';
import {
	useAddArrayCompanyMutation,
	useDeleteCompanyMutation,
	useGetAllCompanyQuery
} from '@/App/providers/apis/businessApi';
import { useGetAllMajorQuery } from '@/App/providers/apis/majorApi';
import { companyArraySchema } from '@/App/schemas/companySchema';
import Button from '@/Core/components/common/Button';
import { Option, Select } from '@/Core/components/common/FormControl/SelectFieldControl';
import Modal from '@/Core/components/common/Modal';
import PopConfirm from '@/Core/components/common/Popup/PopConfirm';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import { InputColumnFilter, SelectColumnFilter } from '@/Core/components/common/Table/ReactTableFilters';
import Text from '@/Core/components/common/Text/Text';
import { AllowedFileExtension } from '@/Core/constants/allowedFileType';
import { StaffPaths } from '@/Core/constants/routePaths';
import { convertToExcelData } from '@/Core/utils/excelDataHandler';
import getFileExtension from '@/Core/utils/getFileExtension';
import { CalendarDaysIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import DesktopButtonGroup from './components/DesktopButtonGroup';
import MobileDropdownButtonGroup from './components/MobileDropdownButtonGroup';
import { columnAccessors } from './constants';

const CompanyListPage = () => {
	const [modal, setModal] = useState(false);
	const [dataModal, setDataModal] = useState({});
	const { data: majors } = useGetAllMajorQuery(null, { refetchOnMountOrArgChange: true });
	const campus = useSelector((state) => state.campus);
	const { defaultSemester, listSemesters } = useSelector((state) => state.semester);
	const [currentSemester, setCurrentSemester] = useState(defaultSemester?._id);
	const [handleDeleteCompany] = useDeleteCompanyMutation();
	const { data: company, isLoading: companyLoading } = useGetAllCompanyQuery({
		limit: 1000,
		semester_id: currentSemester
	});
	const tableData = useMemo(() => company?.data ?? [], [company]);

	const [handleImportFile] = useImportFromExcel();
	const { handleExportFile } = useExportToExcel();
	const [handleAddArrayCompany] = useAddArrayCompanyMutation();
	const fileInputRef = useRef(null);
	useEffect(() => {
		setCurrentSemester(defaultSemester?._id);
	}, [defaultSemester]);

	const handleChangeSemester = (id) => {
		setCurrentSemester(id);
	};

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
	const handleImportCompanies = (file) => {
		const fileExtension = getFileExtension(file);
		if (fileExtension !== AllowedFileExtension.XLSX) {
			toast.error('File import không hợp lệ');
			fileInputRef.current.value = null;
			return;
		}
		handleImportFile(file, importExcelDataCallback);
		fileInputRef.current.value = null; // reset input file after imported
	};

	const handleExportDataToExcel = () => {
		if (!tableData.length) {
			toast.warn('Chưa có dữ liệu để xuất file !');
			return;
		}
		const newData = tableData.map((company, index) => {
			return {
				...company,
				major: company.major.name,
				campus_id: campus?.campusList?.listCampus?.find((item) => item._id === company.campus_id).name,
				semester_id: listSemesters.find((item) => item._id === company.semester_id).name,
				index: index + 1
			};
		});
		const exportedData = convertToExcelData({
			data: newData,
			columnKeysAccessor: columnAccessors
		});
		if (!exportedData) {
			toast.error('Export dữ liệu thất bại !');
			return;
		}
		handleExportFile({ data: exportedData, fileName: 'Danh sách doanh nghiệp' });
	};

	// Define columns of table
	const columnsData = [
		{
			Header: columnAccessors.index,
			accessor: 'STT',
			Cell: ({ row }) => <Text className='font-medium'>{row.index + 1}</Text>
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
		},
		{
			Header: 'Thao tác',
			accessor: '_id',
			canFilter: false,
			canSort: false,
			filterable: false,
			isSort: false,
			Cell: ({ value }) => (
				<ActionList>
					<Button
						as={Link}
						to={StaffPaths.COMPANY_UPDATE.replace(':id', value)}
						type='button'
						size='sm'
						shape='square'
						variant='ghost'>
						<PencilSquareIcon className='h-4 w-4' />
					</Button>
					<PopConfirm
						okText='Ok'
						cancelText='Cancel'
						title={'Xóa công ty'}
						description={'Bạn muốn xóa công ty này ?'}
						// onCancel={() => toast.info("Cancelled")}
						onConfirm={() => onDeleteSubmit(value)}>
						<Button size='sm' variant='ghost' className='text-error' shape='square'>
							<TrashIcon className='h-4 w-4' />
						</Button>
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
						onChange={(e) => handleChangeSemester(e.target.value)}>
						{Array.isArray(listSemesters) &&
							listSemesters.map((item, index) => (
								<Option value={item._id} key={index} selected={currentSemester === item._id}>
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
			<ReactTable columns={columnsData} data={tableData || []} loading={companyLoading} />
			<Modal openState={modal} onOpenStateChange={setModal} title={dataModal?.title}>
				<Text className='text-base-content'>{dataModal?.data}</Text>
			</Modal>
		</Container>
	);
};

const ActionList = tw.div`flex items-stretch gap-1`;
const Container = tw.div`flex flex-col gap-6 h-full `;
const Box = tw.div`flex items-center justify-between lg:flex-row-reverse`;
const SelectBox = tw.div`flex basis-1/4 items-center gap-2`;

export default CompanyListPage;
