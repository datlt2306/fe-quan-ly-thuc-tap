import { date, object, string } from 'yup';

export const semesterDataValidator = object({
	name: string().trim().required('Tên kì học là bắt buộc'),
	startTime: date()
		.required('Ngày bắt đầu là bắt buộc')
		.test('is-smaller', 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc', function (value) {
			const { endTime } = this.parent;
			return !endTime || !value || value < endTime;
		}),
	endTime: date()
		.required('Ngày kết thúc là bắt buộc')
		.test('is-greater', 'Ngày kết thúc phải lớn hơn ngày bắt đầu', function (value) {
			const { startTime } = this.parent;
			return !startTime || !value || value > startTime;
		})
});
