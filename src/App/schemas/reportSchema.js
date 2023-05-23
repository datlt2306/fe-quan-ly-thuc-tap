import { number, object, string } from 'yup';

export const reportSchema = object({
   resultScore: number().required().positive(),
   attitudePoint: number().required().positive(),
	signTheContract: number().required(),
	endInternShipTime: string().required(),
	file: string().required('Vui lòng chọn file')
});
