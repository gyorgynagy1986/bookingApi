"use client";

import React, { useState } from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import useSWR from 'swr'
import moment from "moment";
import EventModal from './modals/Modal';

// CSS for calendar
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/hu";

// Custom hooks 
import useEventStyles from "@/hooks/calendarEventColorHandler";
import useCalendarEvents from "@/hooks/allocationOfCalendarDays";
import useCustomEventComponents from '@/hooks/managedCalendarDataInWeekAndDayView'; // Feltételezve, hogy ide mentetted el a hookot

// Language handler for calendar
moment.locale("hu");
const localizer = momentLocalizer(moment);

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const CalendarUi = ({servicesData}) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

   // Data fetching using SWR
  const { data: bookedDaysData, error: bookedDaysError } = useSWR("api/getFullyBookedDays",fetcher, {
    //refreshInterval: 3000
  }
  );
  
  //const { data: servicesData, error: servicesError } = useSWR("api/services", fetcher, {
  //  // revalidateOnFocus: true
  //});

  // Custom hooks 
  const { events, fullyBookedDays } = useCalendarEvents(bookedDaysData,servicesData); // Display the data in the calendar
  const eventPropGetter = useEventStyles(fullyBookedDays); // Mark red the fully booked days
  const customComponents = useCustomEventComponents(); // Adding description of services in the Week nad day view 

  // if (bookedDaysError || servicesError) return <div>failed to load</div>;
  // if (!bookedDaysData || !servicesData) return <div>loading...</div>;

  

  // Modal handler

  const handleSelectEvent = (event) => {
    console.log(event)
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Calendar
        localizer={localizer}
        selectable={true}
        onSelectEvent={handleSelectEvent}
        events={events}
        startAccessor="start"
        endAccessor="end"
        components={customComponents}
        eventPropGetter={eventPropGetter}
        style={{ height: 1000 }}
        messages={{
          next: "Következő",
          previous: "Előző",
          today: "Ma",
          month: "Hónap",
          week: "Hét",
          day: "Nap",
          agenda: "Menetrend",
          date: "Dátum",
          time: "Idő",
          event: "Esemény", // Customizing text
          noEventsInRange: "Nincsenek események ebben az időszakban.",
          Sun: "Vasárnap",
          // Add other keys here to customize all text
        }}
      />
       {/* Modális dialógus az esemény részleteivel */}
       <EventModal
        open={modalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
    </>
  );
};

export default CalendarUi;
