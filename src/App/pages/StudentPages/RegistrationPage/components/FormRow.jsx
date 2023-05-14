import tw from "twin.macro";
import { Layout } from "..";
const Note = tw.b`pr-1 text-red-500`;

const FormRow = ({ label, children, note = false }) => (
	<Layout>
		<div className="col-span-4 flex justify-end font-medium sm:justify-start">
			{note ? (
				<>
					<Note> * </Note>
					<p>{label}</p>
				</>
			) : (
				<p>{label}</p>
			)}
		</div>
		<div className="col-span-8 flex items-center gap-4">{children}</div>
	</Layout>
);
export default FormRow;
