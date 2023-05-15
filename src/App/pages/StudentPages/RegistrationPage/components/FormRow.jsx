import tw from "twin.macro";
import { Layout } from "..";
const Note = tw.b`pr-1 text-red-500`;
const Col_4 = tw.div`col-span-4 flex justify-end font-medium sm:justify-start`;
const Col_8 = tw.div`col-span-8 flex items-center gap-4`;
const FormRow = ({ label, children, note = false }) => (
	<Layout>
		<Col_4>
			{note ? (
				<>
					<Note> * </Note>
					<p>{label}</p>
				</>
			) : (
				<p>{label}</p>
			)}
		</Col_4>
		<Col_8>{children}</Col_8>
	</Layout>
);
export default FormRow;
