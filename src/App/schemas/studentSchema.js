import { object, string, array } from "yup";

export const newStudentSchema = array(
	object({
		name: string().required(),
		mssv: string().required(),
		course: string().required(),
		phoneNumber: string().required(),
		email: string().email("Email sinh viên không hợp lệ").required("Email là field bắt buộc"),
	})
);
