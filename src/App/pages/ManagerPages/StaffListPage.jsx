import { useExportToExcel, useImportFromExcel } from "@/App/hooks/useExcel";
import { useGetAllStaffQuery } from "@/App/providers/apis/staffApi";
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
import axiosClient from "@/Core/configs/axiosConfig";
import mapExcelData from "@/Core/utils/mapExcelData";
import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import tw from "twin.macro";

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex items-center gap-2`;

const StaffListPage = () => {
	const [tableData, setTableData] = useState();
	const [slideOverVisibility, setSlideOverVisibility] = useState(false);
	const { data } = useGetAllStaffQuery();
	useEffect(() => {
		axiosClient.get("/staff").then(res => setTableData(res.list))
	}, [])

	const columnsData = useMemo(
		() => [
			{
				Header: "Tên nhân viên",
				dataIndex: "name",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Email nhân viên",
				dataIndex: "email",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Quyền Hạn nhân viên",
				dataIndex: "role",
				Filter: SelectColumnFilter,
				filterable: true,
				isSort: true,
				render: (value) => (value === 1 ? "Nhân viên" : "Quản Lí"),
			},
			{
				Header: "Cơ sở đang làm việc",
				dataIndex: ["campus_id", "name"],
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
							title={"Xóa nhân viên"}
							description={"Bạn muốn xóa nhân viên này ?"}
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
						<PlusIcon className="h-3 w-3 text-[inherit]" /> Thêm nhân viên
					</Button>
				</ButtonList>

				<ReactTable
					columns={columnsData}
					data={[]}
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

export default StaffListPage;

