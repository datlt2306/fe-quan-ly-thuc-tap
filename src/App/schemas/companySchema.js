import { object, string, number, array } from "yup";

export const companySchema = object({
    name: string().required("Vui lòng nhập đầy đủ tên doanh nghiệp").test('no-whitespace', 'Chuỗi không thể chứa toàn khoảng trắng', value => !(/^\s+$/.test(value))),
    tax_code: string().required("Vui lòng nhập đầy đủ mã số thuế").test('no-whitespace', 'Chuỗi không thể chứa toàn khoảng trắng', value => !(/^\s+$/.test(value))),
    internship_position: string().required("Vui lòng nhập đầy đủ vị trí thực tập").test('no-whitespace', 'Chuỗi không thể chứa toàn khoảng trắng', value => !(/^\s+$/.test(value))),
    major: string().required("Vui lòng chọn ngành"),
    amount: number().typeError("Vui lòng nhập số nguyên dương").required("Vui lòng nhập số lượng").positive("Vui lòng nhập số nguyên dương").integer("Vui lòng nhập số nguyên dương"),
    address: string().required("Vui lòng nhập đầy đủ địa chỉ").test('no-whitespace', 'Chuỗi không thể chứa toàn khoảng trắng', value => !(/^\s+$/.test(value))),
    business_code: string().required("Vui lòng nhập đầy đủ mã doanh nghiệp").test('no-whitespace', 'Chuỗi không thể chứa toàn khoảng trắng', value => !(/^\s+$/.test(value))),
    requirement: string(),
    description: string(),
    benefit: string(),
})

export const companyArraySchema = array(
    object({
        name: string().required("Vui lòng nhập đầy đủ tên doanh nghiệp").test('no-whitespace', 'Chuỗi không thể chứa toàn khoảng trắng', value => !(/^\s+$/.test(value))),
        tax_code: string().required("Vui lòng nhập đầy đủ mã số thuế").test('no-whitespace', 'Chuỗi không thể chứa toàn khoảng trắng', value => !(/^\s+$/.test(value))),
        internship_position: string().required("Vui lòng nhập đầy đủ vị trí thực tập").test('no-whitespace', 'Chuỗi không thể chứa toàn khoảng trắng', value => !(/^\s+$/.test(value))),
        major: string().required("Vui lòng chọn ngành"),
        amount: number().typeError("Vui lòng nhập số nguyên dương").required("Vui lòng nhập số lượng").positive("Vui lòng nhập số nguyên dương").integer("Vui lòng nhập số nguyên dương"),
        address: string().required("Vui lòng nhập đầy đủ địa chỉ").test('no-whitespace', 'Chuỗi không thể chứa toàn khoảng trắng', value => !(/^\s+$/.test(value))),
        business_code: string().required("Vui lòng nhập đầy đủ mã doanh nghiệp").test('no-whitespace', 'Chuỗi không thể chứa toàn khoảng trắng', value => !(/^\s+$/.test(value))),
        requirement: string(),
        description: string(),
        benefit: string(),
    })
)
