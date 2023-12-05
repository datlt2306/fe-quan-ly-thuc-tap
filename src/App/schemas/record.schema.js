import { AllowedFileExtension } from '@/Core/constants/allowedFileType';
import getFileExtension from '@/Core/utils/getFileExtension';
import { mixed, object, string } from 'yup';

export const recordSchema = object({
	form: mixed()
		.test({
			name: 'File type',
			message: 'Vui lòng chọn file PDF',
			test: (value) => {
				const allFileTypes = Object.values(AllowedFileExtension);
				const allowedFileTypes = allFileTypes.filter(
					(ext) => ext !== AllowedFileExtension.DOCX && ext !== AllowedFileExtension.XLSX
				);
				return allowedFileTypes.includes(getFileExtension(value));
			}
		})

		.required('Vui lòng chọn file'),
	date: string().required('Vui lòng nhập thời gian bắt đầu thực tập')
});
