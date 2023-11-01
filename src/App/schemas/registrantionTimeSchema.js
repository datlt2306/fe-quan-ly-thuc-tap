import { date, object } from 'yup';

export const registrantionTimeSchema = object({
	startTime: date()
		.required()
		.test('is-smaller', 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc', function (value) {
			const { endTime } = this.parent;
			return !endTime || !value || value < endTime;
		}),
	endTime: date()
		.required()
		.test('is-greater', 'Ngày kết thúc phải lớn hơn ngày bắt đầu', function (value) {
			const { startTime } = this.parent;
			return !startTime || !value || value > startTime;
		})
});
