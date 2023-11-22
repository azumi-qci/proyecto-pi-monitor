'use client';
import { useCallback, useEffect, useState } from 'react';

import { Dropdown } from '@monitor/components/Dropdown';
import { LoginScreen } from '@monitor/components/LoginScreen';
import { LogoutButton } from '@monitor/components/LogoutButton';
import { LoadingScreen } from '@monitor/components/LoadingScreen';

import { AccessLog, Status } from '@monitor/interfaces/AccessLog';
import { AuthUser } from '@monitor/interfaces/AuthUser';
import { Door } from '@monitor/interfaces/Door';

import { socket } from '@monitor/socket';
import { api } from '@monitor/api';

import { toCamelCase } from '@monitor/helpers/toCamelCase';

import { AccessLogPanel } from '../components/AccessLogPanel';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [doors, setDoors] = useState<Door[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [currentDoor, setCurrentDoor] = useState<Door | null>(null);
  const [currentHour, setCurrentHour] = useState('00:00:00');

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
        setCurrentDoor(doors[0]);
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

          setAccessLogs([...convertedData]);
          // Join room
          socket.emit('join-room', doorId);
        })
        .catch(console.log);
    },
    [authUser]
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
    setCurrentDoor(null);
    setAccessLogs([]);
  }, []);

  /**
   * Changes the current displayed door
   */
  const onChangeDoor = useCallback((doorId: number) => {
    const doorIndex = doors.findIndex((item) => item.id === doorId);

    if (doorIndex > -1) {
      setCurrentDoor(doors[doorIndex]);
    }
  }, []);

  /**
   * Add a new access log when received via socket (real time)
   * @param updatedLog - Updated data of the access log
   */
  const onSocketUpdateLog = (updatedLog: AccessLog) => {
    const logIndex = accessLogs.findIndex((item) => item.id === updatedLog.id);

    if (logIndex > -1) {
      const tempList = [...accessLogs];
      const newItem = toCamelCase(updatedLog);

      const tempItem = {
        ...accessLogs[logIndex],
        ...newItem,
      };
      tempList.splice(logIndex, 1, tempItem);

      setAccessLogs(tempList);
    }
  };

  /**
   * Updates a access log when received via socket (real time)
   * @param newLog - New access log data
   */
  const onSocketAddLog = (newLog: AccessLog) => {
    const tempList = [...accessLogs];
    const newItem = toCamelCase(newLog);

    tempList.push(newItem);
    // Sort by date when added a new log
    tempList.sort(
      (a, b) =>
        new Date(b.accessDaytime).getTime() -
        new Date(a.accessDaytime).getTime()
    );

    setAccessLogs(tempList);
  };

  /**
   * Deletes a access log when received via socket (real time)
   * @param id - Unique ID of the deleted access log
   */
  const onSocketDeleteLog = (id: number) => {
    const itemIndex = accessLogs.findIndex((item) => item.id === id);

    if (itemIndex > -1) {
      const tempList = [...accessLogs];
      // Delete from temporal list
      tempList.splice(itemIndex, 1);

      setAccessLogs(tempList);
    }
  };

  useEffect(() => {
    if (authUser) {
      // Get initial data
      fetchAvailableDoors();
    }
  }, [authUser]);

  useEffect(() => {
    if (currentDoor) {
      fetchAccessLogs(currentDoor.id);
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
    socket.on('delete-log', onSocketDeleteLog);

    return () => {
      socket.off('update-log', onSocketUpdateLog);
      socket.off('update-log', onSocketAddLog);
      socket.off('delete-log', onSocketDeleteLog);
    };
  }, [accessLogs]);

  useEffect(() => {
    const timerInvertal = setInterval(() => {
      setCurrentHour(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timerInvertal);
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  } else if (!authUser) {
    return <LoginScreen onSuccessLogin={setAuthUser} />;
  }

  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      {/* Header */}
      <div className='flex bg-orange-500 text-neutral-50 text-center py-6 px-3 justify-between items-center select-none'>
        {/* Log out button */}
        <LogoutButton onLogout={onLogout} />
        <h1
          className='font-bold text-5xl uppercase mr-5'
          onClick={() => socket.emit('join-room', 1)}
        >
          Monitoreo de acceso CUCEI
        </h1>
        <Dropdown
          className='text-neutral-800'
          items={doors}
          onChange={(e) => onChangeDoor(parseInt(e.currentTarget.value))}
        />
      </div>
      {/* Content */}
      <div className='flex flex-col flex-1 max-h-full mx-6'>
        <div className='flex justify-between my-6'>
          <h2 className='text-5xl py-3 px-4 font-bold text-center'>
            {currentDoor?.name || ''}
          </h2>
          <h2 className='text-5xl py-3 px-4 font-bold text-center'>
            {currentHour}
          </h2>
        </div>
        <div className='flex flex-1'>
          <AccessLogPanel type={Status.PASSED} data={accessLogs} />
          <AccessLogPanel type={Status.ON_TIME} data={accessLogs} />
          <AccessLogPanel type={Status.NEXT} data={accessLogs} />
        </div>
      </div>
    </div>
  );
};

export default Home;
