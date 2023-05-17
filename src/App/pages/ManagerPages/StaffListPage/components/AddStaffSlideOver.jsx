/* eslint-disable react/prop-types */
import { useAddStaffMutation, useGetAllStaffQuery } from "@/App/providers/apis/staffListApi"
import { staffDataValidator } from "@/App/schemas/staffSchema"
import Button from "@/Core/components/common/Button"
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl"
import SelectFieldControl from "@/Core/components/common/FormControl/SelectFieldControl"
import { LoadingSpinner } from "@/Core/components/common/Loading/LoadingSpinner"
import SlideOver from "@/Core/components/common/SlideOver"
import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import tw from "twin.macro"

const AddStaffSlideOver = ({onOpen,open}) => {
	const { data: managers} = useGetAllStaffQuery();
   const { handleSubmit, control , reset} = useForm({
		resolver: yupResolver(staffDataValidator),
		defaultValue: staffDataValidator.getDefault(),
	});

	const [handleAddNewStaff, addingStatus] = useAddStaffMutation()

   const filterRole =  Array.isArray(managers?.list) && managers?.list
   .filter((item, index, self) => self.findIndex(t => t.role === item.role) === index )
   .map((item)=> ({value:String(item?.role),label:item?.role == 1 ? "Nhân viên" : "Quản lý"} ))

   const onAddSubmit = async (data) => {
		const result = await handleAddNewStaff(data)
		if (result?.data?.statusCode) {
			toast.error("Thêm nhân viên không thành công!")
			return
		}
		onOpen(!open)
		reset()
		toast.success("Thêm nhân viên thành công!")
	}


	useEffect(() => {
		if(!open)
		reset()
	},[open])
   return (
      <SlideOver
				open={open}
				onOpen={onOpen}
				panelTitle={"Thêm nhân viên"}
      >
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
					<Button type="submit" variant="primary">
                  {addingStatus.isLoading && <LoadingSpinner size="sm" variant="primary"/>}
                  Thêm
                  </Button>
				</Form>
			</SlideOver>
   )
}

const Form  = tw.form`flex flex-col gap-6`

export default AddStaffSlideOver