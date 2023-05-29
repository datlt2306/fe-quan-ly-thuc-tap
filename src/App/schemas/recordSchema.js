import { object, string, number, array } from 'yup';

export const recordSchema = object({
	form: string().required('Vui lòng chọn file'),
	date: string().required('Vui lòng nhập thời gian bắt đầu thực tập')
});
