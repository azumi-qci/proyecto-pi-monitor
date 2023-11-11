import { FC, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input: FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`px-3 py-2 border focus:outline focus:outline-neutral-300 ${
        className || ''
      }`}
      {...props}
    />
  );
};

export default Input;
