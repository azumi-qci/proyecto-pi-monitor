import { FC } from 'react';

import { AccessLog } from '../../interfaces/AccessLog';
import { Button } from '../Button';

interface AccessItemProps extends AccessLog {}

const AccessItem: FC<AccessItemProps> = ({
  id,
  name,
  entranceDay,
  entranceHour,
  carBrand,
  carColor,
  carPlate,
  visitLocation,
  checked,
}) => {
  const getFormatedDate = (date: string) => {
    const myDate = new Date(date);

    return `${myDate.toLocaleDateString()}`;
  };

  return (
    <div className='flex gap-x-6 p-3 mb-2 border bg-neutral-50 hover:bg-neutral-100'>
      <p className='flex items-center justify-center w-1/12'>
        {getFormatedDate(entranceDay)}
      </p>
      <p className='flex items-center justify-center w-1/12'>{entranceHour}</p>
      <p className='flex items-center justify-center w-4/12'>{name}</p>
      <p className='flex items-center justify-center w-1/12'>{carBrand}</p>
      <p className='flex items-center justify-center w-1/12'>{carColor}</p>
      <p className='flex items-center justify-center w-1/12'>{carPlate}</p>
      <p className='flex items-center justify-center w-3/12'>{visitLocation}</p>
      <p className='flex items-center justify-center w-1/12'>
        <Button>{checked ? 'Anular' : 'Acceso'}</Button>
      </p>
    </div>
  );
};

export default AccessItem;
