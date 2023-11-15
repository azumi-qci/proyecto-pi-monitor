import { FC, SelectHTMLAttributes } from 'react';

import { Door } from '../../interfaces/Door';

interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * Items that will be shown in the dropdown
   */
  items: Door[];
}

const Dropdown: FC<DropdownProps> = ({ items, className, ...props }) => {
  return (
    <select
      className={`px-4 py-2 rounded focus:outline focus:outline-neutral-50 ${
        className || ''
      }`}
      {...props}
    >
      {items.map((item) => (
        <option key={`item-${item.id}`} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
