import { FC } from 'react';

import { AccessLogWithStatus, Status } from '@monitor/interfaces/AccessLog';

interface AccessItemProps extends AccessLogWithStatus {}

const AccessItem: FC<AccessItemProps> = ({
  name,
  entranceDay,
  entranceHour,
  carBrand,
  carColor,
  carPlate,
  visitLocation,
  status,
}) => {
  const getFormatedDate = (date: string) => {
    const myDate = new Date(date);

    return `${myDate.toLocaleDateString()}`;
  };

  const getStatus = (status: Status) => {
    switch (status) {
      case Status.EXPIRED:
        return 'Expirado';
      case Status.NEAR_TIME:
        return 'Atrasado';
      case Status.ON_TIME:
      default:
        return 'A tiempo';
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.EXPIRED:
        return 'bg-red-300';
      case Status.NEAR_TIME:
        return 'bg-amber-300';
      case Status.ON_TIME:
      default:
        return 'bg-neutral-50';
    }
  };

  return (
    <div
      className={`flex gap-x-6 p-5 mb-2 border rounded ${getStatusColor(
        status
      )}`}
    >
      <p className='flex items-center justify-center w-1/12'>
        {getStatus(status)}
      </p>
      <p className='flex items-center justify-center w-1/12'>
        {getFormatedDate(entranceDay)}
      </p>
      <p className='flex items-center justify-center w-1/12'>{entranceHour}</p>
      <p className='flex items-center justify-center w-3/12'>{name}</p>
      <p className='flex items-center justify-center w-2/12'>{carBrand}</p>
      <p className='flex items-center justify-center w-1/12'>{carColor}</p>
      <p className='flex items-center justify-center w-1/12'>{carPlate}</p>
      <p className='flex items-center justify-center w-2/12'>{visitLocation}</p>
    </div>
  );
};

export default AccessItem;
