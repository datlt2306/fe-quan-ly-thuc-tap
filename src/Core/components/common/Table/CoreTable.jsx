import classNames from 'classnames';
import { LoadingSpinner } from '../Loading/LoadingSpinner';

const Table = ({ children, ...props }) => (
	<table {...props} className='table w-full'>
		{children}
	</table>
);
const Header = ({ sticky, children, ...props }) => (
	<thead
		{...props}
		className={classNames({
			'sticky top-0 z-20 bg-inherit': sticky
		})}>
		{children}
	</thead>
);
const Body = (props) => <tbody {...props}>{props.children}</tbody>;
const Footer = (props) => <tfoot {...props}>{props.children}</tfoot>;
const Row = (props) => <tr {...props}>{props.children}</tr>;
const Cell = ({ as: Element = 'td', children, ...props }) => {
	return <Element {...props}>{children}</Element>;
};

const Empty = () => (
	<Table.Row>
		<Cell colSpan='100%'>
			<span className='select-none text-lg text-disabled'>Không có dữ liệu</span>
		</Cell>
	</Table.Row>
);

const PendingRow = () => (
	<Table.Row>
		<Table.Cell className='flex items-center gap-2 text-center text-lg text-disabled'>
			<LoadingSpinner size='sm' variant='primary' /> Đang tải dữ liệu
		</Table.Cell>
	</Table.Row>
);

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;
Table.Cell = Cell;
Table.Empty = Empty;
Table.Pending = PendingRow;

export default Table;
