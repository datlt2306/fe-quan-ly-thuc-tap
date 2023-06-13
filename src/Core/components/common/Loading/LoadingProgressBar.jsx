import React, { useEffect } from 'react';
import nProgress from 'nprogress';
import './styles/nprogress.css';

const LoadingProgressBar = () => {
	nProgress.configure({
		showSpinner: false
	});
	useEffect(() => {
		nProgress.start(0);

		return () => {
			nProgress.done();
		};
	}, []);

	return null;
};

export default LoadingProgressBar;
