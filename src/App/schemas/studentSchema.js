import { object, string, array } from "yup";

export const studentDataValidator = array(
	object({
		"Họ tên": string().required(),
		MSSV: string().required(),
		"Khóa nhập học": string().required(),
		"Trạng thái": string().required(),
		"Mã ngành": string().required(),
		"Số điện thoại": string().required(),
		Email: string().email().required("Email là field bắt buộc"),
	})
);

