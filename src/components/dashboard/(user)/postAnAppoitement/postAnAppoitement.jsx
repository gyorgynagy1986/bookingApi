import React, { useContext } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { formatISO } from 'date-fns';
import { BookingContext } from '@/context/bookingContext'; // A helyes kontextus importálása
import {useSession } from "next-auth/react";

export default function BookingForm({id, date, closeModal}) {
   
    const session = useSession();

    const { addBooking } = useContext(BookingContext);
    
     const serviceId = id; // Példa szolgáltatás ID
     const userId = session?.data?.user?._id; // Vendég felhasználói ID
     const selectedDate = date;

     const handleSubmit = async () => {
        const bookingData = {
            serviceId,
            userId,
            date: formatISO(selectedDate),
        };
        await addBooking(bookingData)
        closeModal()
    };

    return (
        < >
           {session?.status === 'unauthenticated' && <button type="submit"> <a href='/dashboard/login'>Login</a></button>}
           {session?.status === 'authenticated' && <button onClick={handleSubmit} type="submit">foglalás</button>}
        </>
    );
}
//{ session.status === 'authenticated' ?  <button onClick={handleSubmit} type="submit">Foglalás</button> : <link href='/dashboard/login' >login</link>}
