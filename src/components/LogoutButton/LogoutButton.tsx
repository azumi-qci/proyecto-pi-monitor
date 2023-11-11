import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import { Button } from '@monitor/components/Button';

interface LogoutButtonProps {
  onLogout(): void;
}

const LogoutButton: FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <Button onClick={onLogout} outline>
      <FontAwesomeIcon icon={faRightFromBracket} className='mr-2' />
      Cerrar sesión
    </Button>
  );
};

export default LogoutButton;
