"use client";

import { Calendar, momentLocalizer } from "react-big-calendar";
import useSWR from "swr";
import moment from "moment";

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

const fetcher = (url) => fetch(url).then((res) => res.json());

const CalendarUi = () => {
 
  // Data fetching using SWR
  const { data: bookedDaysData, error: bookedDaysError } = useSWR("api/getFullyBookedDays",fetcher,);
  const { data: servicesData, error: servicesError } = useSWR("api/services",fetcher,);
  
  // Custom hooks 
  const { events, fullyBookedDays } = useCalendarEvents(bookedDaysData,servicesData); // Display days in calendar
  const eventPropGetter = useEventStyles(fullyBookedDays); // Mard red the fully booked days
  const customComponents = useCustomEventComponents(); // Adding description of services in Week nad day view 

  if (bookedDaysError || servicesError) return <div>failed to load</div>;
  if (!bookedDaysData || !servicesData) return <div>loading...</div>;

  return (
    <>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        // toolbar={false}
        components={customComponents}
        eventPropGetter={eventPropGetter}
        // length={1}
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
    </>
  );
};

export default CalendarUi;
