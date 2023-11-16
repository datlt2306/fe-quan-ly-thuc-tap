import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import tw from 'twin.macro';

// Styled components
export const Wrapper = tw.div`flex flex-col items-stretch bg-white isolate max-h-[75vh]`;
export const Header = tw.div`flex items-center justify-between bg-gray-50 p-4 z-0 `;

export const Body = ({ isEmpty, loading, ...props }) => (
	<div
		{...props}
		className={classNames('min-h-[3rem]', {
			'scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-200': !isEmpty,
			'scrollbar-none': isEmpty,
			'overflow-x-auto': !loading,
			'overflow-hidden': loading
		})}>
		{props.children}
	</div>
);
Body.Empty = () => (
	<div className='flex select-none items-center justify-center gap-3 p-6 text-sm text-disabled'>
		<ArchiveBoxXMarkIcon className='h-6 w-6' />
		Không có dữ liệu
	</div>
);
export const HeaderCell = tw.div`flex justify-between h-12 items-center gap-3`;
HeaderCell.Actions = tw.div`flex items-center gap-px`;

export const Footer = tw.div`flex w-full items-stretch bg-gray-50 p-3 divide-x divide-gray-300 [&>:first-child]:!pl-0 [&>:last-child]:!pr-0`;
Footer.Item = tw.div`px-6`;
