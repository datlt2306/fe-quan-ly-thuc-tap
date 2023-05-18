import PropTypes from "prop-types";
import { forwardRef, useId, useRef } from "react";
import { useController } from "react-hook-form";
import tw from "twin.macro";

export const Textarea = tw.textarea`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`;

const FormControl = tw.div`flex flex-col gap-2 m-0`;

const TextAreaFieldControl = forwardRef(
	({ control, name, label, disabled, rules, ...props }, ref) => {
		const {
			field,
			fieldState: { error },
		} = useController({
			name,
			control,
			rules,
			defaultValue: props.value,
			...props,
		});

		const id = useId();
		const localRef = useRef(null);
		const inputRef = ref || localRef;

		return (
			<FormControl>
				{label && <label htmlFor={id}>{label}</label>}
				<Textarea
					{...props}
					id={id}
					onChange={(event) => {
						field.onChange(event);
						if (props.onChange) {
							props.onChange(event);
						}
					}}
					value={field.value}
					disabled={disabled}
					ref={(e) => {
						field.ref(e);
						inputRef.current = e;
					}}
				/>
				{error && <small className="font-medium text-error">{error?.message}</small>}
			</FormControl>
		);
	}
);

TextAreaFieldControl.propTypes = {
	label: PropTypes.string,
	control: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	rules: PropTypes.array,
};
// TextAreaFieldControl.defaultProps = {
// 	name: "TextAreaFieldControl",
//  }
export default TextAreaFieldControl;
