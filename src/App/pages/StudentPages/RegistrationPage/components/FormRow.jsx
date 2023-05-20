import tw from "twin.macro";

const WrapLayout = tw.div`flex flex-row sm:grid resize-none`;
const Layout = tw.div`grid grid-cols-2  gap-6 grow m-4 sm:(grid-cols-1 gap-4) `;
const FormRow = ({ children, ...props }) => (
	<WrapLayout>
		<Layout {...props}>{children}</Layout>
	</WrapLayout>
);
export default FormRow;
