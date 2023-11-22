import { FC } from 'react';

import { AccessLog, Status } from '../../interfaces/AccessLog';
import { getTimeDifference } from '../../helpers/getTimeDifference';

import config from '../../../config.json';

interface AccessLogPanelProps {
  data: AccessLog[];
  type: Status;
}

const AccessLogPanel: FC<AccessLogPanelProps> = ({ data, type }) => {
  const getFilteredData = (): AccessLog[] => {
    return data.filter((item) => {
      const timeDiff = getTimeDifference(
        new Date(item.accessDaytime),
        new Date()
      );

      if (type === Status.NEXT) {
        return (
          timeDiff <= config.NEXT_TIME_MAX && timeDiff > config.ON_TIME_MIN
        );
      } else if (type === Status.PASSED) {
        return (
          timeDiff <= -config.PREVIOUS_TIME_MIN &&
          Math.abs(timeDiff) > config.PREVIOUS_TIME_MIN * 2
        );
      } else {
        return (
          timeDiff <= config.ON_TIME_MIN && timeDiff > -config.PREVIOUS_TIME_MIN
        );
      }
    });
  };

  const getPanelTitle = (): String => {
    switch (type) {
      case Status.NEXT:
        return 'Siguiente';
      case Status.ON_TIME:
        return 'Actual';
      case Status.PASSED:
      default:
        return 'Anterior';
    }
  };

  return (
    <div className='flex-1 p-4 mx-2 border rounded'>
      <h3 className='text-3xl mb-4'>{getPanelTitle()}</h3>
      {getFilteredData().map((item) => (
        <div
          className={`flex border p-4 rounded shadow-lg mb-4 ${
            type === Status.PASSED ? 'bg-amber-200' : 'bg-neutral-50'
          }`}
          key={item.id}
        >
          <div className='flex-1'>
            <p className='font-bold'>Nombre</p>
            <p>{item.name}</p>
            <p className='font-bold'>Automóvil</p>
            <p>
              {item.carBrand} {item.carColor} | {item.carPlate}
            </p>
          </div>
          <div className='flex-1'>
            <p className='font-bold'>Hora de acceso</p>
            <p>{new Date(item.accessDaytime).toLocaleTimeString()}</p>
            <p className='font-bold'>Lugar de visita</p>
            <p>{item.visitLocation}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccessLogPanel;
