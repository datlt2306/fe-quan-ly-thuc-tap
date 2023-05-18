/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useDeleteStaffMutation, useGetAllStaffQuery } from "@/App/providers/apis/staffListApi";
import { staffDataValidator } from "@/App/schemas/staffSchema";
import Button from "@/Core/components/common/Button";
import PopConfirm from "@/Core/components/common/Popup/PopConfirm";
import ReactTable from "@/Core/components/common/Table/ReactTable";
import { InputColumnFilter, SelectColumnFilter } from "@/Core/components/common/Table/ReactTableFilters";
import { RoleStaffEnum } from "@/Core/constants/roleStaff";
import { PencilSquareIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { Fragment, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import tw from "twin.macro";
import AddStaffSlideOver from "./components/AddStaffSlideOver";
import UpdateStaffModal from "./components/UpdateStaffModal";

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex items-center gap-2`;

const StaffListPage = () => {
	const { data: managers } = useGetAllStaffQuery();
	const [modal, setModal] = useState(false);
	const [user, setUser] = useState();
	const [slideOverVisibility, setSlideOverVisibility] = useState(false);
	const { reset } = useForm({
		resolver: yupResolver(staffDataValidator),
	});

	const tableData = useMemo(() => {
		return Array.isArray(managers?.list) ? managers?.list?.map((user, index) => ({ ...user, index: index + 1 })) : [];
	}, [managers]);

	const [handleRemoveStaff, removeStatus] = useDeleteStaffMutation();

	const onDeleteSubmit = async (id) => {
		const result = await handleRemoveStaff(id);
		if (result?.data?.statusCode) {
			toast.error("Xóa không thành công!");
			return;
		}
		toast.success("Xóa nhân viên thành công!");
	};

	const onOpenUpdate = (data) => {
		const selectedUser = managers?.list && managers?.list?.find((item) => item?._id === data);
		if (selectedUser) {
			setUser(selectedUser);
			setModal(!modal);
		}
	};

	const columnsData = useMemo(
		() => [
			{
				Header: "STT",
				accessor: "index",
			},
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
				Filter: ({ column: { filterValue, setFilter, preFilteredRows, id } }) => (
					<SelectColumnFilter column={{ filterValue, setFilter, preFilteredRows, id }} customOptions={RoleStaffEnum} />
				),
				filterable: true,
				isSort: true,
				Cell: ({ value }) => (value == 1 ? "Nhân viên" : "Quản lý"),
			},
			{
				Header: "Cơ sở đang làm việc",
				accessor: "campus_id",
				Filter: InputColumnFilter,
				filterable: true,
				isSort: true,
				Cell: ({ value }) => value.name,
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
						<Button
							size="xs"
							variant="default"
							shape="square"
							onClick={() => {
								onOpenUpdate(value);
							}}>
							<PencilSquareIcon className="h-4 w-4" />
						</Button>
						<PopConfirm
							okText="Ok"
							cancelText="Cancel"
							title={"Xóa nhân viên"}
							description={"Bạn muốn xóa nhân viên này ?"}
							onConfirm={() => onDeleteSubmit(value)}>
							<Button size="xs" variant="error" shape="square">
								<TrashIcon className="h-4 w-4" />
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
			<AddStaffSlideOver open={slideOverVisibility} onOpen={setSlideOverVisibility} panelTitle={"Thêm nhân viên"} />

			<UpdateStaffModal openState={modal} onOpenStateChange={setModal} title={"Sửa nhân viên"} userData={user} />

			<Box>
				<ButtonList>
					<Button
						type="button"
						variant="primary"
						size="sm"
						onClick={() => {
							reset();
							setSlideOverVisibility(!slideOverVisibility);
						}}>
						<UserPlusIcon className="h-4 w-4 text-[inherit] " /> Thêm nhân viên
					</Button>
				</ButtonList>

				<ReactTable columns={columnsData} data={tableData} />
			</Box>
		</Fragment>
	);
};

export default StaffListPage;
