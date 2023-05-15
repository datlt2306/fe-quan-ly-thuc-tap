import { object, string, number, array } from "yup";

export const companySchema = object({
    name: string().required(),
    internshipPosition: string().required(),
    majors: string().required(),
    amount: number().required().positive().integer(),
    address: string(),
    code_request: string(),
    request: string(),
    description: string(),
    benefish: string(),
});

export const companyImportExcelSchema = array(
    object({
        name: string().required(),
        internshipPosition: string().required(),
        majors: string().required(),
        amount: number().required().positive().integer(),
        address: string(),
        code_request: string().required(),
        request: string(),
        description: string(),
        benefish: string(),
    })
)