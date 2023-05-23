import tw from 'twin.macro';

<<<<<<< HEAD
const WrapLayout = tw.div`flex flex-row sm:grid resize-none`;
const Layout = tw.div`grid grid-cols-2  gap-6 grow m-4 sm:(grid-cols-1 gap-4) `;
=======
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec
const FormRow = ({ children, ...props }) => (
	<WrapLayout>
		<Layout {...props}>{children}</Layout>
	</WrapLayout>
);
<<<<<<< HEAD
=======

const WrapLayout = tw.div`flex flex-row sm:grid resize-none`;
const Layout = tw.div`grid grid-cols-2  gap-6 grow m-4 sm:(grid-cols-1 gap-4) `;

>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec
export default FormRow;
