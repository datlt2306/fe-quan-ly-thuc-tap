import * as yup from 'yup';

export const requestOfStudentValidator = yup.object().shape({
	description: yup.string().required('Mô tả không được để trống')
});
