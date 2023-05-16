import { StudentSchoolingStatus } from "@/Core/constants/studentStatus";
import { object, string, array } from "yup";

export const newStudentSchema = array(
	object({
		mssv: string().required("Vui lòng nhập đầy đủ mã sinh viên"),
		name: string().required("Vui lòng nhập đầy đủ tên sinh viên"),
		course: string().required("Vui lòng nhập đầy đủ khóa nhập học của sinh viên"),
		majorCode: string().required("Vui lòng nhập đầy đủ mã ngành của sinh viên"),
		email: string()
			.email()
			.matches(/^[\w-\.]+@fpt\.edu\.vn$/, { message: "Email sinh viên không đúng định dạng" })
			.required("Vui lòng nhập đầy đủ email của sinh viên"),
		phoneNumber: string()
			.matches(/^\d{10}$/, { message: "Số điện thoại của sinh viên chưa đúng định dạng" })
			.required("Vui lòng nhập đầy đủ số điện thoại của sinh viên"),
		statusStudent: string().required("Vui lòng nhập đầy đủ trạng thái sinh viên"),
		smester_id: string().required("Vui lòng nhập đầy đủ kỳ học hiện tại của sinh viên"),
		note: string().optional(),
	})
);
