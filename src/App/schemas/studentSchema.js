import yup from 'yup';

export const studentSchema = yup.object({
	first_name: yup.string().required(),
	last_name: yup.string().required(),
	email: yup.string().match().required(),
	campus: yup.string().required(),
	// ... other fields
});
