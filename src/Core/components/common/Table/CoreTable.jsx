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
			"[&>*]:(sticky top-0)": sticky,
		})}>
		{children}
	</thead>
);
const Body = ({ children, ...props }) => <tbody {...props}>{children}</tbody>;
const Footer = ({ children, ...props }) => <tfoot {...props}>{children}</tfoot>;
const Row = ({ children, ...props }) => <tr {...props}>{children}</tr>;

/**
 *
 * @param {{div:'div'}} Element
 * @returns
 */
const Cell = ({ as: Element = "td", children, ...props }) => {
	return <Element {...props}>{children}</Element>;
};

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;
Table.Cell = Cell;

export default Table;
