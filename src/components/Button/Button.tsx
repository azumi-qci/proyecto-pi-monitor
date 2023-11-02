import { FC, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button
      className={`px-3 py-2 border rounded-lg bg-orange-600 text-neutral-50 hover:bg-orange-500 ${
        className || ''
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
