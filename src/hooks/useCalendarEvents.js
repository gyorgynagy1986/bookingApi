import { useContext, useState, useEffect } from "react";
import { BookingContext } from '@/context/bookingContext';

const useCalendarEvents = () => {
  const { services, fullyBookedDays, appointments} = useContext(BookingContext);

  
  const [events, setEvents] = useState([]);


  useEffect(() => {
    const newEvents = services?.flatMap(service => {
      const serviceEvents = [];
      let currentDate = new Date(service.availableFrom);
      const endDate = new Date(service.availableTo);

      while (currentDate <= endDate) {
        const dayKey = currentDate.toISOString().split('T')[0];
        const availableSlotsForDay = service.availableSlotsPerDay[dayKey] ?? 0;
        
     //   if (availableSlotsForDay > 0) {   // Ez nem jeleníti meg a lefoglalt napokat 
          const start = new Date(currentDate.setHours(parseInt(service.startTime.split(":")[0]), parseInt(service.startTime.split(":")[1])));
          const end = new Date(currentDate.setHours(parseInt(service.endTime.split(":")[0]), parseInt(service.endTime.split(":")[1])));

          serviceEvents.push({
            title: `${service.name} (${availableSlotsForDay} hely elérhető)`,
            start,
            end,
            allDay: false,
            serviceId: service._id,
            desc: service.description,
            availableSlots: availableSlotsForDay
          });
 //        }

        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      }

      return serviceEvents;
    });

    setEvents(newEvents ?? []);
  }, [services, fullyBookedDays, appointments]);

  return events;
};

export default useCalendarEvents;
