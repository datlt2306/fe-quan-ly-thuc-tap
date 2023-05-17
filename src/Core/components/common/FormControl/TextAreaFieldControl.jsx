import { forwardRef, useEffect, useId, useRef } from "react";
import { useController } from "react-hook-form";
import tw from "twin.macro";

const TextArea = tw.textarea`block w-full rounded-md border-0 duration-300 px-2.5 py-1.5 text-gray-900 outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6`;
const FormControl = tw.div`flex flex-col gap-2 m-0`;

const TextAreaFieldControl = forwardRef(({ control, name, label, disabled, rules, ...props }, ref) => {
  const {
    field: { onChange, onBlur, value, ref: inputRef },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue: props.value,
    ...props,
  });

  const textareaRef = useRef(null);
  const id = useRef(useId());

  useEffect(() => {
    const textarea = textareaRef.current;

    const handleInput = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    textarea.addEventListener("input", handleInput);

    return () => {
      textarea.removeEventListener("input", handleInput);
    };
  }, []);

  return (
    <FormControl>
      {label && <label htmlFor={id.current}>{label}</label>}
      <TextArea
        {...props}
        id={id.current}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        disabled={disabled}
        ref={(e) => {
          textareaRef.current = e;
          if (typeof ref === "function") {
            ref(e);
          } else if (ref && typeof ref === "object") {
            ref.current = e;
          }
        }}
      />
      {error && <small className="font-medium text-error">{error?.message}</small>}
    </FormControl>
  );
});

export default TextAreaFieldControl;
