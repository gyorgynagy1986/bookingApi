"use client"

import Link from 'next/link';
import React, { useState } from 'react';
import styles from './Navbar.module.css'; // Make sure the path matches your file structure

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
         <Link href="/">CALENDAR VIEW</Link>
          <Link href="/dashboard/addAservice">Add a service</Link>
          <div className={styles.dropdown} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          Listing <span className={styles.dropdownIndicator}>▼</span>
          <div className={`${styles.dropdownContent} ${isDropdownOpen ? styles.show : ''}`}>
            <Link href="/dashboard/getAllAppointments">Appointments</Link>
            <Link href="/dashboard/getAllServices">Services</Link>
            <Link href="/dashboard/users">Users</Link>
            {/* Add more dropdown links as needed */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

