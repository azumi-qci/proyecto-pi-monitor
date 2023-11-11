'use client';
import { useCallback, useEffect, useState } from 'react';

import { Dropdown } from '@monitor/components/Dropdown';
import { LoginScreen } from '@monitor/components/LoginScreen';
import { AccessItem } from '@monitor/components/AccessItem';

import { AccessLog } from '@monitor/interfaces/AccessLog';
import { AuthUser } from '@monitor/interfaces/AuthUser';
import { Door } from '@monitor/interfaces/Door';

import { socket } from '@monitor/socket';
import { api } from '@monitor/api';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [doors, setDoors] = useState<Door[]>([]);
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [currentDoor, setCurrentDoor] = useState(0);

  const getAvailableDoors = useCallback(() => {
    setLoading(true);

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
      .catch(console.log)
      .finally(() => setLoading(false));
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
            return {
              name: item.name,
              carBrand: item.car_brand,
              carColor: item.car_color,
              carPlate: item.car_plate,
              entranceHour: item.entrance_hour,
              entranceDay: item.entrance_day,
              doorId: item.id_door,
              visitLocation: item.visit_location,
              checked: item.checked,
            };
          });

          setLogs([...(convertedData as AccessLog[])]);
        })
        .catch(console.log);
    },
    [authUser]
  );

  const getExpiredLogs = useCallback(() => {
    const currentTime = new Date();

    return logs.filter((item) => {
      const logTime = new Date(item.entranceHour);
      const timeDiff = currentTime.valueOf() - logTime.valueOf();

      console.log(currentTime.valueOf(), logTime.valueOf());

      return true;
    });
  }, [logs]);

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

  useEffect(() => {
    if (logs.length) {
    }
  }, [logs]);

  if (!authUser) {
    return <LoginScreen onSuccessLogin={setAuthUser} />;
  }

  return (
    <>
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
              Caducados o anteriores
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
