import { date, object } from 'yup';

export const registrantionTimeSchema = object({
	startTime: date().required(),
	endTime: date().required()
});
