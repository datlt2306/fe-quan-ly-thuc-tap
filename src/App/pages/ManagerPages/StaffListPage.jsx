/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useAddStaffMutation, useDeleteStaffMutation, useGetAllStaffQuery, useUpdateStaffMutation } from "@/App/providers/apis/staffListApi";
import Button from "@/Core/components/common/Button";
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl";
import SelectFieldControl, { Option } from "@/Core/components/common/FormControl/SelectFieldControl";
import Modal from "@/Core/components/common/Modal";
import PopConfirm from "@/Core/components/common/Popup/PopConfirm";
import SlideOver from "@/Core/components/common/SlideOver";
import ReactTable from "@/Core/components/common/Table/ReactTable";
import {
	InputColumnFilter,
	SelectColumnFilter,
} from "@/Core/components/common/Table/ReactTableFilters";
import { RoleStaffEnum } from "@/Core/constants/roleStaff";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from '@hookform/resolvers/yup';
import tw from "twin.macro";
import { staffDataValidator } from "@/App/schemas/staffSchema";
import { useNavigate } from "react-router-dom";

const Box = tw.div`flex flex-col gap-6`;
const ButtonList = tw.div`flex items-center gap-2`;

const StaffListPage = () => {
	const { data: managers, refetch} = useGetAllStaffQuery();
	const [slideOverVisibility, setSlideOverVisibility] = useState(false);
	const navigate = useNavigate();
	const [user, setUser] = useState({});
	const [modal, setModal] = useState(false)
	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(staffDataValidator)
	});

const tableData = useMemo(() => {
	return Array.isArray(managers) ? managers.map((user,index)=> ({...user, index:index+1})): []
},[managers])

	const [handleAddNewStaff, addingStatus] = useAddStaffMutation()

	const [handleUpdateStaff, updatingStatus] = useUpdateStaffMutation()

	const [handleRemoveStaff, removeStatus] = useDeleteStaffMutation()

	const onAddSubmit = async (data) => {
		const result = await handleAddNewStaff(data)
		if (result?.data?.statusCode) {
			toast.error("Thêm nhân viên không thành công!")
			return;
		}
		setSlideOverVisibility(!slideOverVisibility)
		refetch()
		toast.success("Thêm nhân viên thành công!")
	}

	const onUpdateSubmit = async (data) => {
		const result = await handleUpdateStaff({id: user._id, payload: data})
		if (result?.data?.statusCode) {
			toast.error("Sửa nhân viên không thành công!")
			return;
		}
		setModal(!modal)
		refetch()
		toast.success("Sửa nhân viên thành công!")
	}

	const onDeleteSubmit = async (id) => {
		const result = await handleRemoveStaff(id)
		if (result?.data?.statusCode) {
			toast.error("Xóa không thành công!")
			return;
		}
		refetch()
		toast.success("Xóa nhân viên thành công!")
	}

	const filterRole =  Array.isArray(managers) && managers
		.filter((item, index, self) => self.findIndex(t => t.role === item.role) === index )
		.map((item)=> ({value:String(item?.role),label:item?.role == 1 ? "Nhân viên" : "Quản lý"} ))

	const onOpenUpdate = (data) => {
		reset()
		const selectedUser = managers && managers.find(item => item?._id === data);
		if (selectedUser) {
			setUser(selectedUser);
			setModal(!modal);
		}
	}
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
				Filter: ({ column: { filterValue, setFilter, preFilteredRows, id }}) => (
					<SelectColumnFilter
						column={{filterValue, setFilter, preFilteredRows, id}}
						customOptions={RoleStaffEnum}
					/>
				),
				filterable: true,
				isSort: true,
				Cell: ({value}) => (value == 1 ? "Nhân viên" : "Quản lý")
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
				accessor:"_id",
				canFilter: false,
				canSort: false,
				filterable: false,
				isSort: false,
				Cell:({value}) => (
					<ButtonList>
						<Button 
							type="button" 
							size="xs" 
							variant="secondary" 
							onClick={() => {onOpenUpdate(value)}}>
							Chỉnh sửa
						</Button>
						<PopConfirm
							okText="Ok"
							cancelText="Cancel"
							title={"Xóa nhân viên"}
							description={"Bạn muốn xóa nhân viên này ?"}
							onConfirm={() => onDeleteSubmit(value)}
						>
							<Button size="xs" variant="error">
								Xóa
							</Button>
						</PopConfirm>
					</ButtonList>
				),
			},
		],[]
	);

	return (
		<Fragment>
			<SlideOver
				open={slideOverVisibility}
				onOpen={setSlideOverVisibility}
				panelTitle={"Thêm nhân viên"}>
				{/* Add student form */}
				<Form onSubmit={handleSubmit(onAddSubmit)}>
					<InputFieldControl
						name="name"
						control={control}
						label="Tên nhân viên"
					/>
					<InputFieldControl
						name="email"
						control={control}
						label="Email nhân viên"
					/>
					<SelectFieldControl
						label="Quyền hạn nhân viên"
						control={control} 
						name="role"
						options={filterRole}
					/>
					<Button type="submit" size="sm" variant="primary">Thêm</Button>
				</Form>
			</SlideOver>
			<Modal
				openState={modal} 
				onOpenStateChange={setModal}
				title={"Sửa nhân viên"}>
				{user && (
				<Form onSubmit={handleSubmit(onUpdateSubmit)}>
					<InputFieldControl
					name="name"
					control={control}
					label="Tên nhân viên"
					defaultValue={user.name}
					/>
					<InputFieldControl
					name="email"
					control={control}
					label="Email nhân viên"
					defaultValue={user.email}
					/>
					<SelectFieldControl
					label="Quyền hạn nhân viên"
					control={control} 
					name="role"
					options={filterRole}
					defaultValue={user.role}
					/>
					<Button type="submit" size="sm" variant="primary">Lưu</Button>
				</Form>
  )}
			</Modal>
			<Box>
				<ButtonList>
					<Button
						type="button"
						variant="primary"
						size="sm"
						onClick={() => {
							reset()
							setSlideOverVisibility(!slideOverVisibility)
						}}>
						<PlusIcon className="h-3 w-3 text-[inherit]" /> Thêm nhân viên
					</Button>
				</ButtonList>

				<ReactTable
					columns={columnsData}
					data={tableData}
				/>
			</Box>
		</Fragment>
	);
};

const Form  = tw.form`flex flex-col gap-6`


export default StaffListPage;

