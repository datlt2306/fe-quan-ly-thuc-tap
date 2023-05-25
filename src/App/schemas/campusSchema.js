import { object, string } from 'yup';

export const campusDataValidator = object({
	name: string()
		.trim()
		.test('', 'Tên cơ sở phải viết hoa !', (value) => {
			const valueSplit = value.split(' ').slice(2);
			let isUpper = true;
			for (let i = 0; i < valueSplit.length; i++) {
				if (!(valueSplit[i].charAt(0) === valueSplit[i].charAt(0).toUpperCase())) {
					console.log(valueSplit[i]);
					isUpper = false;
					break;
				}
			}
			return isUpper;
		})
		.required('Tên cơ sở là bắt buộc')
});
