import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquareCheck,
  faSquareXmark,
  faCheck,
  faX,
} from '@fortawesome/free-solid-svg-icons';

import { Button } from '@monitor/components/Button';

import { AccessLog } from '@monitor/interfaces/AccessLog';

interface AccessItemProps extends AccessLog {}

const AccessItem: FC<AccessItemProps> = ({
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
    <div className='flex gap-x-6 p-2 mb-2 border bg-neutral-50 hover:bg-neutral-100'>
      <p className='flex items-center justify-center w-1/12'>
        {getFormatedDate(entranceDay)}
      </p>
      <p className='flex items-center justify-center w-1/12'>{entranceHour}</p>
      <p className='flex items-center justify-center w-3/12'>{name}</p>
      <p className='flex items-center justify-center w-2/12'>{carBrand}</p>
      <p className='flex items-center justify-center w-1/12'>{carColor}</p>
      <p className='flex items-center justify-center w-1/12'>{carPlate}</p>
      <p className='flex items-center justify-center w-2/12'>{visitLocation}</p>
      <p className='flex items-center justify-center w-1/12'>
        <Button>
          {checked ? (
            <FontAwesomeIcon icon={faX} size='lg' />
          ) : (
            <FontAwesomeIcon icon={faCheck} size='lg' />
          )}
        </Button>
      </p>
    </div>
  );
};

export default AccessItem;
