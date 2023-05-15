import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import tw from "twin.macro";

const Table = ({ children, ...props }) => (
	<table {...props} className="table w-full">
		{children}
	</table>
);
const Header = ({ sticky, children, ...props }) => (
	<thead
		{...props}
		className={classNames({
			"sticky top-0 z-20 bg-inherit": sticky,
		})}>
		{children}
	</thead>
);
const Body = (props) => <tbody {...props}>{props.children}</tbody>;
const Footer = (props) => <tfoot {...props}>{props.children}</tfoot>;
const Row = (props) => <tr {...props}>{props.children}</tr>;
const Cell = ({ as: Element = "td", children, ...props }) => {
	return <Element {...props}>{children}</Element>;
};

const Empty = () => (
	<tr>
		<td align="center" colSpan="70%" className="select-none py-6 text-center">
			<div className="flex items-center gap-3 text-disabled">
				<ArchiveBoxXMarkIcon className="h-10 w-10 text-center" />
				Không có dữ liệu
			</div>
		</td>
	</tr>
);
Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;
Table.Cell = Cell;
Table.Empty = Empty;
export default Table;
