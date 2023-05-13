import { Fragment, useEffect, useMemo, useState,useRef } from "react";
import Button from "@/Core/components/common/Button";
import PopConfirm from "@/Core/components/common/Popup/PopConfirm";
import ReactTable from "@/Core/components/common/Table/ReactTable";
import {
	InputColumnFilter,
	SelectColumnFilter,
} from "@/Core/components/common/Table/ReactTableFilters";
import {LoadingSpinner} from '@/Core/components/common/Loading/LoadingSpinner';
import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import tw from "twin.macro";
import { useAddCompanyMutation, useDeleteCompanyMutation, useGetAllCompanyQuery } from "@/App/providers/apis/businessApi";
import { useGetAllSemestersQuery } from "@/App/providers/apis/semesterApi";
import { useSelector } from "react-redux";
import { useExportToExcel, useImportFromExcel } from "@/App/hooks/useExcel";
import { columnAccessors } from "./constants";
import { companyImportExcelSchema } from "@/App/schemas/companySchema";
import getFileExtension from "@/Core/utils/getFileExtension";
import { convertToExcelData } from "@/Core/utils/excelDataHandler";

const CompanyListPage = () => {

	// get list company, semester, campus
	const { data: company, refetch } = useGetAllCompanyQuery({ limit: 1000 }, { refetchOnMountOrArgChange: true });
	const campus = useSelector((state) => state.campus)
	const { data: semester } = useGetAllSemestersQuery({ campus_id: campus?.currentCampus?._id });
	console.log(semester)
	const [slideOverVisibility, setSlideOverVisibility] = useState(false);

	// set table data
	const [tableData, setTableData] = useState([]);
	useEffect(() => {
		setTableData(company?.list);
	}, [company]);

	// hanle delete company
	const [handleDeleteCompany, { isLoading }] = useDeleteCompanyMutation()
	const onDeleteSubmit = async (id) => {
		const result = await handleDeleteCompany({ id })
		if (result?.data?.statusCode) {
			toast.error(result.data.message)
			return;
		}
		refetch()
		toast.success("Đã xóa doanh nghiệp!")
	}


	// handle export, import
	const [handleImportFile] = useImportFromExcel();
	const {handleExportFile} = useExportToExcel();
	const [handleAddCompany] = useAddCompanyMutation();
	const fileInputRef = useRef(null);

	// Callback function will be executed after import file excel
	const importExcelDataCallback = (excelData) => {
		if (!excelData.length) {
			toast.warn("Vui lòng nhập thông tin đầy đủ !");
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

			companyImportExcelSchema
				.validate(newCompanyList)
				.then((data) => {
					console.log(data)
					const response = handleAddCompany(data);
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
	
	console.log(tableData)

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
					smester_id: semester.listSemesters.find(item => item._id === company.smester_id).name,
					index: index + 1
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
	const columnsData = useMemo(
		() => [
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
				isSort: true,
				Cell: ({ value }) => <span className="font-medium uppercase">{value}</span>,
			},
			{
				Header: "Tên Doanh Nghiệp",
				accessor: "name",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
				canSort: true,
				canFilter: true,
				Cell: ({ value }) => <span className="capitalize">{value}</span>,
			},
			{
				Header: "Vị trí thực tập",
				accessor: "internshipPosition",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Số lượng",
				accessor: "amount",
				Filter: SelectColumnFilter,
				isSort: true,
			},
			{
				Header: "Ngành",
				accessor: "majors.name",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},

			{
				Header: "Yêu Cầu",
				accessor: "request",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Chi tiết",
				accessor: "description",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Quyền lợi",
				accessor: "benefish",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Địa chỉ",
				accessor: "address",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Thao tác",
				accessor: '_id',
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
		],
		[]
	);

	return (
		<Fragment>
			<Box>
				<ButtonList>
					<Container>
						<Button
							type="button"
							variant="primary"
							size="sm"
							onClick={() => setSlideOverVisibility(!slideOverVisibility)}>
							<PlusIcon className="h-3 w-3 text-[inherit]" /> <Link to={'/them-moi-cong-ty'}>Thêm mới doanh nghiệp</Link>
						</Button>

						<Button as="label" size="sm" htmlFor="file-input">
							<ArrowUpIcon className="h-3 w-3 text-[inherit]" /> Import file Excel
							<input
								type="file"
								id="file-input"
								className="hidden"
								onChange={(e) => handleImportCompanies(e.target.files[0])}
							/>
						</Button>

						<Button type="button" variant="outline" size="sm" onClick={handleExportDataToExcel}>
							<ArrowDownIcon className="h-3 w-3 text-[inherit]" />
							Export file Excel
						</Button>
					</Container>
					<Container>
						<Select onChange={(e) => e.target.value === "all" ? setTableData(company?.list) : setTableData(company?.list.filter(item => item.smester_id === e.target.value))}>
							<Option value="all">All</Option>
							{Array.isArray(semester?.listSemesters) && semester?.listSemesters.map((item, index) => (
								<Option value={item._id} key={index}>{item.name}</Option>
							))}
						</Select>
					</Container>

				</ButtonList>

				{tableData ? (
					<ReactTable
						columns={columnsData}
						data={tableData}
						noDataComponent={<tr><td>Empty</td></tr>}
					/>
				) : (
					<LoadingSpinner />
				)}
			</Box>
		</Fragment>
	);
};

export default CompanyListPage;

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex justify-between`;
const Container = tw.div`flex items-center gap-2`;
const Select = tw.select`block w-full rounded-[4px] border-none duration-300  px-2 py-1.5 outline-none ring-1 ring-gray-300 focus:ring-primary focus:active:ring-primary min-w-[128px] m-0`;
const Option = tw.option`leading-6`;