import { cn } from '@/lib/utils';

const Button = ({ title, className, onClick, disabled, type, size, leftChildren, variant, isOutlined, secondaryOutlined }: ButtonProps) => {
  return (
    <button 
      type={type} 
      disabled={disabled} 
      onClick={onClick} 
      className={cn(
        // Base styles
        "bg-blue-500 text-white px-4 py-2 w-full outline-none border-0 rounded-lg",
        "inline-flex items-center text-center justify-center gap-1",
        "hover:bg-blue-600 focus:bg-blue-600 focus:text-white",
        "disabled:bg-disabled disabled:text-disabled-text disabled:shadow-none",
        "active:shadow-none",
        // Size variants
        {
          "py-[0.7rem] px-3": size === 'small',
          "py-3 px-6": size === 'medium',
          "py-4 px-8": size === 'large',
        },
        // Variant styles
        {
          "bg-secondary text-white": variant === "danger",
        },
        // Outlined styles
        {
          "bg-white border-2 border-primary text-primary shadow-none hover:bg-white hover:border-primary hover:text-primary": isOutlined,
          "bg-white border-2 border-secondary text-secondary shadow-none hover:bg-secondary hover:text-white": secondaryOutlined,
        },
        className
      )}
    >
      {title}
      {leftChildren ? leftChildren : null}
    </button>
  )
}

export default Button

type ButtonProps = {
  title: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
  variant?: 'primary' | "success" | "warning" | "danger";
  size?: 'small' | 'medium' | 'large';
  leftChildren?: React.ReactNode,
  isOutlined?: boolean
  secondaryOutlined?: boolean
};