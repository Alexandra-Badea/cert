import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../authContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';

function Navigation() {
  const { logout } = useContext(AuthContext);

  return (
    <div className='navigation'>
      <Link to='/control-panel/dashboard'><DashboardIcon /></Link>
      <Link to='/' onClick={logout}><LogoutIcon /></Link>
    </div>
  )
}

export default Navigation;