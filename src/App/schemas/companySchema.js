import * as yup from 'yup';
import './customYupMethods';

export const companySchema = yup.object({
	name: yup.string().trim().required('Vui lòng nhập đầy đủ tên doanh nghiệp'),
	tax_code: yup
		.string()
		.trim()
		.test({
			message: 'Đã có công ty với mã số thuế này',
			test: function (value, { options: { context } }) {
				console.log('context.companiesList :>> ', context);
				const result = Array.isArray(context.companiesList)
					? !context.companiesList.some(
							(company) => company.tax_code === value && this.parent.name !== company.name
					  )
					: false;
				console.log('result :>> ', result);
				return result;
			}
		})
		.required('Vui lòng nhập đầy đủ mã số thuế'),
	internship_position: yup.string().trim().required('Vui lòng nhập đầy đủ vị trí thực tập'),
	major: yup.string().required('Vui lòng chọn ngành'),
	amount: yup
		.number()
		.typeError('Vui lòng nhập số nguyên dương')
		.required('Vui lòng nhập số lượng')
		.positive('Vui lòng nhập số nguyên dương')
		.integer('Vui lòng nhập số nguyên dương'),
	address: yup.string().trim().required('Vui lòng nhập đầy đủ địa chỉ'),
	business_code: yup
		.string()
		.test({
			message: 'Công ty đã có mã tuyển dụng này',
			test: function (value, { options: { context } }) {
				const result = Array.isArray(context.companiesList)
					? !context.companiesList
							.filter((company) => company._id !== context.id)
							.some((company) => company.business_code === value && this.parent.tax_code === company.tax_code)
					: false;
				return result;
			}
		})
		.required('Vui lòng nhập đầy đủ mã doanh nghiệp'),
	requirement: yup.string(),
	description: yup.string(),
	benefit: yup.string()
});

export const companyArraySchema = yup
	.array(
		yup.object({
			name: yup.string().required('Vui lòng nhập đầy đủ tên doanh nghiệp').trim(),
			tax_code: yup.string().trim().required('Vui lòng nhập đầy đủ mã số thuế'),
			internship_position: yup.string().trim().required('Vui lòng nhập đầy đủ vị trí thực tập'),
			major: yup.string().required('Vui lòng chọn ngành'),
			amount: yup
				.number()
				.typeError('Vui lòng nhập số nguyên dương')
				.required('Vui lòng nhập số lượng')
				.positive('Vui lòng nhập số nguyên dương')
				.integer('Vui lòng nhập số nguyên dương'),
			address: yup.string().trim().required('Vui lòng nhập đầy đủ địa chỉ'),
			business_code: yup.string().trim().required('Vui lòng nhập đầy đủ mã doanh nghiệp'),
			requirement: yup.string(),
			description: yup.string(),
			benefit: yup.string()
		})
	)
	.unique('Mã tuyển dụng không được trùng', (value) => value.business_code);
