import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiLogOut, FiHome, FiBook, FiChevronDown } from "react-icons/fi";

import styles from './Sidebar.module.css';

const Sidebar = () => {
  const location = useLocation();
  const [schoolsOpen, setSchoolsOpen] = useState(false);

  return (
    <aside className={styles.sidebar} >
      <nav className={styles.nav}>
        <Link 
          to="/dashboard" 
          className={`${styles.menuItem} ${location.pathname === '/dashboard' ? styles.active : ''}`}
        >
          <FiHome className={styles.icon} />
          <span>Dashboard</span>
        </Link>

         <Link 
          to="/schoolsPage" 
          className={`${styles.menuItem} ${location.pathname === '/schoolsPage' ? styles.active : ''}`}
        >
          <FiHome className={styles.icon} />
          <span>Schools</span>
        </Link>

        <Link 
          to="/coursePage" 
          className={`${styles.menuItem} ${location.pathname === '/coursePage' ? styles.active : ''}`}
        >
          <FiHome className={styles.icon} />
          <span>Courses</span>
        </Link>
        
       
      </nav>
    </aside>
  );
};

export default Sidebar;