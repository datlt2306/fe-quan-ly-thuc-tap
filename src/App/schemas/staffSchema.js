import { object, string } from "yup";

export const staffDataValidator = object({
	name: string().required("Tên nhân viên là bắt buộc"),
	email: string()
		.email("Email không hợp lệ!")
		.matches(/^[\w-\.]+@fpt\.edu\.vn$/, { message: "Email nhân viên phải là mail FPT!" })
		.required("Vui lòng nhập đầy đủ email của nhân viên"),
	role: string().required("Quyền hạn là bắt buộc"),
});
