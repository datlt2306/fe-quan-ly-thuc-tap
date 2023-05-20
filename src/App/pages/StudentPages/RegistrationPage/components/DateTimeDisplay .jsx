const DateTimeDisplay = ({ value, type }) => {
	return (
		<div className='flex gap-2'>
			<p className='text-red text-base font-bold'>{value}</p>
			<span className='font-medium'>{type}</span>
		</div>
	);
};

export default DateTimeDisplay;
