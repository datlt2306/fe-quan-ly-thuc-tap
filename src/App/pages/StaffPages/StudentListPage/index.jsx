import { useExportToExcel, useImportFromExcel } from "@/App/hooks/useExcel";
import { useGetAllSemestersQuery } from "@/App/providers/apis/semesterApi";
import { useAddStudentsMutation, useGetStudentsQuery } from "@/App/providers/apis/studentApi";
import { newStudentSchema } from "@/App/schemas/studentSchema";
import Badge from "@/Core/components/common/Badge";
import Button from "@/Core/components/common/Button";
import { Option, Select } from "@/Core/components/common/FormControl/SelectFieldControl";
import ReactTable from "@/Core/components/common/Table/ReactTable";
import { InputColumnFilter, SelectColumnFilter } from "@/Core/components/common/Table/ReactTableFilters";
import { AllowedFileExt } from "@/Core/constants/allowedFileType";
import { StudentSchoolingStatus, StudentStatusEnum, StudentStatusGroupEnum } from "@/Core/constants/studentStatus";
import { convertToExcelData } from "@/Core/utils/excelDataHandler";
import formatDate from "@/Core/utils/formatDate";
import getFileExtension from "@/Core/utils/getFileExtension";
import { ArrowDownTrayIcon, CalendarDaysIcon, DocumentArrowDownIcon, DocumentArrowUpIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import tw from "twin.macro";
import { columnAccessors } from "./constants";
import { excelSampleData } from "./mocks";

const handleGetInternStatusStyle = (value) => {
	let status;
	Object.keys(StudentStatusGroupEnum).forEach((groupKey) => {
		if (StudentStatusGroupEnum[groupKey].includes(value)) {
			status = groupKey;
		}
	});
	return status;
};

const StudentListPage = () => {
	const { currentCampus } = useSelector((state) => state.campus);
	const [handleImportFile] = useImportFromExcel();
	const { handleExportFile } = useExportToExcel();
	const [addStudents] = useAddStudentsMutation(); // add students
	const fileInputRef = useRef(null);
	const { defaultSemester } = useSelector((state) => state.semester);
	const [currentSemester, setCurrentSemester] = useState(defaultSemester._id);
	const { data: studentsListData, status: fetchDataStatus } = useGetStudentsQuery({ semester: currentSemester });
	const { data: semesterData } = useGetAllSemestersQuery({ campus_id: currentCampus._id }, { refetchOnMountOrArgChange: true });
	const tableData = useMemo(() => {
		return Array.isArray(studentsListData) ? studentsListData?.map((student, index) => ({ index: index + 1, ...student })) : [];
	}, [studentsListData]);

	// Callback function will be executed after import file excel
	const importExcelDataCallback = (excelData) => {
		if (!excelData.length) {
			toast.warn("Vui lòng nhập thông tin đầy đủ !");
		}
		if (excelData.length) {
			const newStudentList = excelData.map((obj) => ({
				name: obj[columnAccessors.name],
				mssv: obj[columnAccessors.mssv],
				course: obj[columnAccessors.course],
				email: obj[columnAccessors.email],
				phoneNumber: obj[columnAccessors.phoneNumber],
				majorCode: obj[columnAccessors.majorCode],
				statusStudent: obj[columnAccessors.statusStudent],
				smester_id: defaultSemester._id,
				campus_id: currentCampus._id,
			}));

			console.log(newStudentList);
			newStudentSchema
				.validate(newStudentList)
				.then((data) => {
					const response = addStudents({
						data,
						smester_id: defaultSemester._id,
						campus_id: currentCampus._id,
					});

					toast.promise(response, {
						success: "Import sinh viên thành công !",
						error: "Import dữ liệu thất bại",
						pending: "Đang tải lên dữ liệu ...",
					});
					fileInputRef.current.value = null;
				})
				.catch((error) => {
					toast.error(error?.message);
				});
		}
	};

	// Get file from device and execute callback to add new students
	const handleImportStudents = (file) => {
		const fileExtension = getFileExtension(file);
		if (fileExtension !== AllowedFileExt.XLSX) {
			toast.error("File import không hợp lệ");
			fileInputRef.current.value = null;
			return;
		}
		handleImportFile(file, importExcelDataCallback);
		fileInputRef.current.value = null; // reset input file after imported
	};
	console.log(tableData);
	const handleExportDataToExcel = () => {
		if (!tableData.length) {
			toast.warn("Chưa có dữ liệu để xuất file !");
			return;
		}
		const exportedData = convertToExcelData(
			tableData.map((student) => {
				console.log(StudentStatusEnum[student?.statusCheck]);
				return {
					...student,
					statusCheck: StudentStatusEnum[student?.statusCheck],
				};
			}),
			columnAccessors
		);

		if (!exportedData) {
			toast.error("Export dữ liệu thất bại !");
			return;
		}

		handleExportFile({ data: exportedData, fileName: "Danh sách sinh viên" });
	};

	// Define columns of table
	const columnsData = useMemo(
		() => [
			{
				Header: columnAccessors.index,
				accessor: "index",
				sortable: true,
			},
			{
				Header: columnAccessors.name,
				accessor: "name",
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
			},
			{
				Header: columnAccessors.mssv,
				accessor: "mssv", // object key
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
				Cell: ({ value }) => <span className="font-semibold uppercase">{value}</span>,
			},
			{
				Header: columnAccessors.majorCode,
				accessor: "majorCode",
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
			},
			{
				Header: columnAccessors.phoneNumber,
				accessor: "phoneNumber",
				Filter: InputColumnFilter,
				filterable: true,
			},
			{
				Header: columnAccessors.email,
				accessor: "email",
				Filter: InputColumnFilter,
				filterable: true,
			},
			{
				Header: columnAccessors.course,
				accessor: "course",
				Filter: SelectColumnFilter,
				filterable: true,
				sortable: true,
			},
			{
				Header: columnAccessors.statusCheck,
				accessor: "statusCheck",
				Filter: ({ column: { filterValue, setFilter, preFilteredRows, id } }) => (
					<SelectColumnFilter column={{ filterValue, setFilter, preFilteredRows, id }} customOptions={StudentStatusEnum} />
				),
				filterable: true,
				Cell: ({ value }) => <Badge variant={handleGetInternStatusStyle(value)}>{StudentStatusEnum[value]}</Badge>,
			},
			{
				Header: columnAccessors.support,
				accessor: "support",
				Filter: SelectColumnFilter,
				filterable: true,
			},
			{
				Header: columnAccessors.statusStudent,
				accessor: "statusStudent",
				Filter: SelectColumnFilter,
				filterable: true,
				Cell: ({ value }) => <Badge variant={value === StudentSchoolingStatus.STUDYING_STATE ? "success" : "error"}>{value}</Badge>,
			},
			{
				Header: columnAccessors.position,
				accessor: "position",
				Filter: InputColumnFilter,
				filterable: true,
			},
			{
				Header: columnAccessors.nameCompany,
				accessors: "nameCompany",
				Filter: InputColumnFilter,
				filterable: true,
				Aggregated: ({ value }) => value,
				Cell: ({ row }) =>
					row.original?.nameCompany && (
						<ul tw="flex flex-col gap-2">
							<li>
								<strong>{row.original?.nameCompany}</strong>
							</li>
							<li>
								<i>Mã số thuế: </i>
								{row.original?.taxCode}
							</li>
						</ul>
					),
			},
			{
				Header: columnAccessors.CV,
				accessor: "CV",
				Filter: InputColumnFilter,
				filterable: false,
				sortable: false,
				Cell: ({ value }) =>
					!!value ? (
						<Button as="a" href={value} target="_blank" variant="ghost" shape="square" size="sm">
							<EyeIcon className="h-4 w-4" />
						</Button>
					) : (
						<Button variant="disabled" shape="square" size="sm" disabled={true}>
							<EyeSlashIcon className="h-4 w-4" />
						</Button>
					),
			},
			{
				Header: columnAccessors.reviewer,
				accessor: "reviewer",
			},
			{
				Header: columnAccessors.addedAt,
				accessor: "addedAt",
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
				Cell: ({ value }) => <span>{formatDate(value)}</span>,
			},
			{
				Header: columnAccessors.note,
				accessor: "note",
				filterable: false,
				sortable: false,
			},
		],
		[]
	);

	return (
		<Container>
			<Box>
				<ButtonList>
					<Button as="label" size="sm" htmlFor="file-input" variant="primary">
						<DocumentArrowUpIcon className="h-6 w-6 text-[inherit]" /> Tải lên file Excel
						<input
							ref={fileInputRef}
							type="file"
							id="file-input"
							className="hidden"
							onChange={(e) => handleImportStudents(e.target.files[0])}
						/>
					</Button>
					<Button type="button" variant="success" size="sm" onClick={handleExportDataToExcel}>
						<DocumentArrowDownIcon className="h-6 w-6 text-[inherit]" />
						Export file Excel
					</Button>
					<Button type="button" variant="secondary" size="sm" onClick={() => handleExportFile(excelSampleData)}>
						<ArrowDownTrayIcon className="h-6 w-6 text-[inherit]" />
						Tải file mẫu
					</Button>
				</ButtonList>
				<SelectBox>
					<label htmlFor="semester-list" className="inline-flex items-center gap-2 whitespace-nowrap text-base-content">
						<CalendarDaysIcon className="h-6 w-6" /> Kỳ học
					</label>
					<Select
						id="semester-list"
						className="capitalize"
						defaultValue={currentSemester}
						onChange={(e) => {
							console.log(e.target.value);
							setCurrentSemester(e.target.value);
						}}>
						{Array.isArray(semesterData?.listSemesters) &&
							semesterData?.listSemesters?.map((semester) => (
								<Option key={semester._id} value={semester._id}>
									{semester?.name}
								</Option>
							))}
					</Select>
				</SelectBox>
			</Box>

			<ReactTable columns={columnsData} data={tableData} loading={fetchDataStatus.isLoading} />
		</Container>
	);
};

const Container = tw.div`flex flex-col gap-6 h-full `;
const Box = tw.div`flex items-center justify-between`;
const SelectBox = tw.div`flex basis-1/4 items-center gap-2`;
const ButtonList = tw.div`flex items-center gap-2`;

export default StudentListPage;
