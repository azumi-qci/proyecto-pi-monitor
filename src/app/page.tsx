'use client';
import { useCallback, useEffect, useState } from 'react';

import { Dropdown } from '@monitor/components/Dropdown';
import { LoginScreen } from '@monitor/components/LoginScreen';
import { AccessItem } from '@monitor/components/AccessItem';
import { LogoutButton } from '@monitor/components/LogoutButton';
import { LoadingScreen } from '@monitor/components/LoadingScreen';
import { AccessTitle } from '@monitor/components/AccessTitle';

import { AccessLog } from '@monitor/interfaces/AccessLog';
import { AuthUser } from '@monitor/interfaces/AuthUser';
import { Door } from '@monitor/interfaces/Door';

import { socket } from '@monitor/socket';
import { api } from '@monitor/api';

import { toCamelCase } from '@monitor/helpers/toCamelCase';
import { getTimeDifference } from '@monitor/helpers/getTimeDifference';
import { getLocalDate } from '@monitor/helpers/getLocalDate';

import config from '../../config.json';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [doors, setDoors] = useState<Door[]>([]);
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [currentDoor, setCurrentDoor] = useState(0);

  /**
   * Fetches all the registered doors in database
   * and saves them in the state
   */
  const fetchAvailableDoors = useCallback(() => {
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

  /**
   * Fetches all the access logs of the current door
   * and saves them in the state
   */
  const fetchAccessLogs = useCallback(
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

  /**
   * Returns a list of available access logs of the current door
   * @param expired - If `true`, only expired or previusly accessed logs will be returned
   */
  const getLogs = useCallback(
    (expired = false) => {
      const currentTime = new Date();

      if (expired) {
        return logs.filter((item) => {
          const logTime = new Date(`${item.entranceDay} ${item.entranceHour}`);
          const timeDiff = getTimeDifference(currentTime, logTime);

          return config.ALLOW_TIME_DIFFERENCE < timeDiff || item.checked;
        });
      }

      return logs.filter((item) => {
        const logTime = new Date(`${item.entranceDay} ${item.entranceHour}`);
        const timeDiff = getTimeDifference(currentTime, logTime);

        return config.ALLOW_TIME_DIFFERENCE >= timeDiff && !item.checked;
      });
    },
    [logs]
  );

  /**
   * Resets all the application state when the user
   * logs out of the system
   */
  const onLogout = useCallback(() => {
    // Delete token from localStorage
    localStorage.removeItem('auth_token');
    // Reset data
    setAuthUser(null);
    setDoors([]);
    setCurrentDoor(0);
    setLogs([]);
  }, []);

  /**
   * Add a new access log when received via socket (real time)
   */
  const onSocketUpdateLog = useCallback(
    (updatedLog: AccessLog) => {
      const logIndex = logs.findIndex((item) => item.id === updatedLog.id);

      if (logIndex > -1) {
        const tempList = [...logs];
        const newItem = toCamelCase(updatedLog);

        const tempItem = {
          ...logs[logIndex],
          ...newItem,
          entranceDay: getLocalDate(newItem.entranceDay),
        };
        tempList.splice(logIndex, 1, tempItem);

        setLogs([...tempList]);
      }
    },
    [logs]
  );

  /**
   * Updates a accses log when received via socket (real time)
   */
  const onSocketAddLog = useCallback(
    (newLog: AccessLog) => {
      const tempList = [...logs];
      const newItem = toCamelCase(newLog);

      tempList.push(newItem);

      setLogs([...tempList]);
    },
    [logs]
  );

  /**
   * Sets the `checked` flag to the new check state when received via socket (real time)
   */
  const onSocketCheckLog = useCallback(
    ({ id, checked }: { id: number; checked: boolean }) => {
      const logIndex = logs.findIndex((item) => item.id === id);

      if (logIndex > -1) {
        const tempList = [...logs];
        const tempItem = { ...logs[logIndex], checked };

        tempList.splice(logIndex, 1, tempItem);

        setLogs([...tempList]);
      }
    },
    [logs]
  );

  /**
   * Tells the server that a access log has
   * now been registed or viceversa
   * @param id - Access log id
   * @param doorId - Door id of the access log
   */
  const setAccessLogAsChecked = useCallback(
    (id: number, doorId: number) => {
      const remove = logs.find((item) => item.id === id)?.checked;

      if (!remove) {
        api
          .put(`/access/check/${doorId}/${id}`, null, {
            headers: {
              Authorization: `Bearer ${authUser?.token}`,
            },
          })
          .then(console.log)
          .catch(console.warn);
      } else {
        api
          .put(`/access/uncheck/${doorId}/${id}`, null, {
            headers: {
              Authorization: `Bearer ${authUser?.token}`,
            },
          })
          .then(console.log)
          .catch(console.warn);
      }
    },
    [logs, authUser]
  );

  useEffect(() => {
    if (authUser) {
      // Get initial data
      fetchAvailableDoors();
    }
  }, [authUser]);

  useEffect(() => {
    if (currentDoor > 0) {
      fetchAccessLogs(currentDoor);
    }
  }, [currentDoor]);

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
    socket.on('add-log', onSocketAddLog);
    socket.on('check-log', onSocketCheckLog);
    socket.on('uncheck-log', onSocketCheckLog);

    return () => {
      socket.off('update-log', onSocketUpdateLog);
      socket.off('update-log', onSocketAddLog);
      socket.off('check-log', onSocketCheckLog);
      socket.off('uncheck-log', onSocketCheckLog);
    };
  }, [logs]);

  if (loading) {
    return <LoadingScreen />;
  } else if (!authUser) {
    return <LoginScreen onSuccessLogin={setAuthUser} />;
  }

  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      {/* Header */}
      <div className='flex bg-orange-600 text-neutral-50 text-center py-3 px-3 justify-between items-center select-none'>
        {/* Log out button */}
        <LogoutButton onLogout={onLogout} />
        <h1
          className='font-bold text-3xl uppercase mr-5'
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
      <div className='flex flex-col flex-1 max-h-full overflow-hidden'>
        <div className='flex flex-col m-6 h-1/2'>
          <h2 className='mb-3 text-3xl font-bold border-b pb-2'>Activos</h2>
          <div className='max-h-full overflow-y-auto pr-2'>
            <AccessTitle />
            {getLogs().map((item) => (
              <AccessItem
                key={`log-${item.id}`}
                setAccessLogAsChecked={setAccessLogAsChecked}
                {...item}
              />
            ))}
          </div>
        </div>
        <div className='flex flex-col m-6 h-1/2'>
          <h2 className='mb-3 text-3xl font-bold border-b pb-2'>
            Expirados o anteriores
          </h2>
          <div className='max-h-full overflow-y-auto pr-2'>
            <AccessTitle />
            {getLogs(true).map((item) => (
              <AccessItem
                key={`log-expired-${item.id}`}
                setAccessLogAsChecked={setAccessLogAsChecked}
                {...item}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
