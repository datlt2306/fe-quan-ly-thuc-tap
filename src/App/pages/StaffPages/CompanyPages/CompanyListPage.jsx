import { Fragment, useEffect, useState, useRef } from "react";
import Button from "@/Core/components/common/Button";
import PopConfirm from "@/Core/components/common/Popup/PopConfirm";
import ReactTable from "@/Core/components/common/Table/ReactTable";
import {
	InputColumnFilter,
	SelectColumnFilter,
} from "@/Core/components/common/Table/ReactTableFilters";
import { ArrowDownTrayIcon, DocumentArrowDownIcon, DocumentArrowUpIcon, CalendarDaysIcon, PencilSquareIcon, TrashIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
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
import { excelSampleData } from "./mocks";
import { AllowedFileExt } from "@/Core/constants/allowedFileType";
import { useGetAllMajorQuery } from '@/App/providers/apis/majorApi';
import { companyArraySchema } from "@/App/schemas/companySchema";
import Modal from "@/Core/components/common/Modal";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { StaffPaths } from "@/Core/constants/routePaths";

const CompanyListPage = () => {

	// css mobile
	const menuItemClasses = () =>
		classNames({
			"flex items-center gap-2 p-2 hover:bg-gray-100 duration-300 whitespace-nowrap select-none cursor-pointer text-base-content text-sm": true,
		});

	// state modal
	const [modal, setModal] = useState(false)
	const [dataModal, setDataModal] = useState({});

	const toastId = useRef(null)

	// get list company, semester, campus, major
	const { data: majors } = useGetAllMajorQuery(null, { refetchOnMountOrArgChange: true });
	const campus = useSelector((state) => state.campus)
	const { data: semester } = useGetAllSemestersQuery({ campus_id: campus?.currentCampus?._id });
	const [selectedSemesterId, setSelectedSemesterId] = useState(semester?.defaultSemester?._id);
	const { data: company, isLoading: companyLoading } = useGetAllCompanyQuery({ limit: 1000, semester_id: selectedSemesterId }, { refetchOnMountOrArgChange: true });
	const handleChangeSemester = (id) => {
		setSelectedSemesterId(id);
	}

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
	const fileInputRefMobile = useRef(null);

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

	const handleImportCompaniesMobile = (file) => {
		const fileExtension = getFileExtension(file);
		if (fileExtension !== AllowedFileExt.XLSX) {
			toast.error("File import không hợp lệ");
			fileInputRefMobile.current.value = null;
			return;
		}
		handleImportFile(file, importExcelDataCallback);
		fileInputRefMobile.current.value = null; // reset input file after imported
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
		<Fragment>
			<Box>
				<ButtonList>
					<Container>
						<Button as="label" size="sm" htmlFor="file-input" variant={selectedSemesterId === semester?.defaultSemester?._id ? "primary" : "disabled"}>
							<DocumentArrowUpIcon className="h-6 w-6 text-[inherit]" /> Tải lên file Excel
							{
								selectedSemesterId === semester?.defaultSemester?._id && (
									<input
										ref={fileInputRef}
										type="file"
										id="file-input"
										className="hidden"
										onChange={(e) => handleImportCompanies(e.target.files[0])}
									/>
								)
							}
						</Button>

						<Button type="button" variant="success" size="sm" onClick={handleExportDataToExcel}>
							<DocumentArrowDownIcon className="h-6 w-6 text-[inherit]" />
							Export file Excel
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
						<Select onChange={(e) => handleChangeSemester(e.target.value)} defaultValue={semester?.defaultSemester?._id}>
							{Array.isArray(semester?.listSemesters) && semester?.listSemesters.map((item, index) => (
								<Option value={item._id} key={index}>{item.name}</Option>
							))}
						</Select>
					</Container>
				</ButtonList>
				<MobileButtonList>
					<Container>
						<label htmlFor="semester-list" className="inline-flex items-center gap-2 whitespace-nowrap text-base-content">
							<CalendarDaysIcon className="h-6 w-6" /> Kỳ học
						</label>
						<Select onChange={(e) => handleChangeSemester(e.target.value)} defaultValue={semester?.defaultSemester?._id}>
							{Array.isArray(semester?.listSemesters) && semester?.listSemesters.map((item, index) => (
								<Option value={item._id} key={index}>{item.name}</Option>
							))}
						</Select>
					</Container>
					<Container>
						<Menu as="div" >
							<Menu.Button as={Fragment}>
								<Button variant="ghost" size="sm" shape="square">
									<EllipsisHorizontalIcon className="h-6 w-6" />
								</Button>
							</Menu.Button>
							<Transition
								as={Fragment}
								enter="transition ease-out duration-200"
								enterFrom="opacity-0 translate-x-1"
								enterTo="opacity-100 translate-y-0"
								leave="transition ease-in duration-150"
								leaveFrom="opacity-100 translate-y-0"
								leaveTo="opacity-0 translate-x-1">
								<Menu.Items className="absolute right-0 top-0 z-50 mr-12 flex flex-col rounded-md bg-white shadow">
									<Menu.Item as="label" htmlFor="file-input" className={menuItemClasses()}>
										<DocumentArrowUpIcon className="h-5 w-5 text-[inherit]" /> Tải lên file Excel
										{
											selectedSemesterId === semester?.defaultSemester?._id && (
												<input
													ref={fileInputRefMobile}
													type="file"
													id="file-input"
													className="hidden"
													onChange={(e) => handleImportCompaniesMobile(e.target.files[0])}
												/>
											)
										}
									</Menu.Item>
									<Menu.Item as="button" className={menuItemClasses()} onClick={handleExportDataToExcel}>
										<DocumentArrowDownIcon className="h-5 w-5 text-[inherit]" />
										Export file Excel
									</Menu.Item>
									<Menu.Item as="button" className={menuItemClasses()} onClick={() => handleExportFile(excelSampleData)}>
										<ArrowDownTrayIcon className="h-5 w-5 text-[inherit]" />
										Tải file mẫu
									</Menu.Item>
								</Menu.Items>
							</Transition>
						</Menu>
					</Container>
				</MobileButtonList>
				{tableData && (
					<ReactTable
						columns={columnsData}
						data={tableData}
						loading={companyLoading}
					/>
				)}
			</Box>
			<Modal openState={modal} onOpenStateChange={setModal} title={dataModal?.title}>
				<p className="text-gray-500">{dataModal?.data}</p>
			</Modal>
		</Fragment>
	);
};

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex justify-between sm:hidden`;
const ActionList = tw.div`flex justify-between`;
const Container = tw.div`flex items-center gap-2`;
const Select = tw.select`capitalize block w-full rounded-[4px] border-none duration-300  px-2 py-1.5 outline-none ring-1 ring-gray-300 focus:ring-primary focus:active:ring-primary min-w-[196px] m-0`;
const Option = tw.option`leading-6 capitalize`;
const MobileButtonList = tw.div`flex justify-between relative sm:flex md:hidden lg:hidden xl:hidden`

export default CompanyListPage;