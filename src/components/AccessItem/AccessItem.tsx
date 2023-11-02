import { FC } from 'react';

import { AccessLog } from '../../interfaces/AccessLog';

interface AccessItemProps extends AccessLog {}

const AccessItem: FC<AccessItemProps> = ({ name }) => {
  return (
    <div className='px-6 py-4'>
      <p>{name}</p>
    </div>
  );
};

export default AccessItem;
