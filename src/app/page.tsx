'use client';
import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { Dropdown } from '@monitor/components/Dropdown';
import { LoginScreen } from '@monitor/components/LoginScreen';
import { AccessItem } from '@monitor/components/AccessItem';
import { LogoutButton } from '@monitor/components/LogoutButton';

import { AccessLog } from '@monitor/interfaces/AccessLog';
import { AuthUser } from '@monitor/interfaces/AuthUser';
import { Door } from '@monitor/interfaces/Door';

import { socket } from '@monitor/socket';
import { api } from '@monitor/api';

import { toCamelCase } from '@monitor/helpers/toCamelCase';

import config from '../../config.json';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [doors, setDoors] = useState<Door[]>([]);
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [currentDoor, setCurrentDoor] = useState(0);

  const getAvailableDoors = useCallback(() => {
    api
      .get<{ error: boolean; content: Door[] }>('/doors', {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      })
      .then((response) => {
        const doors = response.data.content;

        setDoors(doors);
        setCurrentDoor(doors[0].id);
      })
      .catch(console.log);
  }, [authUser]);

  const getAccessLogs = useCallback(
    (doorId: number) => {
      api
        .get<{ error: boolean; content: any[] }>(`/access/${doorId}`, {
          headers: {
            Authorization: `Bearer ${authUser?.token}`,
          },
        })
        .then((response) => {
          // Change variables from snake case to camel case
          const convertedData = response.data.content.map((item) => {
            return toCamelCase(item);
          });

          setLogs([...(convertedData as AccessLog[])]);
          // Join room
          socket.emit('join-room', doorId);
        })
        .catch(console.log);
    },
    [authUser]
  );

  const getExpiredLogs = useCallback(() => {
    const currentTime = new Date();

    return logs.filter((item) => {
      const logTime = new Date(`${item.entranceDay} ${item.entranceHour}`);
      const timeDiff = Math.abs(currentTime.getTime() - logTime.getTime());
      const timeDiffMin = Math.floor(timeDiff / 1000 / 60);

      return config.ALLOW_TIME_DIFFERENCE < timeDiffMin;
    });
  }, [logs]);

  const onLogout = useCallback(() => {
    // Delete token from localStorage
    localStorage.removeItem('auth_token');
    // Reset data
    setAuthUser(null);
    setDoors([]);
    setCurrentDoor(0);
    setLogs([]);
  }, []);

  useEffect(() => {
    if (authUser) {
      // Get initial data
      getAvailableDoors();
    }
  }, [authUser]);

  useEffect(() => {
    if (currentDoor > 0) {
      getAccessLogs(currentDoor);
    }
  }, [currentDoor]);

  const onSocketUpdateLog = useCallback(
    (updatedLog: AccessLog) => {
      const logIndex = logs.findIndex((item) => item.id === updatedLog.id);

      if (logIndex !== -1) {
        const tempItem = { ...logs[logIndex], ...toCamelCase(updatedLog) };
        const tempList = [...logs];
        tempList.splice(logIndex, 1, tempItem);

        setLogs([...tempList]);
      }
    },
    [logs]
  );

  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    if (token) {
      setLoading(true);

      api
        .get<{ error: boolean; content: AuthUser }>('/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setAuthUser({ ...response.data.content, token }))
        .catch(console.warn)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    socket.on('update-log', onSocketUpdateLog);

    return () => {
      socket.off('update-log', onSocketUpdateLog);
    };
  }, [logs]);

  if (loading) {
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
  } else if (!authUser) {
    return <LoginScreen onSuccessLogin={setAuthUser} />;
  }

  return (
    <>
      {/* Log out button */}
      <LogoutButton onLogout={onLogout} />
      {/* Content */}
      <div className='flex flex-col h-screen'>
        {/* Header */}
        <div className='flex bg-orange-600 text-neutral-50 text-center py-3 px-3 justify-between items-center'>
          <h1
            className='font-bold text-3xl uppercase'
            onClick={() => socket.emit('join-room', 1)}
          >
            Monitoreo de entrada - CUCEI
          </h1>
          <Dropdown
            className='text-neutral-800'
            items={doors}
            onChange={(e) => setCurrentDoor(parseInt(e.target.value))}
          />
        </div>
        {/* Content */}
        <div className='flex flex-col flex-1'>
          <div className='flex flex-col m-2 h-1/2'>
            <h2 className='mb-3 text-2xl font-bold border-b pb-2'>Activos</h2>
            {logs.map((item) => (
              <AccessItem key={`log-${item.id}`} {...item} />
            ))}
          </div>
          <div className='flex flex-col m-2 h-1/2'>
            <h2 className='mb-3 text-2xl font-bold border-b pb-2'>
              Expirados o anteriores
            </h2>
            {getExpiredLogs().map((item) => (
              <AccessItem key={`log-${item.id}`} {...item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
