import { FC, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input: FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`px-3 py-2 border rounded-lg ${className || ''}`}
      {...props}
    />
  );
};

export default Input;
