import { object, string, number, array } from "yup";

export const recordSchema = object({
    nameCompany: string().required(),
    form: string().required(),
    date: string().required()
});
