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
      className={`px-4 py-2 border rounded ${
        outline
          ? 'bg-neutral-50 text-orange-500 hover:bg-neutral-100 border-orange-500'
          : 'bg-orange-500 text-neutral-50 hover:bg-orange-400 border-neutral-50'
      } ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
