"use client"


import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import styles from './Users.module.css';
import Button from 'react-bootstrap/Button';

const fetcher = (...args) => fetch(...args).then(res => res.json());

const Appointments = () => {
  const { data, error } = useSWR('/api/users', fetcher);
  const [selectedService, setSelectedService] = useState(null);

    console.log(data)

  const deleteService = async (id) => { 
    try {
        await fetch(`/api/users/${id}`, { method: 'DELETE' });
        // Manually revalidate the data after deletion
        mutate('/api/users');
    } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Hiba történt a törlés során.');
    }
};

  if (error) return <div>Hiba történt az adatok betöltése közben.</div>;
  if (!data) return <div>Betöltés...</div>;



  const handleDelete = (id) => {
    setSelectedService(id);
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(id);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Név</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Telefonszám</th>
            <th className={styles.th}>Dátum</th>
          </tr>
        </thead>
        <tbody>
         {data && data.getAllUser.map(user => (
            <tr key={user._id}>
              <td className={styles.td}>{user.name}</td>
              <td className={styles.td}>{user.email}</td>
              <td className={styles.td}>{user.phone}</td>
              <td className={styles.td}>
                <button onClick={() => handleDelete(user._id)}>Törlés</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Appointments;



