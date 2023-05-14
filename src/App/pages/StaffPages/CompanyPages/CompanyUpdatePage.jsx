import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import SelectFieldControl from '@/Core/components/common/FormControl/SelectFieldControl';
import tw from "twin.macro";
import Button from '@/Core/components/common/Button';
import { companySchema } from '@/App/schemas/companySchema';
import { useGetOneCompanyQuery, useUpdateCompanyMutation } from '@/App/providers/apis/businessApi';
import { useGetAllMajorQuery } from '@/App/providers/apis/majorApi';
import {LoadingSpinner} from '@/Core/components/common/Loading/LoadingSpinner';
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";

const UpdateBusinessForm = () => {
    const navigate = useNavigate();

    // get id and get default company
    const { id } = useParams();
    const { data: company } = useGetOneCompanyQuery({ id }, {refetchOnMountOrArgChange: true})
    
    // check id
    if(company?.statusCode) {
        toast.error("Doanh nghiệp không tồn tại!")
        navigate('/danh-sach-cong-ty')
    }

    // get list campus and major
    // const { campusList } = useSelector((state) => state.campus)
    const { data: major } = useGetAllMajorQuery();

    const { handleSubmit, control, reset } = useForm({
        resolver: yupResolver(companySchema),
        defaultValues: company
    });
    useEffect(() => {
        if (company) {
            reset(company);
        }
    }, [company, reset]);

    // handle update company
    const [handleUpdateCompany, { isLoading }] = useUpdateCompanyMutation()
    const onHandleUpdate = async (data) => {
        const result = await handleUpdateCompany({ data, id });
        if (result?.data?.statusCode) {
            toast.error(result.data.message)
            return;
        }
        toast.success("Cập nhật doanh nghiệp mới thành công!")
        navigate('/danh-sach-cong-ty')
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
                    name="code_request"
                    label="Mã Doanh Nghiệp"
                />

                <InputFieldControl
                    control={control}
                    name="internshipPosition"
                    label="Vị Trí Thực Tập"
                />

                <InputFieldControl
                    control={control}
                    name="amount"
                    label="Số Lượng"
                />

                {/* <SelectFieldControl name='campus_id' control={control} label="Cơ sở" options={Array.isArray(campusList?.listCumpus) && campusList?.listCumpus.map(item => ({ value: item._id, label: item.name }))} /> */}

                <SelectFieldControl name='majors' control={control} label="Ngành" options={Array.isArray(major) && major.map(item => ({ value: item._id, label: item.name }))} />


                <InputFieldControl
                    control={control}
                    name="address"
                    label="Địa Chỉ"
                />

                <InputFieldControl
                    control={control}
                    name="request"
                    label="Yêu Cầu"
                />

                <InputFieldControl
                    control={control}
                    name="description"
                    label="Chi Tiết"
                />

                <InputFieldControl
                    control={control}
                    name="benefish"
                    label="Quyền Lợi"
                />
            </Grid>
            <Container>
                <Button variant="primary" type="submit">{isLoading ? <LoadingSpinner /> : "Submit"}</Button>
            </Container>
        </Form>
    );
};

export default UpdateBusinessForm;

const Form = tw.form`px-8`;
const Grid = tw.div`grid grid-cols-2 gap-6 m-0`;
const Container = tw.div`self-center mt-8`;
const Title = tw.div`mb-8 text-primary text-xl font-bold`;