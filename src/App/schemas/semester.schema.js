import { date, object, string } from 'yup';

export const semesterDataValidator = object({
	name: string().trim().required('Tên kì học là bắt buộc'),
	start_time: date()
		.required('Ngày bắt đầu là bắt buộc')
		.test('is-smaller', 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc', function (value) {
			const { end_time } = this.parent;
			return !end_time || !value || value < end_time;
		}),
	end_time: date()
		.required('Ngày kết thúc là bắt buộc')
		.test('is-greater', 'Ngày kết thúc phải lớn hơn ngày bắt đầu', function (value) {
			const { start_time } = this.parent;
			return !start_time || !value || value > start_time;
		})
});
