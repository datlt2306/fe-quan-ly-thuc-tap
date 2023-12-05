import React from 'react';
import tw from 'twin.macro';
import { Input } from '../common/FormControl/InputFieldControl';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

/**
 * @typedef TBrowserMockupProps
 * @prop {string} url
 */

/**
 * @type {React.FC<TBrowserMockupProps & React.PropsWithChildren>}
 */
const BrowserMockup = (props) => {
	return (
		<Browser>
			<Browser.Toolbar>
				<Browser.Actions>
					<div />
					<div />
					<div />
				</Browser.Actions>
				<Browser.Search>
					<MagnifyingGlassIcon tw='h-3 w-3 absolute top-1/2 -translate-y-1/2 left-2 z-0' />
					<div className='pointer-events-none select-none text-ellipsis whitespace-nowrap rounded-md border border-gray-200 py-1 pl-8 pr-1 text-xs'>
						{props.url}
					</div>
				</Browser.Search>
			</Browser.Toolbar>
			<Browser.Content>{props.children}</Browser.Content>
		</Browser>
	);
};

const Browser = tw.div`flex flex-col rounded-lg border border-gray-200 overflow-clip relative z-0`;
Browser.Toolbar = tw.div`flex justify-center items-center p-2 bg-gray-100 relative`;
Browser.Actions = tw.div`absolute top-1/2 -translate-y-1/2 left-3 flex items-center gap-2 [&>*]:(w-2.5 h-2.5 rounded-full) [&>:first-child]:bg-error [&>:nth-child(2)]:bg-primary [&>:last-child]:bg-success`;
Browser.Search = tw.div`relative self-center`;
Browser.Content = tw.div`max-w-full mx-auto place-content-center h-fit`;

export default BrowserMockup;
