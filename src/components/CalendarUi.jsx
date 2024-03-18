"use client";

import React, {useState} from 'react';
import { Calendar, dateFnsLocalizer  } from "react-big-calendar";
import moment from "moment";
import { useBookings } from '@/context/bookingContext'; // Feltételezve, hogy a BookingContext fájlodban van definiálva
import useCalendarEvents from '@/hooks/useCalendarEvents';
import EventModal from './modals/Modal';
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import startOfWeek from 'date-fns/startOfWeek'
import hu from 'date-fns/locale/hu'
import getDay from 'date-fns/getDay'

// CSS for calendar
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/hu";

// Custom hooks
 import useEventStyles from "@/hooks/calendarEventColorHandler";
 import useCustomEventComponents from '@/hooks/managedCalendarDataInWeekAndDayView';

 const locales = {
  'hu': hu,
}

 const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

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
  const eventPropGetter = useEventStyles(fullyBookedDays, services);
  const customComponents = useCustomEventComponents();
  
 // function generateFlexibleRecurringEvents(start, end, repeat = 'daily', daysOfWeek = [] ) {
 //   let events2 = [];
 //   let currentDate = moment(start);
 // 
 //   while (currentDate <= moment(end)) {
 //     if (repeat === 'daily' || 
 //         (repeat === 'weekly' && daysOfWeek.includes(currentDate.day()))) {
 //       events2.push({
 //         title: repeat === 'daily' ? 'Napi ismétlődő esemény' : 'Heti ismétlődő esemény',
 //         start,
 //         end,
 //         allDay: true,
 //       });
 //     }
 //     currentDate.add(1, 'days');
 //   }
 // 
 //   return events2;
 // }
  
  // Minden napi esemény generálása
  // const dailyEvents = generateFlexibleRecurringEvents('2024-01-01', '2024-12-31');
  
  // Csak bizonyos napokon (pl. hétfőn és szerdán) ismétlődő események generálása
  // Hétfő = 1, szerda = 3
  // const weeklyEventsOnSpecificDays = generateFlexibleRecurringEvents(events.start, events.end, 'weekly', []);


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
