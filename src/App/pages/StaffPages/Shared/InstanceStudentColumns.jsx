import { StudentColumnAccessors, StudentStatusGroupEnum } from '@/App/constants/studentConstants';
import Badge from '@/Core/components/common/Badge';
import Button from '@/Core/components/common/Button';
import { InputColumnFilter, SelectColumnFilter } from '@/Core/components/common/Table/components/ReactTableFilters';
import IndeterminateCheckbox from '@/Core/components/common/Table/components/RowSelectionCheckbox';
import { EyeIcon } from '@heroicons/react/24/outline';
import tw from 'twin.macro';

const List = tw.ul`flex flex-col gap-1`;
List.Item = ({ ...props }) => <li {...props}>{props.children}</li>;

const handleGetInternStatusStyle = (value) => {
	const style = Object.keys(StudentStatusGroupEnum).find((k) => StudentStatusGroupEnum[k].includes(value));
	return style;
};

const InstanceStudentColumns = [
	{
		Header: ({ getToggleAllRowsSelectedProps }) => <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />,
		accessor: '_id',
		sticky: 'left',
		Cell: ({ row }) => {
			return <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />;
		},
		maxWidth: 60,
		minWidth: 60
	},
	{
		Header: StudentColumnAccessors.index,
		accessor: 'index',
		sortable: true,
		sticky: 'left',
		maxWidth: 96,
		minWidth: 96
	},
	{
		Header: StudentColumnAccessors.name,
		accessor: 'name',
		Filter: InputColumnFilter,
		filter: 'fullTextSearch',
		sortType: 'fullTextSort',
		filterable: true,
		sortable: true,
		minWidth: 192,
		sticky: 'left'
	},
	{
		Header: StudentColumnAccessors.mssv,
		accessor: 'mssv', // object key
		Filter: InputColumnFilter,
		filterable: true,
		sortable: true,
		sticky: 'left',
		minWidth: 128,
		Cell: ({ value }) => <span className='font-semibold uppercase'>{value}</span>
	},
	{
		Header: StudentColumnAccessors.majorCode,
		accessor: 'majorCode',
		Filter: SelectColumnFilter,
		filterable: true,
		sortable: true
	},
	{
		Header: StudentColumnAccessors.phoneNumber,
		accessor: 'phoneNumber',
		Filter: InputColumnFilter,
		filterable: true
	},
	{
		Header: StudentColumnAccessors.email,
		accessor: 'email',
		Filter: InputColumnFilter,
		filterable: true,
		minWidth: 224
	},
	{
		Header: StudentColumnAccessors.support,
		accessor: 'support',
		Filter: SelectColumnFilter,
		filterable: true
	},
	{
		Header: StudentColumnAccessors.statusCheck,
		accessor: 'statusCheck',
		Filter: SelectColumnFilter,

		filterable: true,
		Cell: ({ value }) => <Badge variant={handleGetInternStatusStyle(value)}>{value}</Badge>
	},
	{
		Header: 'Công ty thực tập',
		accessor: 'nameCompany',
		id: 'company',
		Filter: InputColumnFilter,

		filterable: true,
		Aggregated: ({ value }) => value,
		Cell: ({ row }) => {
			const { original: student } = row;
			return (
				student.nameCompany && (
					<List>
						<List.Item>
							<strong>{student?.nameCompany}</strong>
						</List.Item>
						<List.Item>
							<i>Mã số thuế: </i>
							{student?.taxCode}
						</List.Item>
					</List>
				)
			);
		}
	},
	{
		Header: StudentColumnAccessors.dream,
		accessor: 'dream',

		Filter: InputColumnFilter,
		filterable: true
	},
	{
		Header: StudentColumnAccessors.CV,
		accessor: 'CV',
		Filter: InputColumnFilter,
		filterable: false,
		sortable: false,
		Cell: ({ value }) =>
			value && (
				<Button
					as='a'
					href={value}
					target='_blank'
					variant={value ? 'ghost' : 'disabled'}
					shape='pill'
					size='xs'
					disabled={!!value}>
					<EyeIcon tw='h-4 w-4' /> Preview
				</Button>
			)
	},
	{
		Header: StudentColumnAccessors.form,
		accessor: 'form',
		Cell: ({ value }) =>
			value && (
				<Button
					as='a'
					href={value}
					target='_blank'
					variant={value ? 'ghost' : 'disabled'}
					shape='pill'
					size='xs'
					disabled={!!value}>
					<EyeIcon tw='h-4 w-4' /> Preview
				</Button>
			)
	},
	{
		Header: StudentColumnAccessors.report,
		accessor: 'report',
		Cell: ({ value }) =>
			value && (
				<Button
					as='a'
					href={value}
					target='_blank'
					variant={value ? 'ghost' : 'disabled'}
					shape='pill'
					size='xs'
					disabled={!!value}>
					<EyeIcon tw='h-4 w-4' /> Preview
				</Button>
			)
	},
	{
		Header: StudentColumnAccessors.reviewer,
		accessor: 'reviewer',
		Filter: InputColumnFilter,
		filterable: true
	},
	{
		Header: StudentColumnAccessors.statusStudent,
		accessor: 'statusStudent',
		Filter: SelectColumnFilter,
		filterable: true,
		Cell: ({ value }) => <span className='font-semibold'>{value}</span>
	},
	{
		Header: StudentColumnAccessors.createdAt,
		accessor: 'createdAt',
		Filter: InputColumnFilter,
		filterable: true
	},
	{
		Header: StudentColumnAccessors.note,
		accessor: 'note',
		filterable: false
	}
];

export default InstanceStudentColumns;
