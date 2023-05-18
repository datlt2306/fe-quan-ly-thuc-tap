import { useEffect, useState, useRef } from "react";
import Button from "@/Core/components/common/Button";
import PopConfirm from "@/Core/components/common/Popup/PopConfirm";
import ReactTable from "@/Core/components/common/Table/ReactTable";
import {
	InputColumnFilter,
	SelectColumnFilter,
} from "@/Core/components/common/Table/ReactTableFilters";
import { Option, Select } from "@/Core/components/common/FormControl/SelectFieldControl";
import { CalendarDaysIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import tw from "twin.macro";
import { useAddArrayCompanyMutation, useDeleteCompanyMutation, useGetAllCompanyQuery } from "@/App/providers/apis/businessApi";
import { useGetAllSemestersQuery } from "@/App/providers/apis/semesterApi";
import { useSelector } from "react-redux";
import { useExportToExcel, useImportFromExcel } from "@/App/hooks/useExcel";
import { columnAccessors } from "./constants";
import getFileExtension from "@/Core/utils/getFileExtension";
import { convertToExcelData } from "@/Core/utils/excelDataHandler";
import { AllowedFileExt } from "@/Core/constants/allowedFileType";
import { useGetAllMajorQuery } from '@/App/providers/apis/majorApi';
import { companyArraySchema } from "@/App/schemas/companySchema";
import { StaffPaths } from "@/Core/constants/routePaths";
import DesktopButtonGroup from "./components/DesktopButtonGroup";
import MobileDropdownButtonGroup from "./components/MobileDropdownButtonGroup";
import Modal from "@/Core/components/common/Modal";

const CompanyListPage = () => {

	// state modal
	const [modal, setModal] = useState(false)
	const [dataModal, setDataModal] = useState({});

	const toastId = useRef(null)

	// get list company, semester, campus, major
	const { data: majors } = useGetAllMajorQuery(null, { refetchOnMountOrArgChange: true });
	const campus = useSelector((state) => state.campus)
	const { data: semester } = useGetAllSemestersQuery({ campus_id: campus?.currentCampus?._id });
	const { defaultSemester } = useSelector((state) => state.semester);
	const [selectedSemesterId, setSelectedSemesterId] = useState(defaultSemester?._id);
	const { data: company, isLoading: companyLoading } = useGetAllCompanyQuery({ limit: 1000, semester_id: selectedSemesterId }, { refetchOnMountOrArgChange: true });

	useEffect(() => { setSelectedSemesterId(defaultSemester?._id) }, [defaultSemester])

	const handleChangeSemester = (id) => {
		setSelectedSemesterId(id);
	}
	useEffect(() => {
		setSelectedSemesterId(defaultSemester?._id);
	 }, [defaultSemester]);

	// set table data
	const [tableData, setTableData] = useState([]);
	useEffect(() => {
		setTableData(company?.list);
	}, [company]);

	// hanle delete company
	const [handleDeleteCompany] = useDeleteCompanyMutation()
	const onDeleteSubmit = async (id) => {
		toastId.current = toast.loading("Đang xóa công ty")
		const result = await handleDeleteCompany({ id })
		if (result?.error) {
			toast.update(toastId.current, {
				type: "error",
				render: error.message || "Đã có lỗi xảy ra !",
				isLoading: false,
				closeButton: true,
				autoClose: 2000,
			})
			return;
		}
		toast.update(toastId.current, {
			type: "success",
			render: "Đã xóa thành công doanh nghiệp!",
			isLoading: false,
			closeButton: true,
			autoClose: 2000,
		})
	}

	// handle export, import
	const [handleImportFile] = useImportFromExcel();
	const { handleExportFile } = useExportToExcel();
	const [handleAddArrayCompany] = useAddArrayCompanyMutation();
	const fileInputRef = useRef(null);

	// Callback function will be executed after import file excel
	const importExcelDataCallback = (excelData) => {
		if (!excelData.length) {
			toast.warn("Vui lòng nhập thông tin đầy đủ!");
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
				benefit: obj[columnAccessors.benefit],
			}));
			const newData = newCompanyList?.map(item => ({ ...item, major: majors?.find(majorItem => majorItem.majorCode === item.major)?._id }))
			companyArraySchema
				.validate(newData)
				.then(async (data) => {
					const response = await handleAddArrayCompany(data);
					if (response?.error) {
						toast.error("Import công ty thất bại")
					} else {
						toast.success("Import công ty thành công")
					}
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

	const handleExportDataToExcel = () => {
		if (!tableData.length) {
			toast.warn("Chưa có dữ liệu để xuất file !");
			return;
		}
		const newData = tableData.map((company, index) => {
			return {
				...company,
				major: company.major.name,
				campus_id: campus?.campusList?.listCampus?.find(item => item._id === company.campus_id).name,
				semester_id: semester.listSemesters.find(item => item._id === company.semester_id).name,
				index: index + 1
			};
		})
		const exportedData = convertToExcelData(
			{
				data: newData,
				columnKeysAccessor: columnAccessors
			}
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
			Header: columnAccessors.index,
			accessor: "STT",
			Cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
		},
		{
			Header: columnAccessors.business_code,
			accessor: "business_code",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
			Cell: ({ value }) => <span className="font-medium uppercase">{value}</span>,
		},
		{
			Header: columnAccessors.tax_code,
			accessor: "tax_code",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
			Cell: ({ value }) => <span className="font-medium uppercase">{value}</span>,
		},
		{
			Header: columnAccessors.name,
			accessor: "name",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
			canSort: true,
			canFilter: true,
			Cell: ({ value }) => <div className="max-w-xs w-full overflow-hidden">
				<p className="whitespace-normal overflow-ellipsis">
					{value}
				</p>
			</div>,
		},
		{
			Header: columnAccessors.internship_position,
			accessor: "internship_position",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
			Cell: ({ value }) => <div className="max-w-xs w-full overflow-hidden">
				<p className="whitespace-normal overflow-ellipsis">
					{value}
				</p>
			</div>,
		},
		{
			Header: columnAccessors.amount,
			accessor: "amount",
			Filter: SelectColumnFilter,
			sortable: true,
		},
		{
			Header: columnAccessors.major,
			accessor: "major.name",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
		},
		{
			Header: columnAccessors.address,
			accessor: "address",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
			Cell: ({ value }) => <div className="max-w- w-full overflow-hidden">
				<p className="whitespace-normal overflow-ellipsis">
					{value}
				</p>
			</div>,
		},
		{
			Header: columnAccessors.requirement,
			accessor: "requirement",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
			Cell: ({ value }) => <Button variant="ghost" size="sm" className="font-normal" onClick={() => {
				setDataModal({ data: value, title: columnAccessors.requirement })
				setModal(!modal)
			}}>Chi tiết</Button>
			,
		},
		{
			Header: columnAccessors.description,
			accessor: "description",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
			Cell: ({ value }) => <Button variant="ghost" size="sm" className="font-normal" onClick={() => {
				setDataModal({ data: value, title: columnAccessors.description })
				setModal(!modal)
			}}>Chi tiết</Button>
			,

		},
		{
			Header: columnAccessors.benefit,
			accessor: "benefit",
			Filter: InputColumnFilter,
			filterable: true,
			sortable: true,
			Cell: ({ value }) => <Button variant="ghost" size="sm" className="font-normal" onClick={() => {
				setDataModal({ data: value, title: columnAccessors.benefit })
				setModal(!modal)
			}}>Chi tiết</Button>
			,
		},
		{
			Header: "Thao tác",
			accessor: '_id',
			canFilter: false,
			canSort: false,
			filterable: false,
			isSort: false,
			Cell: ({ value }) => (
				<ActionList>
					<Button as={Link} to={StaffPaths.COMPANY_UPDATE.replace(":id", value)} type="button" size="sm" shape="square" variant="default">
						<PencilSquareIcon className="h-5 w-5" />
					</Button>
					<PopConfirm
						okText="Ok"
						cancelText="Cancel"
						title={"Xóa công ty"}
						description={"Bạn muốn xóa công ty này ?"}
						// onCancel={() => toast.info("Cancelled")}
						onConfirm={() => onDeleteSubmit(value)}>
						<Button size="sm" variant="error" shape="square">
							<TrashIcon className="w-5 h-5" />
						</Button>
					</PopConfirm>
				</ActionList>
			),
		},
	]

	return (
		<Container>
			<Box>
				<SelectBox>
					<label htmlFor="semester-list" className="inline-flex items-center gap-2 whitespace-nowrap text-base-content">
						<CalendarDaysIcon className="h-6 w-6" /> Kỳ học
					</label>
					<Select className="min-w-[12rem] capitalize sm:text-sm" onChange={(e) => handleChangeSemester(e.target.value)}>
						{Array.isArray(semester?.listSemesters) && semester?.listSemesters.map((item, index) => (
							<Option value={item._id} key={index} selected={selectedSemesterId === item._id}>{item.name}</Option>
						))}
					</Select>
				</SelectBox>
				<DesktopButtonGroup
					tableData={tableData}
					handleExport={handleExportDataToExcel}
					handleImport={handleImportCompanies}
					canImport={selectedSemesterId === semester?.defaultSemester?._id}
					ref={fileInputRef}
				/>
				<MobileDropdownButtonGroup
					tableData={tableData}
					handleExport={handleExportDataToExcel}
					handleImport={handleImportCompanies}
					canImport={selectedSemesterId === semester?.defaultSemester?._id}
					ref={fileInputRef}
				/>
			</Box>
			{tableData && <ReactTable columns={columnsData} data={tableData} loading={companyLoading} />}
			<Modal openState={modal} onOpenStateChange={setModal} title={dataModal?.title}>
				<p className="text-gray-500">{dataModal?.data}</p>
			</Modal>
		</Container>
	);
};

const ActionList = tw.div`flex justify-between`;
const Container = tw.div`flex flex-col gap-6 h-full `;
const Box = tw.div`flex items-center justify-between lg:flex-row-reverse`;
const SelectBox = tw.div`flex basis-1/4 items-center gap-2`;

export default CompanyListPage;