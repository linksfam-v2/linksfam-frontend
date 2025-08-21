import { cn } from '@/lib/utils';

const Input = ({ prefix, placeholder, label, type, hintText, name, id, value, onChange, onBlur, isError = false, isRequired, leftIcon, rigthIcon, isTextArea, disabled }: TypeInput) => {
  return (
    <div className="flex flex-col relative">
      {label && <label className="font-medium text-sm text-[#292929] ml-1.5">{label}{isRequired ? '*' : ''}</label>}
      {prefix && <p className="absolute top-8 left-4 z-10">+91</p>}
      {isTextArea ?
        <textarea
          disabled={disabled}
          className={cn(
            "resize-none border-[1.5px] border-[#d1d6e2] rounded-lg",
            "focus:outline-none focus:border-primary",
            {
              "p-3.5": !prefix,
              "pl-11 pr-3.5 py-3.5": prefix
            }
          )}
          placeholder={placeholder}
          name={name} id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur} /> :
        <input
          disabled={disabled}
          className={cn(
            "h-11 border-[1.5px] border-[#d1d6e2] rounded-lg relative",
            "focus:outline-none focus:border-primary",
            {
              "p-3.5": !prefix,
              "pl-11 pr-3.5 py-3.5": prefix
            }
          )}
          type={type} placeholder={placeholder}
          name={name} id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur} />}
      {leftIcon && leftIcon}
      {rigthIcon && rigthIcon}
      {hintText && <span className={cn(
        "font-light text-[13px] ml-1.5",
        {
          "text-red-500": isError
        }
      )}>{hintText}</span>}
    </div>
  );
}

export default Input;

type TypeInput = {
  placeholder?: string;
  label?: string;
  type?: string;
  hintText?: string;
  name?: string;
  id?: string;
  onChange?: (_e: any) => void;
  onBlur?: (_e: any) => void;
  value: string;
  isError?: boolean | "";
  isRequired?: boolean;
  leftIcon?: React.ReactNode;
  rigthIcon?: React.ReactNode;
  prefix?: boolean;
  isTextArea?: boolean;
  disabled?: boolean;
};