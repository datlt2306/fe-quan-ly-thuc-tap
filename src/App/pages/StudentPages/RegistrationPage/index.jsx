import tw from "twin.macro";
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";

import CountdownTimer from "./components/CountdownTimer";
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl";
import SelectFieldControl from "@/Core/components/common/FormControl/SelectFieldControl";
import { RegistrationType } from "./constants/RegistrationType";
import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useGetAllCompanyQuery } from "@/App/providers/apis/businessApi";
import { useGetAllMajorQuery } from "@/App/providers/apis/majorApi";
import { useUploadMutation } from "@/App/providers/apis/registerInternAPI";
import { useUploadDriveMutation } from "@/App/providers/apis/uploadDriveApi";
import { useGetSetTimeQuery } from "@/App/providers/apis/configTimesApi";
import ModalLoading from "@/Core/components/common/Loading/ModalLoading";
const FormSchoolSupport = lazy(() => import("./components/FormSchoolSupport"));
const FormSelfFinding = lazy(() => import("./components/FormSelfFinding"));

export const Layout = tw.div`grid grid-cols-12 gap-7 sm:gap-4 items-center my-4 `;

const RegistrationTypeCol = tw.div`col-span-4  flex justify-end font-medium sm:col-span-12 sm:justify-start`;

const FormSignUpCol = tw.div`col-span-8 flex items-center gap-4   sm:(col-span-12 items-start justify-start flex-col)`;

const LabelLayout = tw.label`inline-flex items-center`;
const TitleForm = tw.span`ml-2 font-medium`;

const labelItems = [
   {
      label: "Nhờ nhà trường hỗ trợ",
      value: RegistrationType.SchoolSupport,
   },
   {
      label: "Tự tìm nơi thực tập",
      value: RegistrationType.SelfFinding,
   },
];

const RegistrationPage = () => {
   const [selectedOption, setSelectedOption] = useState(null);
   const user = useSelector((state) => state.auth?.user);
   const { data: business } = useGetAllCompanyQuery();
   const { data: majors } = useGetAllMajorQuery();
   const [uploadDriveMutation, uploadDriveStatus] = useUploadDriveMutation();
   const {data:times} = useGetSetTimeQuery({
      typeNumber:1
   });
   console.log(times);

   
   const [uploadMutation, result] = useUploadMutation();
   const handleChangeForm = (value) => {
      setSelectedOption(value);
   };
   // const deadlineCheck =
   //    deadline &&
   //    deadline.endTime > new Date().getTime() &&
   //    deadline.startTime < new Date().getTime();
   const handleFormSchoolSupport = async (data) => {
      const file = data.upload;

      const isPDF = file.type === "application/pdf";
      if (!isPDF) {
         toast.error(`Vui lòng chọn file PDF`);
         return;
      }
      const formData = new FormData();
      formData.append("file", file);
      try {
         const response = await uploadDriveMutation(formData);
         console.log(response);
      } catch (error) {
         console.log(error);
      }
   };
   const handleFormSelfFinding = async (data) => {
      try {
         const response = await uploadMutation({
            ...data,
            support: selectedOption,
            semester_id: user?.smester_id._id,
            campus_id: user?.campus_id,
            mssv: user?.mssv,
            _id: user?.id,
            email: user?.email,
         });
      } catch (error) {
         console.log(error);
      }
   };
   const sharedFields = useCallback(
      (control) => {
         return [
            {
               label: "Mã sinh viên",
               content: <p>PH24952</p>,
            },
            {
               label: "Họ và tên",
               content: <p>MInh nguyễn</p>,
            },
            {
               label: "Số điện thoại",
               note: true,
               content: <InputFieldControl className="w-96 sm:w-full" control={control} name="phoneNumber" placeholder="Số điện thoại" />,
            },
            {
               label: "Địa chỉ",
               note: true,
               content: <InputFieldControl className="w-96 sm:w-full" control={control} name="address" placeholder="Địa chỉ" />,
            },
            {
               label: "Chuyên ngành",
               note: true,
               content: (
                  <SelectFieldControl
                     className="w-96 sm:w-[210.4px]"
                     initialValue="Chọn chuyên ngành"
                     control={control}
                     name="major"
                     options={Array.isArray(majors) ? majors.map((item) => ({ value: item._id, label: item.name })) : []}
                  />
               ),
            },
            {
               label: "Đơn vị thực tập",
               note: true,
               content: (
                  <SelectFieldControl
                     className="w-96 sm:w-[210.4px]"
                     initialValue="Chọn doanh nghiệp"
                     control={control}
                     name="business"
                     options={Array.isArray(business?.list) ? business.list.map((item) => ({ value: item._id, label: item.name })) : []}
                  />
               ),
            },
            {
               label: "Vị trí thực tập",
               note: true,
               content: (
                  <InputFieldControl
                     className="w-96 sm:w-full"
                     control={control}
                     name="dream"
                     placeholder="VD: Web Back-end, Dựng phim, Thiết kế nội thất"
                  />
               ),
            },
         ];
      },
      [business?.list, majors]
   );
   // const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;
   // const NOW_IN_MS = new Date().getTime();

   // const dateTimeAfterThreeDays = NOW_IN_MS + THREE_DAYS_IN_MS;

   return (
      <>
         <CountdownTimer targetDate={16842104943982} />
         <Layout>
            <RegistrationTypeCol>Kiểu đăng ký</RegistrationTypeCol>
            <FormSignUpCol>
               {labelItems.map((item, index) => (
                  <LabelLayout key={index}>
                     <input type="radio" name="radio" defaultValue={item.value} onClick={() => handleChangeForm(item.value)} />
                     <TitleForm>{item.label}</TitleForm>
                  </LabelLayout>
               ))}
            </FormSignUpCol>
         </Layout>
         <Suspense fallback={<ModalLoading />}>
            {selectedOption == RegistrationType.SchoolSupport && <FormSchoolSupport fields={sharedFields} onSubmit={handleFormSchoolSupport} />}
            {selectedOption == RegistrationType.SelfFinding && <FormSelfFinding fields={sharedFields} onSubmit={handleFormSelfFinding} />}
         </Suspense>
      </>
   );
};

export default RegistrationPage;


