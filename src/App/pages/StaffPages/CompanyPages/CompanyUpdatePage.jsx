import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl";
import SelectFieldControl from "@/Core/components/common/FormControl/SelectFieldControl";
import tw from "twin.macro";
import Button from '@/Core/components/common/Button';
import { companySchema } from '@/App/schemas/companySchema';
import { useGetOneCompanyQuery, useUpdateCompanyMutation } from '@/App/providers/apis/businessApi';
import { useGetAllMajorQuery } from '@/App/providers/apis/majorApi';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import TextareaFieldControl from "@/Core/components/common/FormControl/TextareaFieldControl";
import { StaffPaths } from "@/Core/constants/routePaths";

const UpdateBusinessForm = () => {

    const navigate = useNavigate();

    // get id and get default company
    const { id } = useParams();
    const { data: company } = useGetOneCompanyQuery({ id }, { refetchOnMountOrArgChange: true })

    // get major
    const { data: major } = useGetAllMajorQuery();

    // set default value and form control
    const { handleSubmit, control, reset } = useForm({
        resolver: yupResolver(companySchema),
    });
    useEffect(() => {
        if (company) {
            reset({
                name: company.name,
                internship_position: company.internship_position,
                major: company.major,
                amount: company.amount,
                address: company.address,
                tax_code: company.tax_code,
                business_code: company.business_code,
                requirement: company.requirement,
                description: company.description,
                benefit: company.benefit
            });
        }
    }, [company, reset]);

    // handle update company
    const [handleUpdateCompany, { isLoading }] = useUpdateCompanyMutation()
    const onHandleUpdate = async (data) => {
        const result = await handleUpdateCompany({ data, id });
        if (result?.error) {
            toast.error("Cập nhật thất bại")
            return;
        }
        toast.success("Cập nhật doanh nghiệp mới thành công!")
        navigate(StaffPaths.COMPANY_LIST)
    }
    return (
        <Form onSubmit={handleSubmit(onHandleUpdate)}>
            <Title>Cập Nhật Doanh Nghiệp</Title>
            <Grid>
                <InputFieldControl
                    control={control}
                    name="name"
                    label="Tên Doanh Nghiệp"
                />

                <InputFieldControl
                    control={control}
                    name="tax_code"
                    label="Mã Số Thuế"
                />

                <InputFieldControl
                    control={control}
                    name="business_code"
                    label="Mã Doanh Nghiệp"
                />

                <InputFieldControl
                    control={control}
                    name="internship_position"
                    label="Vị Trí Thực Tập"
                />

                <InputFieldControl
                    control={control}
                    name="amount"
                    label="Số Lượng"
                />

                <SelectFieldControl defaultValue={company?.major} name='major' control={control} label="Ngành" options={Array.isArray(major) && major.map(item => ({ value: item._id, label: item.name }))} />

                <InputFieldControl control={control} name="address" label="Địa Chỉ" />

                <TextareaFieldControl
                    control={control}
                    name="requirement"
                    label="Yêu Cầu"
                />

                <TextareaFieldControl
                    control={control}
                    name="description"
                    label="Chi Tiết"
                />

                <TextareaFieldControl
                    control={control}
                    name="benefit"
                    label="Quyền Lợi"
                />
            </Grid>
            <Container>
                <Button variant="primary" type="submit">{isLoading ? <LoadingSpinner /> : "Cập nhật"}</Button>
            </Container>
        </Form>
    );
};

const Form = tw.form`px-8`;
const Grid = tw.div`grid grid-cols-2 gap-6 m-0 sm:grid-cols-1`;
const Container = tw.div`self-center mt-8`;
const Title = tw.div`mb-8 text-primary text-xl font-bold`;

export default UpdateBusinessForm;
