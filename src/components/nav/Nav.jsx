"use client"

import Link from 'next/link';
import React, { useState } from 'react';
import {useSession } from "next-auth/react";
import styles from './Navbar.module.css'; // Make sure the path matches your file structure
import { signOut } from "next-auth/react"

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const session = useSession();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
         <Link href="/">CALENDAR VIEW</Link>
          <Link href="/dashboard/addAservice">Add a service</Link>
          <div className={styles.dropdown} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          Listing (only admin : rule does not set yet) <span className={styles.dropdownIndicator}>▼</span>
          <div className={`${styles.dropdownContent} ${isDropdownOpen ? styles.show : ''}`}>
            <Link href="/dashboard/getAllAppointments">Appointments</Link>
            <Link href="/dashboard/getAllServices">Services</Link>
            <Link href="/dashboard/users">Users</Link>
            {/* Add more dropdown links as needed */}
          </div>
        </div>
        <div className={styles.userlink}>{ session.status === 'authenticated' && <a href='/dashboard/my-page'>{session?.data?.user?.name}</a> } { session.status === 'authenticated' &&  <button onClick={() => signOut()}>Sign out</button>}</div>
       <div>{ session.status === 'unauthenticated' && <Link href="/dashboard/login">Login</Link>}</div>
      </div>
    </nav>
  );
};

export default Navbar;

