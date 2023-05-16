import { object, string, number, array } from "yup";

export const companySchema = object({
    name: string().required("Vui lòng nhập đầy đủ tên doanh nghiệp"),
    tax_code: string().required("Vui lòng nhập đầy đủ mã số thuế"),
    internship_position: string().required("Vui lòng nhập đầy đủ vị trí thực tập"),
    major: string().required("Vui lòng chọn ngành"),
    amount: number().typeError("Vui lòng nhập số nguyên dương").required("Vui lòng nhập số lượng").positive("Vui lòng nhập số nguyên dương").integer("Vui lòng nhập số nguyên dương"),
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
        amount: number().typeError("Vui lòng nhập số nguyên dương").required("Vui lòng nhập số lượng").positive("Vui lòng nhập số nguyên dương").integer("Vui lòng nhập số nguyên dương"),
        address: string(),
        business_code: string().required("Vui lòng nhập đầy đủ mã doanh nghiệp"),
        requirement: string(),
        description: string(),
        benefit: string(),
    })
)
