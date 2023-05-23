import * as yup from 'yup';
import { StudentSchoolingStatus } from '../constants/studentStatus';

/**
 * * Email manager: /^[A-Z0-9._%+-]+@fe\.edu\.vn$/i
 * * Email sinh viên: /^[\w-\.]+@fpt\.edu\.vn$/
 */

yup.addMethod(yup.array, 'unique', function (message, mapper = (a) => a) {
	return this.test('unique', message, function (list) {
		return list.length === new Set(list.map(mapper)).size;
	});
});

export const newStudentSchema = yup
	.array(
		yup.object({
			mssv: yup.string().trim().required('Vui lòng nhập đầy đủ mã sinh viên'),
			name: yup.string().trim().required('Vui lòng nhập đầy đủ tên sinh viên'),
			course: yup.string().trim().required('Vui lòng nhập đầy đủ khóa nhập học của sinh viên'),
			majorCode: yup.string().trim().required('Vui lòng nhập đầy đủ mã ngành của sinh viên'),
			email: yup
				.string()
				.trim()
				.matches(/^[\w-\.]+@fpt\.edu\.vn$/, { message: 'Email sinh viên không đúng định dạng' })
				.required('Vui lòng nhập đầy đủ email của sinh viên'),
			phoneNumber: yup
				.string()
				.trim()
				.matches(/^\d{10}$/, { message: 'Số điện thoại của sinh viên chưa đúng định dạng' })
				.required('Vui lòng nhập đầy đủ số điện thoại của sinh viên'),
			statusStudent: yup
				.string()
				.trim()
				.oneOf(Object.keys(StudentSchoolingStatus), 'Trạng thái sinh viên không hợp lệ')
				.required('Vui lòng nhập đầy đủ trạng thái sinh viên'),
			smester_id: yup.string().required('Vui lòng nhập đầy đủ kỳ học hiện tại của sinh viên'),
			note: yup.string().optional()
		})
	)
	.unique('Email không được trùng !', (value) => value.email)
	.unique('Mã sinh viên không được trùng !', (value) => value.mssv);

export const updateReviewCvData = yup.object({
	listIdStudent: yup.array(yup.string()).required('Chưa có sinh viên nào được chọn !'),
	listEmailStudent: yup
		.array(
			yup.string().matches(/^[A-Z0-9._%+-]+@fe\.edu\.vn$/i, { message: 'Email của sinh viên chưa đúng định dạng !' })
		)
		.required('')
});
