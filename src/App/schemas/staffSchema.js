import { object, string } from 'yup';

export const staffDataValidator = object({
	name: string().trim().required('Tên nhân viên là bắt buộc'),
	email: string()
		.email('Email không hợp lệ!')
		.matches(/^[A-Z0-9._%+-]+@fe\.edu\.vn$/i, { message: 'Email nhân viên phải là mail FE!' })
		.test('no-uppercase', 'Email không được viết hoa', (value) => {
			if (value && /[A-Z]/.test(value)) {
				return false;
			}
			return true;
		})
		.required('Vui lòng nhập đầy đủ email của nhân viên'),
	role: string().required('Quyền hạn là bắt buộc')
});
