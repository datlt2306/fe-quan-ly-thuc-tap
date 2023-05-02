import { Link } from "react-router-dom";
import tw from "twin.macro";

const Container = tw.div`h-screen w-full flex items-center justify-center`;
const Center = tw.div`max-w-6xl mx-auto w-full text-center`;

export default function NotFoundPage() {
	return (
		<Container>
			<Center>
				<p className="text-lg font-semibold text-primary">404</p>
				<h1 className="mt-4 text-6xl font-bold tracking-tight text-gray-600 sm:text-5xl">Page not found</h1>
				<p className="mt-6 text-base leading-7 text-gray-600">Trang bạn yêu cầu không tìm thấy.</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<Link to={-1} className="btn btn-primary btn-lg">
						Quay lại
					</Link>
				</div>
			</Center>
		</Container>
	);
}
