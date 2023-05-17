import React, { useState } from "react";
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/Core/components/common/Button";
import { recordSchema } from "@/App/schemas/recordSchema";
import { useSelector } from "react-redux";
const RecordPage = () => {
	const {user} = useSelector((state) => state.auth)
	console.log(user)
	const { handleSubmit, control } = useForm({
		resolver: yupResolver(recordSchema),
	});

	const [selectedFile, setSelectedFile] = useState(null);

	const onSubmit = (data) => {
		console.log(data)
		const file = selectedFile;
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setSelectedFile(file);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			RecordPage
			<InputFieldControl name="nameCompany" control={control} label="Tên doanh nghiệp: " />
			<InputFieldControl control={control} type="file" name="form" onChange={handleFileChange} label="Upload biên bản (Image, PDF hoặc Docx):"/>
			<InputFieldControl name="date" control={control} type="date" label="Thời gian bắt đầu thực tập: "/>
			<Button variant="primary" type="submit">
				Submit
			</Button>
		</form>
	);
};

export default RecordPage;