import { useContext, useState, useEffect } from "react";
import { BookingContext } from '@/context/bookingContext';
import moment from 'moment-timezone';

const useCalendarEvents = () => {
  const { services } = useContext(BookingContext);
  const [events, setEvents] = useState([]);


  useEffect(() => {
    const tempEvents = [];

    services.forEach(service => {
      Object.entries(service.availableSlotsPerDay).forEach(([date, availableSlots]) => {
        // Itt állítjuk be a magyar időzónát
        const timeZone = 'Europe/Budapest';
        let startDateTime = moment.tz(date + 'T' + service.startTime, 'Europe/Budapest').toDate();
        let endDateTime = moment.tz(date + 'T' + service.endTime, timeZone).toDate();

        const dayEvent = {
          title: service.name ,
          start: startDateTime,
          end: endDateTime,
          date: date,
          startTime: service.startTime,
          endTime: service.endTime,
          allDay: false, // Ha szeretnéd, hogy az egész napos eseményként ne jelenjen meg
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

export default useCalendarEvents;



//import { useContext, useState, useEffect } from "react";
//import { BookingContext } from '@/context/bookingContext';
//import moment from 'moment';
//
//const useCalendarEvents = () => {
//  const { services } = useContext(BookingContext);
//  const [events, setEvents] = useState([]);
//
//console.log(services)
//
//  useEffect(() => {
//    const tempEvents = [];
//
//    services.forEach(service => {
//      Object.entries(service.availableSlotsPerDay).forEach(([date, availableSlots]) => {
//        let startDateTime = moment(date + 'T' + service.startTime).toDate();
//        let endDateTime = moment(date + 'T' + service.endTime).toDate();
//    
//        console.log(startDateTime)
//        console.log(endDateTime)
//
//        const dayEvent = {
//          title: `${service.name} (${availableSlots} hely elérhető)`,
//          start: startDateTime,
//          end: endDateTime,
//          allDay: false,
//          serviceId: service._id,
//          desc: service.description,
//          availableSlots
//        };
//    
//        tempEvents.push(dayEvent);
//      });
//    });
//
//    setEvents(tempEvents);
//  }, [services]);
//
//  return events;
//};
//
//export default useCalendarEvents;
