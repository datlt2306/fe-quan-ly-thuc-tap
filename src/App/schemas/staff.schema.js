import { object, string } from 'yup';

export const staffDataValidator = object({
	name: string().trim().required('Tên nhân viên là bắt buộc'),
	email: string()
		.test({
			message: 'Email đã tồn tại',
			test: (value, { options: { context } }) => {
				return Array.isArray(context.users)
					? !context.users.some((user) => user?.email === value && user?._id !== context.userData?._id)
					: false;
			}
		})
		.matches(/^[A-Z0-9._%+-]+@fpt\.edu\.vn$/i, { message: 'Email nhân viên phải là mail FPT!' })
		.test('no-uppercase', 'Email không được viết hoa', (value) => {
			if (value && /[A-Z]/.test(value)) {
				return false;
			}
			return true;
		})
		.required('Vui lòng nhập đầy đủ email của nhân viên')
});

export const managerDataValidator = object({
	name: string().trim().required('Tên nhân viên là bắt buộc'),
	email: string()
		.email('Email không hợp lệ!')
		.matches(/^[A-Z0-9._%+-]+@fpt\.edu\.vn$/i, { message: 'Email nhân viên phải là mail FPT!' })
		.test('no-uppercase', 'Email không được viết hoa', (value) => {
			if (value && /[A-Z]/.test(value)) {
				return false;
			}
			return true;
		})
		.required('Vui lòng nhập đầy đủ email của nhân viên'),
	campus_id: string().required('Cơ sở là bắt buộc')
});

export const applicationPasswordValidator = object({
	applicationPassword: string()
		.trim()
		.length(16, 'Mật khẩu ứng dụng phải có đủ 16 ký tự')
		.required('Mật khẩu ứng dụng không được bỏ trống')
});
