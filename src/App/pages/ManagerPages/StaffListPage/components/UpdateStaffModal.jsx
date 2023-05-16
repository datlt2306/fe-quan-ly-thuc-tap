/* eslint-disable react/prop-types */
import { useGetAllStaffQuery, useUpdateStaffMutation } from "@/App/providers/apis/staffListApi";
import { staffDataValidator } from "@/App/schemas/staffSchema";
import Button from "@/Core/components/common/Button";
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl";
import SelectFieldControl from "@/Core/components/common/FormControl/SelectFieldControl";
import { LoadingSpinner } from "@/Core/components/common/Loading/LoadingSpinner";
import Modal from "@/Core/components/common/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import tw from "twin.macro";
const UpdateStaffModal = ({userData,onOpenStateChange,openState}) => {
	const { data: managers} = useGetAllStaffQuery();
   const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(staffDataValidator),
	});

	useEffect(() => {
		if (userData) {
			reset({ 
				name: userData?.name,
				email: userData?.email,
				role: userData?.role
			});
		}
  }, [userData, reset]);

	const [handleUpdateStaff, updatingStatus] = useUpdateStaffMutation()

   const filterRole =  Array.isArray(managers?.list) && managers?.list
		.filter((item, index, self) => self.findIndex(t => t.role === item.role) === index )
		.map((item)=> ({value:String(item?.role),label:item?.role == 1 ? "Nhân viên" : "Quản lý"} ))

	const onUpdateSubmit = async (data) => {
		const result = await handleUpdateStaff({id: userData._id, payload: data})
		if (result?.data?.statusCode) {
			toast.error("Sửa nhân viên không thành công!")
			return;
		}
		onOpenStateChange(!openState)
		toast.success("Sửa nhân viên thành công!")
	}

   return (
		<Modal 
			openState={openState} 
			onOpenStateChange={onOpenStateChange} 
			title={"Sửa nhân viên"}
		>
			<Form onSubmit={handleSubmit(onUpdateSubmit)}>
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
				<Button type="submit" size="sm" variant="primary">
					{updatingStatus.isLoading && <LoadingSpinner size="sm" variant="primary"/>} 
					Cập nhật
				</Button>
			</Form>
		</Modal>
   )
}

const Form  = tw.form`flex flex-col gap-6`

export default UpdateStaffModal;