"use client"

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import styles from './Appointments.module.css';
import { useBookings } from '@/context/bookingContext'; // Feltételezve, hogy a BookingContext fájlodban van definiálva


const fetcher = (...args) => fetch(...args).then(res => res.json());

const GetMyAppoitements = () => {
  
  const { userSession } = useBookings() 
  
  const { data, error } = useSWR(`/api/appointments/${userSession?._id}`, fetcher);

  const [selectedService, setSelectedService] = useState(null);

  const deleteService = async (id) => { 
    try {
        await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
        // Manually revalidate the data after deletion
        mutate('/api/appointments');
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
      <h1>FOGLALÁSAIM</h1>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Név</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Szolgáltatás</th>
            <th className={styles.th}>Dátum</th>
            <th className={styles.th}>Műveletek</th>
          </tr>
        </thead>
        <tbody>
         {data && data?.data?.map(appointment => (
            <tr key={appointment._id}>
              <td className={styles.td}>{appointment.userName}</td>
              <td className={styles.td}>{appointment.userEmail}</td>
              <td className={styles.td}>{appointment.serviceName}</td>
              <td className={styles.td}>{new Date(appointment.date).toLocaleDateString('hu-HU')}</td>
              <td className={styles.td}>
                <button onClick={() => handleDelete(appointment?._id)}>Törlés</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetMyAppoitements;



