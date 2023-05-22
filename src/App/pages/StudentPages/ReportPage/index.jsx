import { useUploadFormMutation } from '@/App/providers/apis/reportApi';
import { recordSchema } from '@/App/schemas/recordSchema';
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

   const [selectFile, setSelectFile] = useState(null);
   const [validateFile, setValidateFile] = useState('');

   const [handleSubmitForm] = useUploadFormMutation();

   const fileInputRef = useRef(null);

   const { handleSubmit, control } = useForm({
      resolver: yupResolver(recordSchema)
   });

   const handleChange = (e) => {
      const file = e.target.files[0];
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx'];
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
      const formData = new FormData();
      formData.append('file', selectFile);
      formData.append('nameCompany', value.nameCompany);
      formData.append('internshipTime', value.date);
      formData.append('mssv', user.mssv);
      formData.append('email', user.email);
      formData.append('_id', user.id);
      formData.append('typeNumber', 0);
      console.log(formData)
      const result = await handleSubmitForm(formData);
      console.log(result);
      // navigate('/');
   };
   return (
      <Container>
         <Title>Nộp biên bản</Title>
         <Form onSubmit={handleSubmit(onSubmit)}>
            <Info>
               Mã sinh viên: <Span>{user && user?.mssv}</Span>
            </Info>
            <Info>
               Họ và tên: <Span>{user && user?.displayName}</Span>
            </Info>
            <Info>
               Tên doanh nghiệp: <Span>{user && user?.displayName}</Span>
            </Info>
            <InputFieldControl label='Điểm kết quả' placeholder='Nhập điểm kết quả thực tập' control={control} name='nameCompany' />
            <InputFieldControl label='Điểm thái độ' placeholder='Nhập điểm thái độ thực tập' control={control} name='nameCompany' />

            <div className='grid grid-flow-col'>
               Đề xuất ký HĐLĐ với doanh nghiệp:
               <div className='flex items-center'>
                  <input className='mr-1' type='radio' control={control} name='hh' id="a" />
                  <label for="a">Có</label>
               </div>
               <div className='flex items-center'>
                  <input className='mr-1' type='radio' control={control} name='hh' id="b" />
                  <label for="b">Không</label>
               </div>
               <div className='flex items-center'>
                  <input className='mr-1' type='radio' control={control} name='hh' id="c" />
                  <label for="c">Không nhận lời</label>
               </div>
            </div>
            <Info>
               Thời gian bắt đầu thực tập: <Span>{user && user?.displayName}</Span>
            </Info>
            <InputFieldControl label='Thời gian kết thúc thực tập' control={control} name='date' type='date' />
            <InputFieldControl
               ref={fileInputRef}
               label='Upload báo cáo (PDF hoặc Docx)'
               control={control}
               name='form'
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
