import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Navbar() {
  const location = useLocation();
  const { pathname } = location;

  const isProjectsPage = pathname.includes('/projects');

  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  }

  const toggleSubmenu = (event) => {
    if (window.innerWidth < 700) {
      event.stopPropagation();
      setSubmenuOpen(!submenuOpen);
    }
  }

  const activeLink = ({ isActive }) => (isActive ? 'active-link' : '');

  return (
    <nav>
      <div className='menu-bar' onClick={toggleMenu}>
        <div id='bar1' className={`bar ${menuOpen ? 'change' : ''}`}></div>
        <div id='bar2' className={`bar ${menuOpen ? 'change' : ''}`}></div>
        <div id='bar3' className={`bar ${menuOpen ? 'change' : ''}`}></div>
      </div>
      <ul className={`navbar-list ${menuOpen ? 'active' : ''}`}>
        <li><NavLink to="/" className={activeLink}>Home</NavLink></li>
        <li><NavLink to="/about" className={activeLink}>About</NavLink></li>
        <li id='projects-dropdown' className={`projects-dropdown ${isProjectsPage ? 'active-link' : ''}`} onClick={toggleSubmenu} style={{ borderBottom: submenuOpen ? 'none' : '1px solid #dedcdc' }}>Projects
          <ExpandMoreIcon />
          <ul className={`submenu ${submenuOpen ? 'active' : ''}`}>
            <li><NavLink to="/projects/youth_exchange" className={activeLink}>Youth Exchanges</NavLink></li>
            <li><NavLink to="/projects/training_course" className={activeLink}>Training Courses</NavLink></li>
            <li><NavLink to="/projects/european_solidarity_corps" className={activeLink}>ESC</NavLink></li>
            <li><NavLink to="/projects/solidarity_projects" className={activeLink}>Solidarity projects</NavLink></li>
            <li><NavLink to="/projects/other" className={activeLink}>Local activities</NavLink></li>
          </ul>
        </li>
        <li><NavLink to="/news" className={activeLink}>News</NavLink></li>
        <li><NavLink to="/blog" className={activeLink}>Blog</NavLink></li>
        <li><NavLink to="/contact" className={activeLink}>Contact</NavLink></li>
      </ul>
    </nav>
  )
}

export default Navbar;