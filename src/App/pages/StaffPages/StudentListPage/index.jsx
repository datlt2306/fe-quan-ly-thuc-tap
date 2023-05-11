import { useExportToExcel, useImportFromExcel } from "@/App/hooks/useExcel";
import { useGetAllSemestersQuery } from "@/App/providers/apis/semesterApi";
import { useGetStudentQuery, useImportStudentMutation } from "@/App/providers/apis/studentApi";
import { newStudentSchema } from "@/App/schemas/studentSchema";
import Badge from "@/Core/components/common/Badge";
import Button from "@/Core/components/common/Button";
import { Option, Select } from "@/Core/components/common/FormControl/SelectFieldControl";
import ReactTable from "@/Core/components/common/Table/ReactTable";
import { InputColumnFilter, SelectColumnFilter } from "@/Core/components/common/Table/ReactTableFilters";
import { AllowedFileExt } from "@/Core/constants/allowedFileType";
import { StudentStatusEnum, StudentStatusGroup } from "@/Core/constants/studentStatus";
import { convertToExcelData } from "@/Core/utils/excelDataHandler";
import formatDate from "@/Core/utils/formatDate";
import getFileExtension from "@/Core/utils/getFileExtension";
import {
	ArrowDownTrayIcon,
	DocumentArrowDownIcon,
	DocumentArrowUpIcon,
	EyeIcon,
	EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import tw from "twin.macro";
import { columnAccessors } from "./constants";
import { excelSampleData } from "./mocks";

const StudentListPage = () => {
	const { currentCampus } = useSelector((state) => state.campus);
	const [handleImportFile] = useImportFromExcel();
	const { handleExportFile } = useExportToExcel();
	const [addStudents, importStatus] = useImportStudentMutation(); // add students
	const fileInputRef = useRef(null);
	// fetch student data
	const { data: studentsListData, status: fetchDataStatus } = useGetStudentQuery(undefined, {
		refetchOnMountOrArgChange: true,
	});
	// fetch semesters by campus
	const { data: semesterData } = useGetAllSemestersQuery(
		{ campus_id: currentCampus._id },
		{ refetchOnMountOrArgChange: true }
	);
	const { defaultSemester } = useSelector((state) => state.semester);

	const tableData = useMemo(() => {
		return Array.isArray(studentsListData)
			? studentsListData?.map((student, index) => ({ index: index + 1, ...student }))
			: [];
	}, [studentsListData]);

	// Callback function will be executed after import file excel
	const importExcelDataCallback = (excelData) => {
		const newStudentList = excelData.map((obj) => ({
			name: obj[columnAccessors.name],
			mssv: obj[columnAccessors.mssv],
			course: obj[columnAccessors.course],
			email: obj[columnAccessors.email],
			phoneNumber: obj[columnAccessors.phoneNumber],
			majorCode: obj[columnAccessors.majorCode],
			smester_id: defaultSemester._id,
			campus_id: currentCampus._id,
		}));

		// console.log(newStudentList);
		newStudentSchema
			.validate(newStudentList)
			.then((data) => {
				const response = addStudents({
					data,
					smester_id: defaultSemester._id,
					campus_id: currentCampus._id,
					majors: "",
				});

				toast.promise(response, {
					success: "Import sinh viên thành công !",
					error: "Import dữ liệu thất bại",
					pending: "Đang tải lên dữ liệu ...",
				});
				fileInputRef.current.value = null;
			})
			.catch((error) => {
				toast.error("Vui lòng nhập chính xác và đầy đủ dữ liệu !");
			});
	};

	const handleImportStudents = (file) => {
		const fileExtension = getFileExtension(file);
		if (fileExtension !== AllowedFileExt.XLSX) {
			toast.error("File import không hợp lệ");
			fileInputRef.current.value = null;
			return;
		}
		handleImportFile(file, importExcelDataCallback);
		fileInputRef.current.value = null;
	};

	const getIntershipStatusStyle = (value) => {
		let status;
		Object.keys(StudentStatusGroup).forEach((groupKey) => {
			if (StudentStatusGroup[groupKey].includes(value)) {
				status = groupKey;
			}
		});
		return status;
	};

	const exportData = convertToExcelData(
		tableData.map((student) => {
			return {
				...student,
				phoneNumber: student.phoneNumber.toString(),
				statusCheck: StudentStatusEnum[student.statusCheck],
			};
		}),
		columnAccessors
	);
	// Define columns of table
	const columnsData = useMemo(
		() => [
			{
				Header: "STT",
				accessor: "index",
				sortable: true,
			},
			{
				Header: "Họ tên",
				accessor: "name",
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
			},
			{
				Header: "Mã sinh viên",
				accessor: "mssv", // object key
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
				Cell: ({ value }) => <span className="font-medium uppercase">{value}</span>,
			},
			{
				Header: "Khóa nhập học",
				accessor: "course",
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
			},
			{
				Header: "Trạng thái",
				accessor: "statusCheck",
				Filter: ({ column: { filterValue, setFilter, preFilteredRows, id } }) => (
					<SelectColumnFilter
						column={{ filterValue, setFilter, preFilteredRows, id }}
						customOptions={StudentStatusEnum}
					/>
				),
				filterable: true,
				Cell: ({ value }) => <Badge variant={getIntershipStatusStyle(value)}>{StudentStatusEnum[value]}</Badge>,
			},
			{
				Header: "Mã ngành",
				accessor: "majorCode",
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
			},
			{
				Header: "Công ti thực tập",
				accessors: "nameCompany",
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
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
				Header: "Reviewer",
				accessor: "reviewer",
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
			},
			{
				Header: "CV",
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
				Header: "Số điện thoại",
				accessor: "phoneNumber",
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
			},
			{
				Header: "Email",
				accessor: "email",
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
			},

			{
				Header: "Ngày bổ sung",
				accessor: "createdAt",
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
				Cell: ({ value }) => <span>{formatDate(value)}</span>,
			},
			{
				Header: "Ghi chú",
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

					<Button
						type="button"
						variant="success"
						size="sm"
						onClick={() => handleExportFile({ data: exportData, fileName: "Danh sách sinh viên" })}>
						<DocumentArrowDownIcon className="h-6 w-6 text-[inherit]" />
						Export file Excel
					</Button>
					<Button type="button" variant="secondary" size="sm" onClick={() => handleExportFile(excelSampleData)}>
						<ArrowDownTrayIcon className="h-6 w-6 text-[inherit]" />
						Tải file mẫu
					</Button>
				</ButtonList>

				<SelectBox>
					<label htmlFor="semester-list" className="whitespace-nowrap">
						Kỳ học
					</label>
					<Select id="semester-list" className="capitalize" defaultValue={defaultSemester._id}>
						{Array.isArray(semesterData?.listSemesters) &&
							semesterData?.listSemesters?.map((semester) => (
								<Option value={semester._id}>{semester?.name}</Option>
							))}
					</Select>
				</SelectBox>
			</Box>

			<ReactTable
				columns={columnsData}
				data={tableData ?? []}
				manualPagination={false}
				loading={fetchDataStatus.isLoading}
			/>
		</Container>
	);
};

const Container = tw.div`flex flex-col gap-6`;
const Box = tw.div`flex items-center justify-between`;
const SelectBox = tw.div`flex basis-1/4 items-center gap-2`;
const ButtonList = tw.div`flex items-center gap-2`;

export default StudentListPage;
