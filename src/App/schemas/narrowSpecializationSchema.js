import * as yup from 'yup';

export const narrowSpecializationSchema = yup.object().shape({
	name: yup.string().trim().default('').required('Tên ngành hẹp không được để trống'),
	id_majors: yup.string().required('Chuyên ngành chính không được để trống')
});
