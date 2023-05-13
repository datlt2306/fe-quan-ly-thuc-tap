import * as yup from "yup";

export const formSignUpSchoolSupportSchema = yup.object().shape({
	address: yup.string().required("Địa chỉ không được để trống"),
	business: yup.string().required("Vui lòng chọn doanh nghiệp"),
	dream: yup.string().required("Vui lòng nhập vị trí thực tập"),
	narrow: yup.string().required('Vui lòng chọn chuyên ngành'),
	phone: yup.string().matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/,"Số điện thoại không hợp lệ"
   ).required("Vui lòng nhập  số điện thoại"),
   upload: yup.mixed().required('File không được để trống').test('fileFormat', 'Chỉ hỗ trợ định dạng PNG', (value) => {
      return value && value.includes("png");
    }),
});   
export const formSignUpSelfFindingSchema = yup.object().shape({
	address: yup.string().required("Địa chỉ không được để trống"),
	business: yup.string().required("Vui lòng chọn doanh nghiệp"),
	dream: yup.string().required("Vui lòng nhập vị trí thực tập"),
	narrow: yup.string().required('Vui lòng chọn chuyên ngành'),
	phone: yup.string().required("Vui lòng nhập đúng số điện thoại"),
});
