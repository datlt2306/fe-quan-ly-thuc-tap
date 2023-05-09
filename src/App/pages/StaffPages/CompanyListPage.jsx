import Button from "@/Core/components/common/Button";
import Badge from "@/Core/components/common/Badge";
import PopConfirm from "@/Core/components/common/Popup/PopConfirm";
import SlideOver from "@/Core/components/common/SlideOver";
import ReactTable from "@/Core/components/common/Table/ReactTable";
import {
	InputColumnFilter,
	SelectColumnFilter,
} from "@/Core/components/common/Table/ReactTableFilters";
import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from "@heroicons/react/24/outline";

import classNames from "classnames";
import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import tw from "twin.macro";

import axiosClient from "@/Core/configs/axiosConfig";
import { useGetAllCompanyQuery } from "@/App/providers/apis/businessApi";

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex items-center gap-2`;

const columnName = [
	[
		"STT",
		"Mã Doanh Nghiệp",
		"Tên Doanh Nghiệp",
		"Vị trí thực tập",
		"Số lượng",
		"Quyền lợi",
		"Địa chỉ",
		"Ngành",
		"Yêu Cầu",
		"Chi tiết",
		"Thao tác",
	],
];

const CompanyListPage = () => {
	const [slideOverVisibility, setSlideOverVisibility] = useState(false);
	const [tableData, setTableData] = useState([]);
	const { data } = useGetAllCompanyQuery();
	
	useEffect(() => {
		setTableData(data?.list);
	}, [data]);

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
				accessor: "majors",
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
				panelTitle={"Thêm doanh nghiệp"}></SlideOver>
			<Box>
				<ButtonList>
					<Button
						type="button"
						variant="primary"
						size="sm"
						onClick={() => setSlideOverVisibility(!slideOverVisibility)}>
						<PlusIcon className="h-3 w-3 text-[inherit]" /> Thêm mới doanh nghiệp
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

					<Button type="button" variant="outline" size="sm">
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

export default CompanyListPage;
