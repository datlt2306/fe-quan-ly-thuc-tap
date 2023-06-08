import { AllowedFileExtension } from '@/Core/constants/allowedFileType';
import getFileExtension from '@/Core/utils/getFileExtension';
import { number, object, string, mixed } from 'yup';

export const reportSchema = object().shape({
	resultScore: number()
		.typeError('Vui lòng nhập số')
		.required('Vui lòng nhập điểm kết quả')
		.positive('Điểm kết quả phải là số dương')
		.max(10, 'Điểm kết quả không được vượt quá 10'),
	attitudePoint: number()
		.typeError('Vui lòng nhập số')
		.required('Vui lòng nhập điểm kết quả')
		.positive('Điểm kết quả phải là số dương')
		.max(10, 'Điểm kết quả không được vượt quá 10'),
	signTheContract: number().required('Vui lòng chọn đề xuất ký HĐLĐ'),
	endInternShipTime: string()
		.test({
			message: 'Ngày bắt đầu phải lớn hơn ngày kết thúc',
			test: (value, { options: { context } }) => {
				return value > context?.startInternshipTime;
			}
		})
		.required('Vui lòng nhập thời gian kết thúc thực tập'),
	file: mixed()
		.test({
			message: 'Vui lòng chọn file PDF',
			test: (value) => AllowedFileExtension.PDF === getFileExtension(value)
		})
		.required('Vui lòng chọn file')
});
