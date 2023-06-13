import { object, string } from 'yup';

export const campusDataValidator = object({
	name: string().trim().required('Tên cơ sở là bắt buộc')
});
