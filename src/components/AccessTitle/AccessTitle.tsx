import { FC } from 'react';

const AccessTitle: FC = () => {
  return (
    <div className='flex gap-x-6 p-2 mb-2 border text-center sticky top-0 bg-neutral-300 border-neutral-300 select-none'>
      <p className='flex items-center justify-center w-1/12'>Fecha</p>
      <p className='flex items-center justify-center w-1/12'>Hora de entrada</p>
      <p className='flex items-center justify-center w-3/12'>Nombre</p>
      <p className='flex items-center justify-center w-2/12'>Marca de auto</p>
      <p className='flex items-center justify-center w-1/12'>Color de auto</p>
      <p className='flex items-center justify-center w-1/12'>Placa de auto</p>
      <p className='flex items-center justify-center w-2/12'>Lugar de visita</p>
      <p className='flex items-center justify-center w-1/12'>Acceso</p>
    </div>
  );
};

export default AccessTitle;
