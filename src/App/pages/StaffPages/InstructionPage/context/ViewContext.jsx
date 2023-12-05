import useOnScreen from '@/App/hooks/useOnScreen';
import { createContext, useRef } from 'react';

const ViewContext = createContext();

const ViewProvider = ({ children }) => {
	const firstStepRef = useRef(null);
	const secondStepRef = useRef(null);
	const thirdStepRef = useRef(null);

	const isOnFirstStep = useOnScreen(firstStepRef, '0px', 1);
	const isOnSecondStep = useOnScreen(secondStepRef, '0px', 0.3);
	const isOnThirdStep = useOnScreen(thirdStepRef, '0px', 0);

	return (
		<ViewContext.Provider
			value={{ firstStepRef, secondStepRef, thirdStepRef, isOnFirstStep, isOnSecondStep, isOnThirdStep }}>
			{children}
		</ViewContext.Provider>
	);
};

export { ViewContext, ViewProvider };
