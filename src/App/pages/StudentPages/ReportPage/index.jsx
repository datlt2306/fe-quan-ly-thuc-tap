import { useUploadFormMutation } from '@/App/providers/apis/reportApi';
import { useGetOneStudentQuery } from '@/App/providers/apis/studentApi';
import { reportSchema } from '@/App/schemas/reportSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';

const ReportPage = () => {

   const navigate = useNavigate();

   const { user } = useSelector((state) => state.auth);
   const {data} = useGetOneStudentQuery(user?.id);

   const [selectFile, setSelectFile] = useState(null);
   const [validateFile, setValidateFile] = useState('');

   const [handleSubmitForm] = useUploadFormMutation();

   const fileInputRef = useRef(null);

   const { handleSubmit, control } = useForm({
      resolver: yupResolver(reportSchema)
   });

   const handleChange = (e) => {
      const file = e.target.files[0];
      const allowedExtensions = ['pdf', 'docx'];
      if (!file) {
         setValidateFile('Không có file được chọn');
         return;
      }
      // Get the file extension
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
         setValidateFile('File không đúng định dạng');
         return;
      } else {
         setValidateFile('');
         setSelectFile(e.target.files[0]);
      }
   };
   const onSubmit = async (value) => {
      const file = selectFile;
		const allowedExtensions = ['pdf', 'docx'];
		const fileName = file.name;
		const fileExtension = fileName.split('.').pop().toLowerCase();
		if (!allowedExtensions.includes(fileExtension)) {
			return;
		}
      const formData = new FormData();
      formData.append('file', selectFile);
      formData.append('endInternShipTime', value.endInternShipTime);
      formData.append('attitudePoint', value.attitudePoint);
      formData.append('signTheContract', value.signTheContract);
      formData.append('endInternShipTime', value.endInternShipTime);
      formData.append('_id', data.id);
      formData.append('mssv', data.mssv);
      formData.append('email', data.email);
      formData.append('nameCompany', data.nameCompany);
      formData.append('typeNumber', 4);
      const result = await handleSubmitForm(formData);
      if (result?.error) {
			toast.error("Nộp biên bản thất bại!");
			navigate('/');
			return;
		}
		toast.success("Nộp biên bản thành công");
		navigate('/');
   };
   return (
      <Container>
         <Title>Nộp biên bản</Title>
         <Form onSubmit={handleSubmit(onSubmit)}>
            <Info>
               Mã sinh viên: <Span>{data && data?.mssv}</Span>
            </Info>
            <Info>
               Họ và tên: <Span>{data && data?.name}</Span>
            </Info>
            <Info>
               Tên doanh nghiệp: <Span>{data && data?.nameCompany}</Span>
            </Info>

            <InputFieldControl label='Điểm kết quả' placeholder='Nhập điểm kết quả thực tập' control={control} name='resultScore' />

            <InputFieldControl label='Điểm thái độ' placeholder='Nhập điểm thái độ thực tập' control={control} name='attitudePoint' />

            <div className='grid grid-flow-col'>
               Đề xuất ký HĐLĐ với doanh nghiệp:
               <div className='flex items-center'>
                  <input className='mr-1' type='radio' control={control} name='signTheContract' id="a" value={0} />
                  <label for="a">Có</label>
               </div>
               <div className='flex items-center'>
                  <input className='mr-1' type='radio' control={control} name='signTheContract' id="b" value={1} />
                  <label for="b">Không</label>
               </div>
               <div className='flex items-center'>
                  <input className='mr-1' type='radio' control={control} name='signTheContract' id="c" value={2} />
                  <label for="c">Không nhận lời</label>
               </div>
            </div>
            <Info>
               Thời gian bắt đầu thực tập: <Span>{data && data?.internshipTime}</Span>
            </Info>
            <InputFieldControl label='Thời gian kết thúc thực tập' control={control} name='endInternShipTime' type='date' />
            <InputFieldControl
               ref={fileInputRef}
               label='Upload báo cáo (PDF hoặc Docx)'
               control={control}
               name='file'
               type='file'
               onChange={handleChange}
            />
            <Error>{validateFile}</Error>
            <div className='grid grid-flow-col justify-stretch gap-2'>
               <Button variant='primary' type='submit'>
                  Nộp biên bản
               </Button>
               <Button as="div" variant='success'>
                  Xem CV
               </Button>
            </div>
         </Form>
      </Container>
   );
};

const Form = tw.form`grid gap-8`;
const Title = tw.div`mb-8 text-primary text-xl font-bold`;
const Container = tw.div`container mx-auto w-[580px]`;
const Info = tw.div``;
const Error = tw.div`text-error`;
const Span = tw.span`font-bold`;

export default ReportPage;
