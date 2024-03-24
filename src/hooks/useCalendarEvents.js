import moment from 'moment-timezone';

function generateDaysRange(start, end, maxSlots, recurrenceDays, availableSlotsPerDay) {
    let days = {};
    let currentDate = moment(start).startOf('day');
    const stopDate = moment(end).startOf('day');
    
    while (currentDate <= stopDate) {
      const formattedDate = currentDate.format('YYYY-MM-DD');
      if (recurrenceDays.includes(currentDate.day())) {
        days[formattedDate] = availableSlotsPerDay.hasOwnProperty(formattedDate) ? availableSlotsPerDay[formattedDate] : maxSlots;
      }
      currentDate = currentDate.add(1, 'days');
    }
    
    return days;
  }


// Main function to generate calendar events based on services data
function generateCalendarEvents(services) {
  const events = [];
  
  services.forEach(service => {
      // Generate days range considering recurrenceDays and availableSlotsPerDay
      const daysRange = generateDaysRange(service.availableFrom, service.availableTo, service.maxSlots, service.recurrenceDays, service.availableSlotsPerDay);

      Object.entries(daysRange).forEach(([date, availableSlots]) => {

          
          let startDateTime = moment(date + 'T' + service.startTime).toDate();
          let endDateTime = moment(date + 'T' + service.endTime).toDate();
          
          const dayEvent = {
              title: service.name,
              start: startDateTime,
              end: endDateTime,
              date: date,
              startTime: service.startTime,
              endTime: service.endTime,
              serviceId: service._id,
              desc: service.description,
              availableSlots,
              recurrence: service.recurrence,
              visible: service.visible
            };
            
            events.push(dayEvent);

      });
  });

  return events;
}

export default generateCalendarEvents
