import { FC, useCallback, useState } from 'react';

import { Input } from '@monitor/components/Input';
import { Button } from '@monitor/components/Button';

import { AuthUser } from '@monitor/interfaces/AuthUser';

import { api } from '@monitor/api';
import { AxiosError } from 'axios';

interface LoginScreenProps {
  onSuccessLogin(authUser: AuthUser): void;
}

const LoginScreen: FC<LoginScreenProps> = ({ onSuccessLogin }) => {
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const sendData = useCallback(() => {
    if (!data.email || !data.password) {
      setErrorMessage('Por favor llene todos los campos');
      return;
    }

    setSending(true);
    setErrorMessage('');

    api
      .post<{ error: boolean; content: AuthUser }>('/auth/login', {
        email: data.email.trim(),
        password: data.password.trim(),
      })
      .then((response) => onSuccessLogin(response.data.content))
      .catch((e) => {
        const error = e as AxiosError<{ error: string; message: string }>;

        if (!error.response) {
          setErrorMessage('Hubo un error al conectar con el servidor');
        } else if (error.response.status === 401) {
          setErrorMessage('Usuario y/o contraseña incorrectos');
        } else {
          setErrorMessage('Error en servidor');
        }
      })
      .finally(() => setSending(false));
  }, [data]);

  return (
    <div className='flex w-screen h-screen justify-center items-center'>
      <div className='px-6 py-4 shadow-2xl rounded-lg w-full max-w-md'>
        <h2 className='font-bold uppercase text-center text-2xl pb-6 mb-6 border-b-2 text-neutral-800'>
          Iniciar sesión
        </h2>
        <div className='flex flex-col'>
          <Input
            disabled={sending}
            className='mb-3'
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder='Ingresar correo electrónico'
            value={data.email}
          />
          <Input
            disabled={sending}
            className='mb-3'
            onChange={(e) => setData({ ...data, password: e.target.value })}
            placeholder='Ingresar contraseña'
            type='password'
            value={data.password}
          />
          <Button onClick={sendData} disabled={sending}>
            {sending ? 'Entrando...' : 'Entrar'}
          </Button>
          {errorMessage ? (
            <p className='text-red-700 text-right mt-3'>{errorMessage}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
