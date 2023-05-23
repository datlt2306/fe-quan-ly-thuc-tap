import React from 'react';

const Text = ({ as: Element = 'span', tw, ...props }) => {
	return <Element className={props.className}>{props.children}</Element>;
};

export default Text;
