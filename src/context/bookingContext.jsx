"use client"

import React, { createContext, useContext, useState } from 'react';
import useSWR, { mutate } from 'swr';
import {useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';

export const BookingContext = createContext();

const fetcher = (...args) => fetch(...args).then(res => res.json());

export const BookingProvider = ({ children }) => {
    const session = useSession();
    const fullPath = usePathname();
    const slug = fullPath.split('/')[2];
    
    const { data: servicesData, error: servicesError } = useSWR("/api/services", fetcher);
    const { data: fullyBookedDaysData, error: fullyBookedDaysError } = useSWR("/api/getFullyBookedDays", fetcher);
    const { data: editData, error: editDataError } = useSWR("/api/editADayofService", fetcher);
    const { data: calendar,  error: calendarError } = useSWR(`/api/getCustomerCalendar/${slug}`, fetcher);

    if (!servicesData) return <div>Loading...</div>

    const addBooking = async (bookingData) => {

        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });
            if (!response.ok) throw new Error('Booking failed.');
            mutate('/api/services'); 
            mutate('/api/getFullyBookedDays'); 
            mutate(`/api/getCustomerCalendar/${slug}`)

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
        <BookingContext.Provider value={{ calendar: calendar?.data,  editData: editData?.data, services: servicesData?.services, fullyBookedDays: fullyBookedDaysData, addBooking, userSession: session?.data?.user}}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBookings = () => useContext(BookingContext);