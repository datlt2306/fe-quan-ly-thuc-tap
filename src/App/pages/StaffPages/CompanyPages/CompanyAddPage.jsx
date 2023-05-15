import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import SelectFieldControl from '@/Core/components/common/FormControl/SelectFieldControl';
import tw from "twin.macro";
import Button from '@/Core/components/common/Button';
import { companySchema } from '@/App/schemas/companySchema';
import { useAddCompanyMutation } from '@/App/providers/apis/businessApi';
import { useGetAllMajorQuery } from '@/App/providers/apis/majorApi';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
        if (result?.data?.statusCode) {
            toast.error(result.data.message)
            return;
        }
        toast.success("Thêm doanh nghiệp mới thành công!")
        navigate('/danh-sach-cong-ty')
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Title>Thêm Mới Doanh Nghiệp</Title>
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

                <SelectFieldControl name='major' control={control} label="Ngành" options={Array.isArray(major) && major.map(item => ({ value: item._id, label: item.name }))} />

                <InputFieldControl
                    control={control}
                    name="address"
                    label="Địa Chỉ"
                />

                <InputFieldControl

                    control={control}
                    name="requirement"
                    label="Yêu Cầu"
                />

                <InputFieldControl
                    control={control}
                    name="description"
                    label="Chi Tiết"
                />

                <InputFieldControl
                    control={control}
                    name="benefit"
                    label="Quyền Lợi"
                />
            </Grid>
            <Container>
                <Button variant="primary" type="submit">{isLoading ? <LoadingSpinner /> : "Thêm mới"}</Button>
            </Container>
        </Form>
    );
};

export default AddBusinessForm;

const Form = tw.form`px-8`;
const Grid = tw.div`grid grid-cols-2 gap-6 m-0`;
const Container = tw.div`self-center mt-8`;
const Title = tw.div`mb-8 text-primary text-xl font-bold`;
