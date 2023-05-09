import { useGetAllStaffQuery } from "@/App/providers/apis/staffListApi";
import Button from "@/Core/components/common/Button";
import PopConfirm from "@/Core/components/common/Popup/PopConfirm";
import SlideOver from "@/Core/components/common/SlideOver";
import ReactTable from "@/Core/components/common/Table/ReactTable";
import {
	InputColumnFilter,
	SelectColumnFilter,
} from "@/Core/components/common/Table/ReactTableFilters";
import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useMemo, useState } from "react";
import axiosClient from "@/Core/configs/axiosConfig";
import { toast } from "react-toastify";
import tw from "twin.macro";

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex items-center gap-2`;

const StaffListPage = () => {
	const [slideOverVisibility, setSlideOverVisibility] = useState(false);
	const [tableData, setTableData] = useState([]);

	useEffect(() => {
		const getAllStaff = async () => {
			const data = await axiosClient.get("http://localhost:9998/api/manager");
			setTableData(data)
		}
		getAllStaff()
	},[])
	const columnsData = useMemo(
		() => [
			{
				Header: "Tên nhân viên",
				accessor: "name",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Email nhân viên",
				accessor: "email",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
			},
			{
				Header: "Quyền Hạn nhân viên",
				accessor: "role",
				Filter: SelectColumnFilter,
				filterable: true,
				isSort: true,
				Cell: (value) => (value == 1 ? "Nhân viên" : "Quản Lí"),
			},
			{
				Header: "Cơ sở đang làm việc",
				accessor: "campus_id",
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
				panelTitle={"Thêm nhân viên"}>
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

export default StaffListPage;

