import * as yup from 'yup';

const sharedFieldSchema = {
	address: yup.string().required('Vui lòng nhập địa chỉ của bạn').default('').trim(),
	dream: yup.string().required('Vui lòng nhập vị trí thực tập').default('').trim(),
	phoneNumber: yup
		.string()
		.required('Vui lòng nhập  số điện thoại')
		.matches(/^\d{10,11}$/, 'Số điện thoại không hợp lệ')
		.default('')
		.trim()
};

export const formSignUpSchoolSupportSchema = yup.object().shape({
	...sharedFieldSchema,
	business: yup.string().required('Vui lòng chọn doanh nghiệp').default(''),
	CV: yup
		.mixed()
		.default('')
		.test('required', 'CV không được để trống', (value) => {
			return value;
		})
});

export const formSignUpSelfFindingSchema = yup.object().shape({
	...sharedFieldSchema,
	nameCompany: yup.string().required('Vui lòng nhập tên công ty').default('').trim(),
	taxCode: yup
		.string()
		.required('Vui lòng nhập Mã số thuế')
		.default('')
		.matches(/^[0-9]*$/, 'Mã số thuế không hợp lệ')
		.trim(),
	position: yup.string().required('Vui lòng nhập chức vụ người tiếp nhận').default('').trim(),
	phoneNumberCompany: yup
		.string()
		.min(10, 'Phải có ít nhất 10 kí tự')
		.max(13, 'Tối đa 13 kí tự')
		.matches(/^\d{10,11}$/, 'Số điện thoại doanh nghiệp không hợp lệ')
		.required('Vui lòng nhập số điện thoại doanh nghiệp')
		.default('')
		.trim(),
	emailEnterprise: yup
		.string()
		.email('Email không hợp lệ')
		.required('Vui lòng nhập email người tiếp nhận')
		.default('')
		.trim(),
	addressCompany: yup.string().required('Vui lòng nhập địa chỉ công ty').default('').trim()
});
