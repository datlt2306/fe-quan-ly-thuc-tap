import { StudentColumnAccessors } from '@/App/constants/studentConstants';
import { useExportToExcel, useImportFromExcel } from '@/App/hooks/useExcel';
import { useAddStudentsMutation, useGetStudentsQuery } from '@/App/providers/apis/studentApi';
import { newStudentSchema } from '@/App/schemas/studentSchema';
import { Option, Select } from '@/Core/components/common/FormControl/SelectFieldControl';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import { AllowedFileExtension } from '@/Core/constants/allowedFileType';
import HttpStatusCode from '@/Core/constants/httpStatus';
import { convertToExcelData } from '@/Core/utils/excelDataHandler';
import getFileExtension from '@/Core/utils/getFileExtension';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import InstanceStudentColumns from '../Shared/InstanceStudentColumns';
import DesktopButtonGroup from './components/DesktopButtonGroup';
import MobileDropdownButtonGroup from './components/MobileDropdownButtonGroup';

const StudentListPage = () => {
	const { currentCampus } = useSelector((state) => state.campus);
	const [handleImportFile] = useImportFromExcel();
	const [handleExportFile] = useExportToExcel();
	const [addStudents] = useAddStudentsMutation();
	const { defaultSemester, listSemesters } = useSelector((state) => state.semester);
	const [currentSemester, setCurrentSemester] = useState();
	const { data: studentsListData, isLoading } = useGetStudentsQuery({ semester: currentSemester });
	const fileInputRef = useRef(null);
	const toastId = useRef(null);
	const [selectedStudents, setSelectedStudents] = useState([]);

	useEffect(() => {
		setCurrentSemester(defaultSemester?._id);
	}, [defaultSemester]);

	const tableData = useMemo(() => studentsListData ?? [], [studentsListData]);

	// Callback function will be executed after import file excel
	const importExcelDataCallback = async (excelData) => {
		if (!excelData.length) {
			toast.warn('Vui lòng nhập thông tin đầy đủ !');
			return;
		}
		const newStudentList = excelData
			.map((obj) => ({
				name: obj[StudentColumnAccessors.name],
				mssv: obj[StudentColumnAccessors.mssv],
				course: obj[StudentColumnAccessors.course],
				email: obj[StudentColumnAccessors.email],
				phoneNumber: obj[StudentColumnAccessors.phoneNumber],
				majorCode: obj[StudentColumnAccessors.majorCode],
				statusStudent: obj[StudentColumnAccessors.statusStudent],
				smester_id: currentSemester,
				campus_id: currentCampus?._id
			}))
			.filter((student) => Object.keys(student).length === 9);
		try {
			toastId.current = toast.loading('Đang tải lên dữ liệu ...');
			const payload = await newStudentSchema.validate(newStudentList);
			const { error } = await addStudents({
				data: payload,
				smester_id: currentSemester,
				campus_id: currentCampus?._id
			});
			if (error) {
				const message =
					error?.status === HttpStatusCode.CONFLICT
						? 'Đã có sinh viên tồn tại trong hệ thống !'
						: 'Đã có lỗi xảy ra, vui lòng kiểm tra lại dữ liệu tải lên';

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
			toast.update(toastId.current, {
				type: 'success',
				render: 'Tải lên dữ liệu thành công !',
				isLoading: false,
				closeButton: true,
				autoClose: 2000
			});
		} catch (error) {
			toast.update(toastId.current, {
				type: 'error',
				render: error.message,
				isLoading: false,
				closeButton: true,
				autoClose: 2000
			});
		} finally {
			fileInputRef.current.value = null;
		}
	};

	// Get file from device and execute callback to add new students
	const handleImportStudents = useCallback(
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

	// Export data from table to excel file
	const handleExportDataToExcel = useCallback(
		(data) => {
			if (!data.length) {
				toast.warn('Chưa có dữ liệu để xuất file !');
				return;
			}
			const exportedData = convertToExcelData({ data: data, columnKeysAccessor: StudentColumnAccessors });
			if (!exportedData) {
				toast.error('Export dữ liệu thất bại !');
				return;
			}
			handleExportFile({ data: exportedData, fileName: 'Danh sách sinh viên' });
		},
		[currentSemester]
	);

	// Define columns of table
	const columnsData = useMemo(() => InstanceStudentColumns, []);

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
						onChange={(e) => setCurrentSemester(e.target.value)}
						value={currentSemester}>
						<Option value=''>All</Option>
						{Array.isArray(listSemesters) &&
							listSemesters?.map((semester) => (
								<Option key={semester._id} value={semester._id}>
									{semester?.name}
								</Option>
							))}
					</Select>
				</SelectBox>
				<DesktopButtonGroup
					tableData={selectedStudents.length ? selectedStudents : tableData}
					handleExport={handleExportDataToExcel}
					handleImport={handleImportStudents}
					canImport={currentSemester === defaultSemester?._id}
					ref={fileInputRef}
				/>
				<MobileDropdownButtonGroup
					tableData={selectedStudents.length ? selectedStudents : tableData}
					handleExport={handleExportDataToExcel}
					handleImport={handleImportStudents}
					canImport={currentSemester === defaultSemester?._id}
					ref={fileInputRef}
				/>
			</Box>

			<ReactTable
				columns={columnsData}
				data={tableData}
				loading={isLoading}
				onGetSelectedRows={setSelectedStudents}
			/>
		</Container>
	);
};

const Container = tw.div`flex flex-col gap-6 h-full `;
const Box = tw.div`flex items-center justify-between lg:flex-row-reverse`;
const SelectBox = tw.div`flex basis-1/4 items-center gap-2`;

export default StudentListPage;
