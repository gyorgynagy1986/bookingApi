"use client"

import React, { createContext, useContext, useState } from 'react';
import useSWR, { mutate } from 'swr';

export const BookingContext = createContext();

const fetcher = (...args) => fetch(...args).then(res => res.json());

export const BookingProvider = ({ children }) => {
    // Az SWR hook használata a szolgáltatások és teljesen lefoglalt napok lekérdezéséhez
    const { data: servicesData, error: servicesError } = useSWR("/api/services", fetcher);
    const { data: fullyBookedDaysData, error: fullyBookedDaysError } = useSWR("/api/getFullyBookedDays", fetcher);
    
    console.log(servicesData)


    if (!servicesData) return <div>Loading...</div>

    const addBooking = async (bookingData) => {
        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });
            if (!response.ok) throw new Error('Booking failed.');
            mutate('/api/services'); // revalidate = true
            mutate('/api/getFullyBookedDays'); // revalidate = true
            
            // SWR will take care of caching and updates
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };

    // Check for any data fetching errors
    if (servicesError || fullyBookedDaysError) {
        console.error('Error fetching data:', servicesError || fullyBookedDaysError);
    }

    // Pass down the SWR data and the addBooking function through context
    return (
        <BookingContext.Provider value={{ services: servicesData?.services, fullyBookedDays: fullyBookedDaysData, addBooking}}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBookings = () => useContext(BookingContext);