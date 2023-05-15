import React, {useState} from "react";
import tw from "twin.macro";
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import Button from '@/Core/components/common/Button';
import { recordSchema } from "@/App/schemas/recordSchema";
const RecordPage = () => {

	const [selectedFile, setSelectedFile] = useState(null);

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const guardarArchivo = (files, data) => {
		const file = files; //the file
		const urlGGDriveCV = `https://script.google.com/macros/s/AKfycbzxKWUNnzXiG_VKSEXbYTeBppWHrSzFUGCX431yK5rz7va85wFOZuunkiE2EJJfBaCg/exec`;

		var reader = new FileReader(); //this for convert to Base64
		reader.readAsDataURL(file); //start conversion...
		reader.onload = function (e) {
			//.. once finished..
			var rawLog = reader.result.split(',')[1]; //extract only thee file data part
			var dataSend = {
				dataReq: { data: rawLog, name: file.name, type: file.type },
				fname: 'uploadFilesToGoogleDrive',
			}; //preapre info to send to API
			fetch(
				urlGGDriveCV, //your AppsScript URL
				{ method: 'POST', body: JSON.stringify(dataSend) }
			) //send to Api
				.then((res) => res.json())
				.then((a) => {
					const newData = { ...data, form: a.url };
					ReportFormAPI.uploadForm(newData)
						.then((res) => {
							message.success(res.data.message);
							setFile('');
							form.resetFields();
							sendMessageDevice(infoUser, 'nộp biểu mẫu thành công');
						})
						.catch((err) => {
							const dataErr = err.response.data;
							if (!dataErr.status) {
								message.error(`${dataErr.message}`);
								form.resetFields();
							} else {
								message.error(`${dataErr.message}`);
							}
						});
					setSpin(false);
				})
				.catch((e) => {
					message.success('Có lỗi xảy ra! Vui lòng đăng ký lại');
					form.resetFields();
					setSpin(false);
				}); // Or Error in console
		};
	}

	const user = useSelector((state) => state.auth?.user);

	const { handleSubmit, control } = useForm({
		resolver: yupResolver(recordSchema)
	})
	const onSubmit = (value) => {
		console.log(value);
		guardarArchivo()
	}
	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			RecordPage
			<InputFieldControl name='nameCompany' control={control} label="Tên doanh nghiệp" />
			<InputFieldControl name='internshipTime' control={control} label="Thời gian bắt đầu thực tập" />
			<label htmlFor="form">Upload biên bản (Image, PDF hoặc Docx)</label>
			<input type="file" name='form' onChange={handleFileChange} required/>
			<Button variant="primary" type="submit">Submit</Button>
		</Form>
	);
};

export default RecordPage;

const Form = tw.form``
