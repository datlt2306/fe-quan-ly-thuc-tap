import { Fragment, useEffect, useMemo, useState } from "react";
import Button from "@/Core/components/common/Button";
import PopConfirm from "@/Core/components/common/Popup/PopConfirm";
import ReactTable from "@/Core/components/common/Table/ReactTable";
import {
	InputColumnFilter,
	SelectColumnFilter,
} from "@/Core/components/common/Table/ReactTableFilters";
import LoadingSpinner from '@/Core/components/common/Loading/LoadingSpinner';
import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import tw from "twin.macro";
import { useDeleteCompanyMutation, useGetAllCompanyQuery } from "@/App/providers/apis/businessApi";
import { useGetAllSemestersQuery } from "@/App/providers/apis/semesterApi";
import { useSelector } from "react-redux";

const CompanyListPage = () => {
	// get list company, semester, campus
	const { data: company, refetch } = useGetAllCompanyQuery({ limit: 1000 }, { refetchOnMountOrArgChange: true });
	const campus = useSelector((state) => state.campus)
	const { data: semester } = useGetAllSemestersQuery({ campus_id: campus?.currentCampus?._id });

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
								onChange={(e) => handleGetFile(e.target.files[0])}
							/>
						</Button>

						<Button type="button" variant="outline" size="sm">
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