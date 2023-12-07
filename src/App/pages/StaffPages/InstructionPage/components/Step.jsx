import { useLocation, useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { useContext, useEffect, useMemo } from 'react';
import { ViewContext } from '../context/ViewContext';

const Step = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { isOnFirstStep, isOnSecondStep, isOnThirdStep } = useContext(ViewContext);
	useEffect(() => {
		const currentStep = (() => {
			switch (true) {
				case isOnFirstStep:
					return '#step-1';
				case isOnSecondStep:
					return '#step-2';
				case isOnThirdStep:
					return '#step-3';
				default:
					return '#step-1';
			}
		})();
		navigate(currentStep);
	}, [isOnFirstStep, isOnSecondStep, isOnThirdStep]);

	const steps = useMemo(
		() => [
			{
				name: 'Bước 1',
				description: 'Đăng nhập vào Google Accounts',
				href: '#step-1',
				active: isOnFirstStep
			},
			{
				name: 'Bước 2',
				description: 'Lấy mật khẩu ứng dụng',
				href: '#step-2',
				active: isOnSecondStep
			},
			{
				name: 'Bước 3',
				description: 'Set mật khẩu ứng dụng',
				href: '#step-3',
				active: isOnThirdStep
			}
		],
		[isOnFirstStep, isOnSecondStep, isOnThirdStep]
	);

	return (
		<nav aria-label='Progress'>
			<ol role='list' className='overflow-hidden'>
				{steps.map((step, stepIndex) => (
					<li key={step.href} className={classNames('relative', { 'pb-10': stepIndex !== steps.length - 1 })}>
						{stepIndex !== steps.length - 1 && (
							<div className='absolute left-3 top-3 -ml-px mt-0.5 h-full w-0.5 bg-gray-200' aria-hidden='true' />
						)}
						<a href={step.href} className='group relative flex items-start' aria-current='step'>
							<span className='flex h-9 items-center' aria-hidden='true'>
								<span
									className={classNames(
										'relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white',
										{
											'!border-primary': step.active,
											'border-gray-200 group-hover:border-gray-300': !step.active
										}
									)}>
									<span
										className={classNames('h-2.5 w-2.5 rounded-full bg-primary', { hidden: !step.active })}
									/>
								</span>
							</span>
							<span className='ml-4 flex min-w-0 flex-col'>
								<span
									className={classNames('text-sm font-medium', {
										'text-primary': step.active,
										'text-base-content': !step.active
									})}>
									{step.name}
								</span>
								<span className='whitespace-nowrap text-sm text-gray-500'>{step.description}</span>
							</span>
						</a>
					</li>
				))}
			</ol>
		</nav>
	);
};
export default Step;
