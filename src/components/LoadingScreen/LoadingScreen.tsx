import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingScreen: FC = () => {
  return (
    <div className='flex h-screen w-screen justify-center items-center'>
      <div className='flex flex-col items-center'>
        <FontAwesomeIcon
          icon={faSpinner}
          className='mb-3'
          size='3x'
          spinPulse
        />
        <p className='text-2xl'>Cargando...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
