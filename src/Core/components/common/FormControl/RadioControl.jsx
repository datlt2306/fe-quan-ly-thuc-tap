export const Radio = ({ onChange: handleChange, ...props }, ref) => (
	<input onChange={(e) => handleChange(e)} ref={ref} {...props} type='radio' className='border-gray-300 text-primary focus:ring-primary' />
);
