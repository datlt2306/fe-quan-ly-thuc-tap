import { InternSupportType, StudentStatusEnum, StudentStatusGroupEnum } from '@/App/constants/studentStatus';
import { useExportToExcel, useImportFromExcel } from '@/App/hooks/useExcel';
import { useGetAllSemestersQuery } from '@/App/providers/apis/semesterApi';
import { useAddStudentsMutation, useGetStudentsQuery } from '@/App/providers/apis/studentApi';
import { newStudentSchema } from '@/App/schemas/studentSchema';
import Badge from '@/Core/components/common/Badge';
import Button from '@/Core/components/common/Button';
import { Option, Select } from '@/Core/components/common/FormControl/SelectFieldControl';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import { InputColumnFilter, SelectColumnFilter } from '@/Core/components/common/Table/ReactTableFilters';
import { AllowedFileExt } from '@/Core/constants/allowedFileType';
import HttpStatusCode from '@/Core/constants/httpStatus';
import { convertToExcelData } from '@/Core/utils/excelDataHandler';
import formatDate from '@/Core/utils/formatDate';
import getFileExtension from '@/Core/utils/getFileExtension';
import { CalendarDaysIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import DesktopButtonGroup from './components/DesktopButtonGroup';
import MobileDropdownButtonGroup from './components/MobileDropdownButtonGroup';
import { columnAccessors } from './constants';

const handleGetInternStatusStyle = (value) => {
	const style = Object.keys(StudentStatusGroupEnum).find((k) => StudentStatusGroupEnum[k].includes(value));
	return style;
};

const StudentListPage = () => {
	const { currentCampus } = useSelector((state) => state.campus);
	const [handleImportFile] = useImportFromExcel();
	const { handleExportFile } = useExportToExcel();
	const [addStudents] = useAddStudentsMutation();
	const { data: semesterData } = useGetAllSemestersQuery({ campus_id: currentCampus?._id });
	const [currentSemester, setCurrentSemester] = useState();
	const [defaultSemster, setDefaultSemster] = useState();
	const { data: studentsListData, isLoading } = useGetStudentsQuery(
		{ semester: currentSemester },
		{ refetchOnMountOrArgChange: true }
	);
	const fileInputRef = useRef(null);
	const toastId = useRef(null);

	useEffect(() => {
		setCurrentSemester(semesterData?.defaultSemester?._id);
		setDefaultSemster(semesterData?.defaultSemester?._id);
	}, [semesterData]);

	const tableData = useMemo(() => {
		return Array.isArray(studentsListData)
			? studentsListData.map((student, index) => ({
					...student,
					index: index + 1,
					createdAt: formatDate(student.createdAt),
					statusCheck: StudentStatusEnum[student.statusCheck],
					support: InternSupportType[student.support],
					statusStudent: student.statusStudent.trim()
			  }))
			: [];
	}, [studentsListData, currentSemester]);

	// Callback function will be executed after import file excel
	const importExcelDataCallback = async (excelData) => {
		if (!excelData.length) {
			toast.warn('Vui lòng nhập thông tin đầy đủ !');
			return;
		}

		const newStudentList = excelData.map((obj) => ({
			name: obj[columnAccessors.name],
			mssv: obj[columnAccessors.mssv],
			course: obj[columnAccessors.course],
			email: obj[columnAccessors.email],
			phoneNumber: obj[columnAccessors.phoneNumber],
			majorCode: obj[columnAccessors.majorCode],
			statusStudent: obj[columnAccessors.statusStudent],
			smester_id: semesterData?.defaultSemester?._id,
			campus_id: currentCampus?._id
		}));
		try {
			toastId.current = toast.loading('Đang tải lên dữ liệu ...');
			const payload = await newStudentSchema.validate(newStudentList);

			const { error } = await addStudents({
				data: payload,
				smester_id: semesterData?.defaultSemester?._id,
				campus_id: currentCampus?._id
			});
			console.log(error.status);
			if (error) {
				const message =
					error.status === HttpStatusCode.CONFLICT ? 'Đã có sinh viên tồn tại trong hệ thống !' : 'Lỗi server !';

				toast.update(toastId.current, {
					type: 'error',
					render: message,
					isLoading: false,
					closeButton: true,
					autoClose: 2000
				});
				fileInputRef.current.value = null;
				return;
			}

			fileInputRef.current.value = null;
		} catch (error) {
			toast.update(toastId.current, {
				type: 'error',
				render: error.message,
				isLoading: false,
				closeButton: true,
				autoClose: 2000
			});
			fileInputRef.current.value = null;
		}
	};

	// Get file from device and execute callback to add new students
	const handleImportStudents = (file) => {
		const fileExtension = getFileExtension(file);
		if (fileExtension !== AllowedFileExt.XLSX) {
			toast.error('File import không hợp lệ');
			fileInputRef.current.value = null;
			return;
		}
		handleImportFile(file, importExcelDataCallback);
		fileInputRef.current.value = null; // reset input file after imported
	};

	// Export data from table to excel file
	const handleExportDataToExcel = (data) => {
		if (!data.length) {
			toast.warn('Chưa có dữ liệu để xuất file !');
			return;
		}
		const exportedData = convertToExcelData({ data: data, columnKeysAccessor: columnAccessors });
		if (!exportedData) {
			toast.error('Export dữ liệu thất bại !');
			return;
		}
		handleExportFile({ data: exportedData, fileName: 'Danh sách sinh viên' });
	};

	// Define columns of table
	const columnsData = useMemo(
		() => [
			{
				Header: columnAccessors.index,
				accessor: 'index',
				sortable: true
			},
			{
				Header: columnAccessors.name,
				accessor: 'name',
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true
			},
			{
				Header: columnAccessors.mssv,
				accessor: 'mssv', // object key
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
				Cell: ({ value }) => <span className='font-semibold uppercase'>{value}</span>
			},
			{
				Header: columnAccessors.majorCode,
				accessor: 'majorCode',
				Filter: SelectColumnFilter,
				filterable: true,
				sortable: true
			},
			{
				Header: columnAccessors.phoneNumber,
				accessor: 'phoneNumber',
				Filter: InputColumnFilter,
				filterable: true
			},
			{
				Header: columnAccessors.email,
				accessor: 'email',
				Filter: InputColumnFilter,
				filterable: true
			},
			{
				Header: columnAccessors.support,
				accessor: 'support',
				Filter: SelectColumnFilter,
				filterable: true
			},
			{
				Header: columnAccessors.statusCheck,
				accessor: 'statusCheck',
				Filter: SelectColumnFilter,
				filterable: true,
				Cell: ({ value }) => <Badge variant={handleGetInternStatusStyle(value)}>{value}</Badge>
			},

			{
				Header: columnAccessors.nameCompany,
				accessors: 'nameCompany',
				Filter: InputColumnFilter,
				filterable: true,
				Aggregated: ({ value }) => value,
				Cell: ({ row }) =>
					row.original?.nameCompany && (
						<ul tw='flex flex-col gap-2'>
							<li>
								<strong>{row.original?.nameCompany}</strong>
							</li>
							<li>
								<i>Mã số thuế: </i>
								{row.original?.taxCode}
							</li>
						</ul>
					)
			},
			{
				Header: columnAccessors.position,
				accessor: 'position',
				Filter: InputColumnFilter,
				filterable: true
			},
			{
				Header: columnAccessors.CV,
				accessor: 'CV',
				Filter: InputColumnFilter,
				filterable: false,
				sortable: false,
				Cell: ({ value }) => (
					<Button
						as='a'
						href={value}
						className='p-1'
						target='_blank'
						variant={value ? 'ghost' : 'disabled'}
						shape='square'
						size='sm'
						disabled={!!value}>
						{value ? <EyeIcon className='h-4 w-4' /> : <EyeSlashIcon className='h-4 w-4' />}
					</Button>
				)
			},
			{
				Header: columnAccessors.report,
				accessor: 'report',
				Cell: ({ value }) => !!value && <Badge variant='info'>Đã nộp</Badge>
			},
			{
				Header: columnAccessors.form,
				accessor: 'form',
				Cell: ({ value }) => !!value && <Badge variant='info'>Đã nộp</Badge>
			},
			{
				Header: columnAccessors.reviewer,
				accessor: 'reviewer',
				Filter: InputColumnFilter,
				filterable: true
			},
			{
				Header: columnAccessors.statusStudent,
				accessor: 'statusStudent',
				Filter: SelectColumnFilter,
				filterable: true,
				Cell: ({ value }) => <span className='font-semibold'>{value}</span>
			},

			{
				Header: columnAccessors.createdAt,
				accessor: 'createdAt',
				Filter: InputColumnFilter,
				filterable: true,
				Cell: ({ value }) => <span>{formatDate(value)}</span>
			},
			{
				Header: columnAccessors.note,
				accessor: 'note',
				filterable: false,
				sortable: false
			}
		],
		[]
	);

	return (
		<Container>
			<Box>
				<SelectBox>
					<label
						htmlFor='semester-list'
						aria-label='semester-list'
						className='inline-flex select-none items-center gap-2 whitespace-nowrap text-base-content'>
						<CalendarDaysIcon className='h-6 w-6' /> Kỳ học
					</label>
					<Select
						id='semester-list'
						className='min-w-[12rem] capitalize sm:text-sm'
						onChange={(e) => {
							console.log(e.target.value);
							setCurrentSemester(e.target.value);
						}}>
						{Array.isArray(semesterData?.listSemesters) &&
							semesterData?.listSemesters?.map((semester) => (
								<Option
									key={semester._id}
									value={semester._id}
									selected={semester._id === semesterData?.defaultSemester?._id}>
									{semester?.name}
								</Option>
							))}
					</Select>
				</SelectBox>
				<DesktopButtonGroup
					tableData={tableData}
					handleExport={handleExportDataToExcel}
					handleImport={handleImportStudents}
					canImport={currentSemester === defaultSemster}
					ref={fileInputRef}
				/>
				<MobileDropdownButtonGroup
					tableData={tableData}
					handleExport={handleExportDataToExcel}
					handleImport={handleImportStudents}
					canImport={currentSemester === defaultSemster}
					ref={fileInputRef}
				/>
			</Box>

			<ReactTable columns={columnsData} data={tableData} loading={isLoading} />
		</Container>
	);
};

const Container = tw.div`flex flex-col gap-6 h-full `;
const Box = tw.div`flex items-center justify-between lg:flex-row-reverse`;
const SelectBox = tw.div`flex basis-1/4 items-center gap-2`;

export default StudentListPage;
