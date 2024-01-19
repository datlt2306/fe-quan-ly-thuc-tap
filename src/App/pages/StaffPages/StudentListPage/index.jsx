import { StudentColumnAccessors } from '@/App/constants/studentConstants';
import { useExportToExcel } from '@/App/hooks/useExcel';
import useLocalStorage from '@/App/hooks/useLocalstorage';
import { useAddStudentsMutation, useGetStudentsQuery } from '@/App/store/apis/student.api';
import Box from '@/Core/components/common/Box';
import { Option, Select } from '@/Core/components/common/FormControl/SelectFieldControl';
import DataTable from '@/Core/components/common/Table/DataTable';
import { AllowedFileExtension } from '@/Core/constants/allowedFileType';
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
	const [handleExportFile] = useExportToExcel();
	const [addStudents, addStudentsState] = useAddStudentsMutation();
	const { defaultSemester, listSemesters } = useSelector((state) => state.semester);
	const [currentSemester, setCurrentSemester] = useLocalStorage('current_semester', null);
	const { data: studentsListData, isLoading, refetch } = useGetStudentsQuery({ semester: currentSemester });
	const fileInputRef = useRef(null);
	const toastId = useRef(null);
	const [selectedStudents, setSelectedStudents] = useState([]);

	useEffect(() => {
		if (!currentSemester) setCurrentSemester(defaultSemester?._id);
	}, [currentSemester]);

	const tableData = useMemo(() => studentsListData ?? [], [studentsListData]);

	// Get file from device and execute callback to add new students
	const handleImportStudents = useCallback(
		async (file) => {
			const fileExtension = getFileExtension(file);
			if (fileExtension !== AllowedFileExtension.XLSX) {
				toast.error('File import không hợp lệ');
				if (fileInputRef.current) fileInputRef.current.value = null;
				return;
			}

			const formData = new FormData();
			formData.append('file', file);
			formData.append('smester_id', currentSemester);
			formData.append('campus_id', currentCampus?._id);

			try {
				const { error } = await addStudents(formData);
				if (error) {
					const message = !!error?.data?.message
						? error.data?.message
						: 'Đã có lỗi xảy ra, vui lòng kiểm tra lại dữ liệu tải lên';

					throw new Error(message);
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
				if (fileInputRef.current) fileInputRef.current.value = null;
			}
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

	useEffect(() => {
		if (addStudentsState.isLoading) {
			toastId.current = toast.loading('Đang tải lên dữ liệu ...');
		}
		if (addStudentsState.isSuccess) {
			toast.update(toastId.current, {
				type: 'success',
				render: 'Tải lên dữ liệu thành công !',
				isLoading: false,
				closeButton: true,
				autoClose: 2000
			});
		}
	}, [addStudentsState]);
	// Define columns of table

	return (
		<Container>
			<Box className='flex items-center justify-between lg:flex-row-reverse'>
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

			<DataTable
				columns={InstanceStudentColumns}
				data={tableData}
				loading={isLoading}
				onHandleRefetch={refetch}
				onGetSelectedRows={setSelectedStudents}
				stickyColumn
				resizable
			/>
		</Container>
	);
};

const Container = tw.div`flex flex-col gap-6`;

const SelectBox = tw.div`flex basis-1/4 items-center gap-2`;

export default StudentListPage;
