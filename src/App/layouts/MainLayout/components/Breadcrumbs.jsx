import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";
import { Link, useLocation } from "react-router-dom";

const pages = [
	{ name: "Projects", href: "#", current: false },
	{ name: "Project Nero", href: "#", current: true },
];

export default function Breadcrumbs({ navigation }) {
	const { pathname } = useLocation();
	return (
		<nav className="flex sm:hidden" aria-label="Breadcrumb">
			<ol role="list" className="flex items-center space-x-4">
				<li>
					<div>
						<Link to="/" className="text-gray-400 hover:text-gray-500">
							<HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
							<span className="sr-only">Home</span>
						</Link>
					</div>
				</li>
				{navigation.map((page) => {
					return (
						pathname === page.path && (
							<li key={page.label}>
								<div className="flex items-center">
									<ChevronRightIcon
										className="h-5 w-5 flex-shrink-0 text-gray-400"
										aria-hidden="true"
									/>
									<Link
										to={page.path}
										className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
										aria-current={pathname === page.path ? "page" : undefined}>
										{page.label}
									</Link>
								</div>
							</li>
						)
					);
				})}
			</ol>
		</nav>
	);
}
