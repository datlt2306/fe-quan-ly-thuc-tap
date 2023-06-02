import classNames from 'classnames';
import { Skeleton } from '../../customs/Skelton';
import Text from '../Text/Text';

const Table = ({ children, ...props }) => (
	<table {...props} className='table w-full'>
		{children}
	</table>
);

Table.Header = ({ sticky, children, ...props }) => (
	<thead
		{...props}
		className={classNames({
			'sticky top-0 z-20 bg-inherit': sticky
		})}>
		{children}
	</thead>
);
Table.Body = (props) => <tbody {...props}>{props.children}</tbody>;
Table.Row = (props) => <tr {...props}>{props.children}</tr>;
Table.Footer = (props) => <tfoot {...props}>{props.children}</tfoot>;
Table.Cell = ({ as: Element = 'td', children, ...props }) => {
	return <Element {...props}>{children}</Element>;
};
Table.Empty = () => (
	<Table.Row>
		<Table.Cell colSpan='100%' className=''>
			<Text className='select-none text-base text-disabled'>Không có dữ liệu</Text>
		</Table.Cell>
	</Table.Row>
);
Table.Pending = ({ numOfCols }) => {
	const preRenderCells = Array.apply(null, Array(numOfCols)).map((x, i) => i);
	const preRenderRows = Array.apply(null, Array(5)).map((x, j) => j);
	return preRenderRows.map((_row, i) => (
		<Table.Row key={i}>
			{preRenderCells.map((_cell, j) => (
				<Table.Cell key={j}>
					<Skeleton />
				</Table.Cell>
			))}
		</Table.Row>
	));
};

export default Table;
