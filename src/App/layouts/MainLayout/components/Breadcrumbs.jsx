import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";
import { Link, matchPath, useLocation } from "react-router-dom";
import tw from "twin.macro";

export default function Breadcrumbs({ navigation }) {
	const { pathname } = useLocation();
	return (
		<NavBreadcrumbs>
			<List>
				<List.Item>
					<Center>
						<BreadCrumbLink to="/">
							<HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
						</BreadCrumbLink>
					</Center>
				</List.Item>
				{navigation.map((page) => {
					if (!page.children)
						return (
							!!matchPath(page.path, pathname) && (
								<List.Item key={page.name}>
									<Center>
										<ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
										<BreadCrumbLink to={page.path}>{page.name}</BreadCrumbLink>
									</Center>
								</List.Item>
							)
						);

					return page.children?.map((item) => {
						return (
							!!matchPath(item.path, pathname) && (
								<List.Item key={item.name}>
									<Center>
										<ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
										<BreadCrumbLink to={item.path}>{item.name}</BreadCrumbLink>
									</Center>
								</List.Item>
							)
						);
					});
				})}
			</List>
		</NavBreadcrumbs>
	);
}

const NavBreadcrumbs = tw.nav`flex sm:hidden`;
const List = tw.ol`flex items-center space-x-4`;
const Center = tw.div`flex items-center`;
const BreadCrumbLink = tw(Link)`ml-4 text-sm font-medium text-gray-500 hover:text-base-content duration-200`;
List.Item = (props) => <li {...props}>{props.children}</li>;
