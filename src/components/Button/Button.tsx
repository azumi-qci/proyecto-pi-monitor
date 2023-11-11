import { FC, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  outline?: boolean;
}

const Button: FC<ButtonProps> = ({
  className,
  children,
  outline = false,
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 border ${
        outline
          ? 'bg-neutral-50 text-orange-600 hover:bg-neutral-100 border-orange-600'
          : 'bg-orange-600 text-neutral-50 hover:bg-orange-500 border-neutral-50'
      } ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
