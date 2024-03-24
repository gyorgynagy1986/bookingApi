"use client";

import React, {useState} from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useBookings } from '@/context/bookingContext'; // Feltételezve, hogy a BookingContext fájlodban van definiálva
import useCalendarEvents from '@/hooks/useCalendarEvents';
// import useCalendarEventsrecurrenceFalse from '@/hooks/reccuranceFalse';
import EventModal from './modals/Modal';
import 'moment-timezone' 

// CSS for calendar
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/hu";

// Custom hooks
 import useEventStyles from "@/hooks/calendarEventColorHandler";
 import useCustomEventComponents from '@/hooks/managedCalendarDataInWeekAndDayView';


 moment.tz.setDefault()



const localizer = momentLocalizer(moment)

const CalendarUi = () => {
  const { services, fullyBookedDays } = useBookings()


  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Esemény kiválasztása esetén megjelenítjük a modális dialógust az esemény részleteivel
  const handleSelectEvent = (events) => {
    setSelectedEvent(events);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  
  // Az események és teljesen lefoglalt napok kiszámítása a kontextusból származó adatok alapján
   const events = useCalendarEvents(services);
  //const events2 = useCalendarEventsrecurrenceFalse(services)
  const eventPropGetter = useEventStyles(fullyBookedDays, services);
  const customComponents = useCustomEventComponents();
  
  //const calendarEvents = [
  //   ...events2, 
  //]
  
  console.log(events)

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
        style={{ height: '100vh' }}
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
          event: "Esemény",
          noEventsInRange: "Nincsenek események ebben az időszakban.",
        }}
      />
      <EventModal
        open={modalOpen}
        onClose={handleCloseModal}
        event={selectedEvent} />
      {/* Ide kerülhet a modális dialógusod a kiválasztott esemény részleteivel */}
    </>
  );
};

export default CalendarUi;
