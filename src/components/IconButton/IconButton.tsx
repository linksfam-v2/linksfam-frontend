import { cn } from '@/lib/utils';

const IconButton = ({ title, className, onClick, disabled, type, size }: IconButtonProps) => {
  return (
    <button 
      type={type} 
      disabled={disabled} 
      onClick={onClick} 
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "px-2 py-1 text-sm": size === 'small',
          "px-4 py-2 text-base": size === 'medium' || !size,
          "px-6 py-3 text-lg": size === 'large',
        },
        className
      )}
    >
      {title}
    </button>
  )
}

export default IconButton

type IconButtonProps = {
  title: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
  variant?: 'primary' | "success" | "warning" | "danger";
  size?: 'small' | 'medium' | 'large';
};