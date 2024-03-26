import React from 'react'
import styles from './Sidebar.module.css';


const layout = ({children}) => {

    const alma = 'alma'

  return (
    <div className={styles.container}>
        <div className={styles.sidebar}>
        <li href="/">
            <a className={styles.link}>Foglalásaim</a>
        </li>
        <li href="/about">
            <a className={styles.link}>About</a>
        </li>
        <li href="/services">
            <a className={styles.link}>Services</a>
        </li>
        <li href="/contact">
            <a className={styles.link}>Contact</a>
        </li>
        </div>
    <div prop={alma} className={styles.fetchContainer}>
        {children}
    </div>
    </div>
  )
}

export default layout