import { object, string, number } from "yup";

export const businessSchema = object({
    name: string().required(),
    internshipPosition: string().required(),
    majors: string().required(),
    amount: number().required().positive().integer(),
    address: string(),
    campus_id: string().required(),
    code_request: string().required(),
    request: string(),
    description: string(),
    benefish: string(),
});
