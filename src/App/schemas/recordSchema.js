import { object, string, number, array } from "yup";

export const recordSchema = object({
    nameCompany: string().required("Vui lòng nhập đầy đủ tên doanh nghiệp"),
    form: string().required("Vui lòng chọn file"),
    date: string().required("Vui lòng nhập thời gian bắt đầu thực tập")
});
