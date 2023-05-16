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
		
	}

	const user = useSelector((state) => state.auth?.user);

	const { handleSubmit, control } = useForm({
		resolver: yupResolver(recordSchema)
	})
	const onSubmit = (value) => {
		console.log(value);
		guardarArchivo(selectedFile)
	}
	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			RecordPage
			<InputFieldControl name='nameCompany' control={control} label="Tên doanh nghiệp" />
			<InputFieldControl type="date" name='internshipTime' control={control} label="Thời gian bắt đầu thực tập" />
			<label htmlFor="form">Upload biên bản (Image, PDF hoặc Docx)</label>
			<InputFieldCoxntrol control={control} type="file" name='form' onChange={handleFileChange}/>
			<Button variant="primary" type="submit">Submit</Button>
		</Form>
	);
};

export default RecordPage;

const Form = tw.form``
