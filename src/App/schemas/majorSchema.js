import { object, string } from 'yup';

export const majorSchema = object({
	name: string().required('Tên chuyên ngành là bắt buộc').default('').trim(),
	majorCode: string().required('Mã chuyên ngành là bắt buộc').default('').trim()
});
