import { object, string, number, array } from "yup";

export const recordSchema = object({
    nameCompany: string().required(),
    internshipTime: string().required(),
    form: string()
});
