import { object, string } from 'yup';

export const majorSchema = object({
	name: string().required('Tên chuyên ngành là bắt buộc').default('').trim(),
	majorCode: string()
		.matches(/^[a-zA-Z0-9\s]+$/, 'Mã chuyên ngành không được chứa các ký tự đặc biệt')
		.required('Mã chuyên ngành là bắt buộc')
		.default('')
		.trim()
});
