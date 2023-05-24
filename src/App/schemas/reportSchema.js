import { number, object, string } from 'yup';

export const reportSchema = object({
	resultScore: number()
		.typeError('Vui lòng nhập số')
		.required('Vui lòng nhập điểm kết quả')
		.positive('Điểm kết quả phải là số dương')
		.max(10),
	attitudePoint: number()
		.typeError('Vui lòng nhập số')
		.required('Vui lòng nhập điểm kết quả')
		.positive('Điểm kết quả phải là số dương')
		.max(10),
	signTheContract: number().required('Vui lòng chọn đề xuất ký HĐLĐ'),
	endInternShipTime: string().required('Vui lòng nhập thời gian kết thúc thực tập'),
	file: string().required('Vui lòng chọn file')
});
