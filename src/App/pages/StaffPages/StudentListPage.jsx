import { useExportToExcel, useImportFromExcel } from "@/App/hooks/useExcel";
import { studentDataValidator } from "@/App/schemas/studentSchema";
import Badge from "@/Core/components/common/Badge";
import Button from "@/Core/components/common/Button";
import PopConfirm from "@/Core/components/common/Popup/PopConfirm";
import SlideOver from "@/Core/components/common/SlideOver";
import ReactTable from "@/Core/components/common/Table/ReactTable";
import {
	InputColumnFilter,
	SelectColumnFilter,
} from "@/Core/components/common/Table/ReactTableFilters";
import mapExcelData from "@/Core/utils/mapExcelData";
import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import tw from "twin.macro";

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex items-center gap-2`;

const initialData = [
	["MSV", "Thành viên", "Số điện thoại", "Mail cá nhân", "Mail FPT", "Git Account"],
];

const StudentListPage = () => {
	const { handleGetFile, data, error } = useImportFromExcel();
	const [tableData, setTableData] = useState(data);
	const [slideOverVisibility, setSlideOverVisibility] = useState(false);

	const handleExport = useExportToExcel({
		fileName: "Danh sách sinh viên",
		data: data.length > 0 ? data : initialData,
	});

	useEffect(() => {
		if (error) {
			toast.error("File không đúng định dạng dữ liệu!");
			return;
		}
		if (data.length) {
			const mappedData = mapExcelData(data);
			studentDataValidator
				.validate(mappedData)
				.then((data) => {
					setTableData(data);
					toast.success("Import dữ liệu thành công!");
				})
				.catch((error) => toast.error("File không đúng định dạng dữ liệu!"));
		}
	}, [data, error]);

	const columnsData = useMemo(
		() => [
			{
				Header: "STT",
				accessor: "stt",
			},
			{
				Header: "Họ tên",
				accessor: "Họ tên",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Mã sinh viên",
				accessor: "MSSV", // object key
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
				canSort: true,
				canFilter: true,
				Cell: ({ value }) => <span className="font-medium">{value}</span>,
			},
			{
				Header: "Khóa nhập học",
				accessor: "Khóa nhập học",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Trạng thái",
				accessor: "Trạng thái",
				Filter: SelectColumnFilter,
				filterable: true,
				isSort: true,
				Cell: ({ value }) => <Badge variant={"error"}>{value}</Badge>,
			},
			{
				Header: "Mã ngành",
				accessor: "Mã ngành",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},

			{
				Header: "Số điện thoại",
				accessor: "Số điện thoại",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Email",
				accessor: "Email",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Bổ sung",
				accessor: "Bổ sung",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},

			{
				Header: "Thao tác",
				canFilter: false,
				canSort: false,
				filterable: false,
				isSort: false,
				Cell: (
					<ButtonList>
						<Button type="button" size="xs" variant="secondary">
							Chỉnh sửa
						</Button>
						<PopConfirm
							okText="Ok"
							cancelText="Cancel"
							title={"Xóa sinh viên"}
							description={"Bạn muốn xóa sinh viên này ?"}
							// onCancel={() => toast.info("Cancelled")}
							onConfirm={() => toast.info("Removed")}>
							<Button size="xs" variant="error">
								Xóa
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
			<SlideOver
				open={slideOverVisibility}
				onOpen={setSlideOverVisibility}
				panelTitle={"Thêm sinh viên"}>
				{/* Add student form */}
			</SlideOver>

			<Box>
				<ButtonList>
					<Button
						type="button"
						variant="primary"
						size="sm"
						onClick={() => setSlideOverVisibility(!slideOverVisibility)}>
						<PlusIcon className="h-3 w-3 text-[inherit]" /> Thêm mới sinh viên
					</Button>

					<Button as="label" size="sm" htmlFor="file-input">
						<ArrowUpIcon className="h-3 w-3 text-[inherit]" /> Import file Excel
						<input
							type="file"
							id="file-input"
							className="hidden"
							onChange={(e) => handleGetFile(e.target.files[0])}
						/>
					</Button>

					<Button type="button" variant="outline" size="sm" onClick={handleExport}>
						<ArrowDownIcon className="h-3 w-3 text-[inherit]" />
						Export file Excel
					</Button>
				</ButtonList>

				<ReactTable
					columns={columnsData}
					data={tableData}
					noDataComponent={
						<tr>
							<td>Empty</td>
						</tr>
					}
				/>
			</Box>
		</Fragment>
	);
};

export default StudentListPage;
