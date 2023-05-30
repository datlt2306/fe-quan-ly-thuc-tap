import { object, string } from 'yup';

export const majorSchema = object({
	name: string()
		.required('Tên chuyên ngành là bắt buộc')
		.matches(/^[^!@#$%^&*(),.?":{}|<>]+$/, 'Tên chuyên ngành không được chứa các ký tự đặc biệt')
		.default('')
		.trim(),
	majorCode: string()
		.required('Mã chuyên ngành là bắt buộc')
		.matches(/^[a-zA-Z0-9\s]+$/, 'Mã chuyên ngành không được chứa các ký tự đặc biệt')
		.default('')
		.trim()
});
