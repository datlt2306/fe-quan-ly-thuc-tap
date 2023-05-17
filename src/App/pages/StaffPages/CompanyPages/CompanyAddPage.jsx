import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl";
import SelectFieldControl from "@/Core/components/common/FormControl/SelectFieldControl";
import tw from "twin.macro";
import Button from "@/Core/components/common/Button";
import { companySchema } from "@/App/schemas/companySchema";
import { useAddCompanyMutation } from "@/App/providers/apis/businessApi";
import { useGetAllMajorQuery } from "@/App/providers/apis/majorApi";
import { LoadingSpinner } from "@/Core/components/common/Loading/LoadingSpinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TextAreaFieldControl from "@/Core/components/common/FormControl/TextareaFieldControl";
import { StaffPaths } from "@/Core/constants/routePaths";

const AddBusinessForm = () => {

	const navigate = useNavigate();

    // get list campus and major
    const { data: major } = useGetAllMajorQuery(null, { refetchOnMountOrArgChange: true });
    
    // handle add new company
    const { handleSubmit, control } = useForm({
        resolver: yupResolver(companySchema)
    });
    const [handleAddCompany, { isLoading }] = useAddCompanyMutation()
    const onSubmit = async (data) => {
        const result = await handleAddCompany(data);
        if (result?.error) {
            console.log(result)
            toast.error("Thêm mới thất bại")
            return;
        }
        toast.success("Thêm doanh nghiệp mới thành công!")
        navigate(StaffPaths.COMPANY_LIST)
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Title>Thêm Mới Doanh Nghiệp</Title>
            <Grid>
                <InputFieldControl
                    control={control}
                    name="name"
                    label="Tên Doanh Nghiệp"
                    placeholder="Công ty TNHH ..."
                />

                <InputFieldControl
                    control={control}
                    name="tax_code"
                    label="Mã Số Thuế"
                    placeholder="0123456789 ..."
                />

                <InputFieldControl
                    control={control}
                    name="business_code"
                    label="Mã Doanh Nghiệp"
                    placeholder="TT01 ..."
                />

                <InputFieldControl
                    control={control}
                    name="internship_position"
                    label="Vị Trí Thực Tập"
                    placeholder="Intern ..."
                />

                <InputFieldControl
                    control={control}
                    name="amount"
                    label="Số Lượng"
                    placeholder="Số ..."
                />

                <SelectFieldControl name='major' control={control} label="Ngành" options={Array.isArray(major) && major.map(item => ({ value: item._id, label: item.name }))} />

                <InputFieldControl
                    control={control}
                    name="address"
                    label="Địa Chỉ"
                    placeholder="Hà Nội ..."
                />

                <TextAreaFieldControl
                    control={control}
                    name="requirement"
                    label="Yêu Cầu"
                    placeholder="Sinh viên đi thực tập ..."
                />

                <TextAreaFieldControl
                    control={control}
                    name="description"
                    label="Mô tả"
                    placeholder="Trách nghiệm, nhiệt tình ..."
                />

                <TextAreaFieldControl
                    control={control}
                    name="benefit"
                    label="Quyền Lợi"
                    placeholder="Có cơ hội ..."
                />
            </Grid>
            <Container>
                <Button variant="primary" type="submit">{isLoading ? <LoadingSpinner /> : "Thêm mới"}</Button>
            </Container>
        </Form>
    );
};

const Form = tw.form`px-8`;
const Grid = tw.div`grid grid-cols-2 gap-6 m-0 sm:grid-cols-1`;
const Container = tw.div`self-center mt-8`;
const Title = tw.div`mb-8 text-primary text-xl font-bold`;

export default AddBusinessForm;


