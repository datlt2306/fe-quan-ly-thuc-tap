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
Table.Cell = ({ as: Element = 'td', children, ...props }) => <Element {...props}>{children}</Element>;
Table.Resizer = (props) => (
	<div
		{...props}
		className={classNames('table-resizer', {
			'bg-primary': props?.isResizing
		})}
	/>
);

Table.Empty = () => (
	<Table.Row>
		<Table.Cell colSpan='100%'>
			<Text className='select-none text-base text-disabled'>Không có dữ liệu</Text>
		</Table.Cell>
	</Table.Row>
);
Table.Pending = ({ prepareRows = 5, prepareCols, loading }) => {
	const preRenderCells = Array.apply(null, Array(prepareCols)).map((_, i) => i);
	const preRenderRows = Array.apply(null, Array(prepareRows)).map((_, j) => j);
	return preRenderRows.map((_, i) => (
		<Table.Row key={i}>
			{preRenderCells.map((_, j) => (
				<Table.Cell key={j}>
					<Skeleton />
				</Table.Cell>
			))}
		</Table.Row>
	));
};

export default Table;
