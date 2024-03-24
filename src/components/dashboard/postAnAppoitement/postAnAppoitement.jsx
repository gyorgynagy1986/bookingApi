import React, { useContext } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { formatISO } from 'date-fns';
import { BookingContext } from '@/context/bookingContext'; // A helyes kontextus importálása

export default function BookingForm({id, date, closeModal}) {
    
    const { addBooking } = useContext(BookingContext);
    
    const serviceId = id; // Példa szolgáltatás ID
    const userId = "65fff197a735acc1969a842c"; // Vendég felhasználói ID
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
            <button onClick={handleSubmit} type="submit">Foglalás</button>
        </>
    );
}
