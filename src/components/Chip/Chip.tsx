import { cn } from '@/lib/utils';

const Chip = ({ title, leftChildren, rightChildren, variant = 'primary', size, onClick }: TitleProps) => {
  return (
    <div 
      onClick={onClick} 
      className={cn(
        "h-5 rounded-full border inline-flex text-xs font-normal",
        "justify-center items-center gap-1 cursor-pointer",
        "px-2 py-1",
        // Variant styles
        {
          "border-primary bg-primary-lighten text-primary": variant === 'primary',
          "border-success bg-[#e8fff7] text-success": variant === 'success',
          "border-secondary bg-secondary-lighten text-secondary": variant === 'secondary',
          "border-ternary bg-ternary-lighten text-ternary": variant === 'ternary',
        },
        // Size styles
        {
          "py-2 px-4 h-8": size === 'medium',
          "py-4 px-5 h-16": size === 'large',
        }
      )}
    >
      {leftChildren ? leftChildren : null}
      {title}
      {rightChildren ? rightChildren : null}
    </div>
  )
}

export default Chip
type TitleProps = {
  title: string;
  size?: 'small' | 'medium' | 'large';
  leftChildren?: React.ReactNode;
  rightChildren?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ternary' | 'success';
  onClick?: () => void;
}