import * as yup from 'yup';

const sharedFieldSchema = {
	address: yup.string().required('Vui lòng nhập địa chỉ của bạn').default(''),
	dream: yup.string().required('Vui lòng nhập vị trí thực tập').default(''),
	major: yup.string().required('Vui lòng chọn chuyên ngành').default(''),
	phoneNumber: yup
		.string()
		.required('Vui lòng nhập  số điện thoại')
		.matches(/^(0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ')
		.default('')
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
	nameCompany: yup.string().required('Vui lòng nhập tên công ty').default(''),
	taxCode: yup
		.string()
		.required('Vui lòng nhập Mã số thuế')
		.default('')
		.matches(/^[0-9]*$/, 'Mã số thuế không hợp lệ'),
	position: yup.string().required('Vui lòng nhập chức vụ người tiếp nhận').default(''),
	phoneNumberCompany: yup
		.string()
		.min(10, 'Phải có ít nhất 10 kí tự')
		.max(13, 'Tối đa 13 kí tự')
		.matches(
			/^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$/,
			'Số điện thoại doanh nghiệp không hợp lệ'
		)
		.required('Vui lòng nhập số điện thoại doanh nghiệp')
		.default(''),
	emailEnterprise: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email người tiếp nhận').default(''),
	addressCompany: yup.string().required('Vui lòng nhập địa chỉ công ty').default('')
});
