import React, { useContext } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { formatISO } from 'date-fns';
import { BookingContext } from '@/context/bookingContext'; // A helyes kontextus importálása

export default function BookingForm({id, date, closeModal}) {
    
    const { addBooking } = useContext(BookingContext);
    
    const serviceId = id; // Példa szolgáltatás ID
    const userId = "65f8022677284e2c1d8caa48"; // Vendég felhasználói ID
     const selectedDate = date;

    

     const handleSubmit = async () => {
        const bookingData = {
            serviceId,
            userId,
            date: formatISO(selectedDate),
        };
       
        console.log(bookingData)

        await addBooking(bookingData)
        closeModal()
    };

    return (
        < >
            <button onClick={handleSubmit} type="submit">Foglalás</button>
        </>
    );
}
