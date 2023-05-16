import { object, string, number, array } from "yup";

export const companySchema = object({
    name: string().required("Vui lòng nhập đầy đủ tên doanh nghiệp"),
    tax_code: string().required("Vui lòng nhập đầy đủ mã số thuế"),
    internship_position: string().required("Vui lòng nhập đầy đủ vị trí thực tập"),
    major: string().required("Vui lòng chọn ngành"),
    amount: number().required("Vui lòng nhập số lượng").positive().integer(),
    address: string(),
    business_code: string().required("Vui lòng nhập đầy đủ mã doanh nghiệp"),
    requirement: string(),
    description: string(),
    benefit: string(),
})

export const companyArraySchema = array(
    object({
        name: string().required("Vui lòng nhập đầy đủ tên doanh nghiệp"),
        tax_code: string().required("Vui lòng nhập đầy đủ mã số thuế"),
        internship_position: string().required("Vui lòng nhập đầy đủ vị trí thực tập"),
        major: string().required("Vui lòng chọn ngành"),
        amount: number().required("Vui lòng nhập số lượng").positive().integer(),
        address: string(),
        business_code: string().required("Vui lòng nhập đầy đủ mã doanh nghiệp"),
        requirement: string(),
        description: string(),
        benefit: string(),
    })
)
