import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/Core/components/common/FormControl/InputFieldControl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import SelectFieldControl from '@/Core/components/common/FormControl/SelectFieldControl';
import tw from "twin.macro";
import Button from '@/Core/components/common/Button';
import { useGetAllCampusQuery } from '@/App/providers/apis/campusApi';
import axiosClient from '@/Core/configs/axiosConfig';
import { businessSchema } from '@/App/schemas/businessSchema';

const Form = tw.form``;
const Grid = tw.div`grid grid-cols-2 gap-4 m-0`;
const Container = tw.div`self-center`;

const AddBusinessForm = () => {
    const { data: campus } = useGetAllCampusQuery();
    const { handleSubmit, control } = useForm({
        resolver: yupResolver(businessSchema)
    });
    const onSubmit = async (data) => { console.log(data) }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Grid>
                <InputFieldControl
                    control={control}
                    name="name"
                    label="Tên Doanh Nghiệp:"
                />

                <InputFieldControl
                    control={control}
                    name="code_request"
                    label="Mã Doanh Nghiệp:"
                />

                <InputFieldControl
                    control={control}
                    name="internshipPosition"
                    label="Vị Trí Thực Tập:"
                />

                <InputFieldControl
                    control={control}
                    name="majors"
                    label="Ngành:"
                />

                <InputFieldControl
                    control={control}
                    name="amount"
                    label="Số Lượng:"
                />

                <InputFieldControl
                    control={control}
                    name="address"
                    label="Địa Chỉ:"
                />

                <SelectFieldControl name='campus_id' control={control} label="Cơ sở:" options={campus?.listCumpus} />

                <SelectFieldControl name='semester_id' control={control} label="Học Kỳ:" />

                <InputFieldControl
                    control={control}
                    name="request"
                    label="Yêu Cầu:"
                />

                <InputFieldControl
                    control={control}
                    name="description"
                    label="Chi Tiết:"
                />

                <InputFieldControl
                    control={control}
                    name="benefish"
                    label="Quyền Lợi:"
                />
            </Grid>
            <Container>
                <Button variant="primary" type="submit">Submit</Button>
            </Container>
        </Form>
    );
};

export default AddBusinessForm;