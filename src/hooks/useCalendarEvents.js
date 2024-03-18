import { useContext, useState, useEffect } from "react";
import { BookingContext } from '@/context/bookingContext';
import moment from 'moment-timezone';

const useCalendarEvents = () => {
  const { services } = useContext(BookingContext);
  
  const [events, setEvents] = useState([]);

  console.log(events)

  useEffect(() => {
    const tempEvents = [];

    services.forEach(service => {
      // Generálj egy objektumot minden napra az intervallumban a maxSlots értékkel
      const daysRange = generateDaysRange(service.availableFrom, service.availableTo, service.maxSlots);
      // Egyesítsd az alapértelmezett napokat az availableSlotsPerDay adataival
      const fullAvailableSlotsPerDay = { ...daysRange, ...service.availableSlotsPerDay };

      Object.entries(fullAvailableSlotsPerDay).forEach(([date, availableSlots]) => {
        const timeZone = 'Europe/Budapest';
        let startDateTime = moment.tz(date + 'T' + service.startTime, timeZone).toDate();
        let endDateTime = moment.tz(date + 'T' + service.endTime, timeZone).toDate();

        const dayEvent = {
          title: service.name,
          start: startDateTime,
          end: endDateTime,
          date: date,
          startTime: service.startTime,
          endTime: service.endTime,
          allDay: false,
          serviceId: service._id,
          desc: service.description,
          availableSlots,
          recurrence: service.recurrence
        };

        tempEvents.push(dayEvent);
      });
    });

    setEvents(tempEvents);
  }, [services]);

  return events;
};

// Generál egy objektumot minden napra a megadott intervallumban a maxSlots értékkel
function generateDaysRange(start, end, maxSlots) {
  let days = {};
  let currentDate = moment(start);
  const stopDate = moment(end);

  while (currentDate <= stopDate) {
    days[currentDate.format('YYYY-MM-DD')] = maxSlots;
    currentDate = currentDate.add(1, 'days');
  }

  return days;
}
export default useCalendarEvents;


