import { Fragment, useEffect, useMemo, useState, useRef } from "react";
import Button from "@/Core/components/common/Button";
import PopConfirm from "@/Core/components/common/Popup/PopConfirm";
import ReactTable from "@/Core/components/common/Table/ReactTable";
import { InputColumnFilter, SelectColumnFilter } from "@/Core/components/common/Table/ReactTableFilters";
import { LoadingSpinner } from "@/Core/components/common/Loading/LoadingSpinner";
import { ArrowDownTrayIcon, PlusIcon, DocumentArrowDownIcon, DocumentArrowUpIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import tw from "twin.macro";
import { useAddCompanyMutation, useDeleteCompanyMutation, useGetAllCompanyQuery } from "@/App/providers/apis/businessApi";
import { useGetAllSemestersQuery } from "@/App/providers/apis/semesterApi";
import { useSelector } from "react-redux";
import { useExportToExcel, useImportFromExcel } from "@/App/hooks/useExcel";
import { columnAccessors } from "./constants";
import getFileExtension from "@/Core/utils/getFileExtension";
import { convertToExcelData } from "@/Core/utils/excelDataHandler";
import { excelSampleData } from "./mocks";
import { AllowedFileExt } from "@/Core/constants/allowedFileType";
import { useGetAllMajorQuery } from "@/App/providers/apis/majorApi";

const CompanyListPage = () => {
	// get list company, semester, campus, majors
	const { data: major } = useGetAllMajorQuery(null, { refetchOnMountOrArgChange: true });
	const { data: company, refetch } = useGetAllCompanyQuery({ limit: 1000 }, { refetchOnMountOrArgChange: true });
	const campus = useSelector((state) => state.campus);
	const { data: semester } = useGetAllSemestersQuery({ campus_id: campus?.currentCampus?._id });
	const [slideOverVisibility, setSlideOverVisibility] = useState(false);

	// set table data
	const [tableData, setTableData] = useState([]);
	useEffect(() => {
		setTableData(company?.list);
	}, [company]);

	// hanle delete company
	const [handleDeleteCompany, { isLoading }] = useDeleteCompanyMutation();
	const onDeleteSubmit = async (id) => {
		const result = await handleDeleteCompany({ id });
		if (result?.data?.statusCode) {
			toast.error(result.data.message);
			return;
		}
		refetch();
		toast.success("Đã xóa doanh nghiệp!");
	};

	// handle export, import
	const [handleImportFile] = useImportFromExcel();
	const { handleExportFile } = useExportToExcel();
	const [handleAddCompany] = useAddCompanyMutation();
	const fileInputRef = useRef(null);

	// Callback function will be executed after import file excel
	const importExcelDataCallback = (excelData) => {
		if (!excelData.length) {
			toast.warn("Vui lòng nhập thông tin đầy đủ!");
		}
		if (excelData.length) {
			const newCompanyList = excelData.map((obj) => ({
				name: obj[columnAccessors.name],
				code_request: obj[columnAccessors.code_request],
				internshipPosition: obj[columnAccessors.internshipPosition],
				majors: obj[columnAccessors.majors],
				amount: obj[columnAccessors.amount],
				address: obj[columnAccessors.address],
				request: obj[columnAccessors.request],
				description: obj[columnAccessors.description],
				benefish: obj[columnAccessors.benefish],
			}));
			console.log(newCompanyList);
			newCompanyList.forEach(async (item) => {
				const result = await handleAddCompany({ ...item, majors: major?.find((majorItem) => majorItem.majorCode === item.majors)?._id });
				if (result?.data?.statusCode) {
					toast.error(result.data.message);
					return;
				}
				refetch();
				toast.success("Thêm doanh nghiệp mới thành công!");
			});
			fileInputRef.current.value = null;
		}
	};

	// // Get file from device and execute callback to add new companies
	const handleImportCompanies = (file) => {
		const fileExtension = getFileExtension(file);
		if (fileExtension !== AllowedFileExt.XLSX) {
			toast.error("File import không hợp lệ");
			fileInputRef.current.value = null;
			return;
		}
		handleImportFile(file, importExcelDataCallback);
		fileInputRef.current.value = null; // reset input file after imported
	};
	const handleExportDataToExcel = () => {
		if (!tableData.length) {
			toast.warn("Chưa có dữ liệu để xuất file !");
			return;
		}
		const exportedData = convertToExcelData(
			tableData.map((company, index) => {
				return {
					...company,
					majors: company.majors.name,
					campus_id: company.campus_id.name,
					smester_id: semester.listSemesters.find((item) => item._id === company.smester_id).name,
					index: index + 1,
				};
			}),
			columnAccessors
		);

		if (!exportedData) {
			toast.error("Export dữ liệu thất bại !");
			return;
		}

		handleExportFile({ data: exportedData, fileName: "Danh sách doanh nghiệp" });
	};

	// Define columns of table
	const columnsData = [
		{
			Header: "STT",
			accessor: "STT",
			Cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
		},
		{
			Header: "Mã Doanh Nghiệp",
			accessor: "code_request",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
			Cell: ({ value }) => <span className="font-medium uppercase">{value}</span>,
		},
		{
			Header: "Tên Doanh Nghiệp",
			accessor: "name",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
			canSort: true,
			canFilter: true,
			Cell: ({ value }) => <span className="capitalize">{value}</span>,
		},
		{
			Header: "Vị trí thực tập",
			accessor: "internshipPosition",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
		},
		{
			Header: "Số lượng",
			accessor: "amount",
			Filter: SelectColumnFilter,
			sortable: true,
		},
		{
			Header: "Ngành",
			accessor: "majors.name",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
		},

		{
			Header: "Yêu Cầu",
			accessor: "request",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
		},
		{
			Header: "Chi tiết",
			accessor: "description",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
		},
		{
			Header: "Quyền lợi",
			accessor: "benefish",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
		},
		{
			Header: "Địa chỉ",
			accessor: "address",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
		},
		{
			Header: "Thao tác",
			accessor: "_id",
			canFilter: false,
			canSort: false,
			filterable: false,
			isSort: false,
			Cell: ({ value }) => (
				<ButtonList>
					<Button type="button" size="xs" variant="secondary">
						<Link to={`/cap-nhat-cong-ty/${value}`}>Chỉnh sửa</Link>
					</Button>
					<PopConfirm
						okText="Ok"
						cancelText="Cancel"
						title={"Xóa công ty"}
						description={"Bạn muốn xóa công ty này ?"}
						// onCancel={() => toast.info("Cancelled")}
						onConfirm={() => onDeleteSubmit(value)}>
						<Button size="xs" variant="error">
							{isLoading ? <LoadingSpinner /> : "Xóa"}
						</Button>
					</PopConfirm>
				</ButtonList>
			),
		},
	];

	return (
		<Fragment>
			<Box>
				<ButtonList>
					<Container>
						<Button type="button" variant="primary" size="sm" onClick={() => setSlideOverVisibility(!slideOverVisibility)}>
							<PlusIcon className="h-3 w-3 text-[inherit]" /> <Link to={"/them-moi-cong-ty"}>Thêm mới doanh nghiệp</Link>
						</Button>

						<Button type="button" variant="success" size="sm" onClick={handleExportDataToExcel}>
							<DocumentArrowDownIcon className="h-6 w-6 text-[inherit]" />
							Export file Excel
						</Button>

						<Button as="label" size="sm" htmlFor="file-input" variant="secondary">
							<DocumentArrowUpIcon className="h-6 w-6 text-[inherit]" /> Import file Excel
							<input
								ref={fileInputRef}
								type="file"
								id="file-input"
								className="hidden"
								onChange={(e) => handleImportCompanies(e.target.files[0])}
							/>
						</Button>

						<Button type="button" variant="secondary" size="sm" onClick={() => handleExportFile(excelSampleData)}>
							<ArrowDownTrayIcon className="h-6 w-6 text-[inherit]" />
							Tải file mẫu
						</Button>
					</Container>
					<Container>
						<label htmlFor="semester-list" className="inline-flex items-center gap-2 whitespace-nowrap text-base-content">
							<CalendarDaysIcon className="h-6 w-6" /> Kỳ học
						</label>
						<Select
							onChange={(e) =>
								e.target.value === "all"
									? setTableData(company?.list)
									: setTableData(company?.list.filter((item) => item.smester_id === e.target.value))
							}>
							<Option value="all">All</Option>
							{Array.isArray(semester?.listSemesters) &&
								semester?.listSemesters.map((item, index) => (
									<Option value={item._id} key={index}>
										{item.name}
									</Option>
								))}
						</Select>
					</Container>
				</ButtonList>

				{tableData ? (
					<ReactTable
						columns={columnsData}
						data={tableData}
						noDataComponent={
							<tr>
								<td>Empty</td>
							</tr>
						}
					/>
				) : (
					<LoadingSpinner />
				)}
			</Box>
		</Fragment>
	);
};

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex justify-between`;
const Container = tw.div`flex items-center gap-2`;
const Select = tw.select`block w-full rounded-[4px] border-none duration-300  px-2 py-1.5 outline-none ring-1 ring-gray-300 focus:ring-primary focus:active:ring-primary min-w-[128px] m-0`;
const Option = tw.option`leading-6`;

export default CompanyListPage;
