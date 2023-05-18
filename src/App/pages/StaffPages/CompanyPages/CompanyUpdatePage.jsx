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
            <Flex>
                <FlexLetf>
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
                    <Desktop>
                        <Button variant="primary" type="submit" disabled={isLoading}>{isLoading && <LoadingSpinner size="sm" variant="primary" />} Cập nhật</Button>
                    </Desktop>
                </FlexLetf>
                <FlexRight>
                    <TextareaFieldControl
                        control={control}
                        name="requirement"
                        label="Yêu Cầu"
                        placeholder="Sinh viên đi thực tập ..."
                    />

                    <TextareaFieldControl
                        control={control}
                        name="description"
                        label="Mô tả"
                        placeholder="Trách nghiệm, nhiệt tình ..."
                    />

                    <TextareaFieldControl
                        control={control}
                        name="benefit"
                        label="Quyền Lợi"
                        placeholder="Có cơ hội ..."
                    />
                </FlexRight>
            </Flex>
            <Mobile>
                <Button variant="primary" type="submit" disabled={isLoading}>{isLoading && <LoadingSpinner size="sm" variant="primary" />} Cập nhật</Button>
            </Mobile>
        </Form>
    );
};

const Form = tw.form`px-8`;
const Flex = tw.div`flex flex-row sm:grid resize-none`
const FlexLetf = tw.div`grid grid-cols-1 gap-4 grow m-4 h-[600px] lg:sticky top-[100px]`;
const FlexRight = tw.div`grid grid-cols-1 gap-4 grow m-4`;
const Desktop = tw.div`self-center mt-4 sm:hidden`;
const Mobile = tw.div`self-center mt-4 hidden sm:block`
const Title = tw.div`mb-8 text-primary text-xl font-bold`;

export default UpdateBusinessForm;
