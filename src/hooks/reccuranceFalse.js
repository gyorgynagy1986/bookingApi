//import moment from 'moment-timezone';
//
//export default function generateCalendarEvents(services) {
//  const events = services.map(service => {
//    if (!service.recurrence) {
//
//   
//
//      // Az availableFrom és availableTo dátumokat Date objektumokká alakítjuk
//      const start = moment(service.availableFrom).toDate();
//      const end = moment(service.availableTo).toDate();
//
//      console.log(start)
//      console.log(end)
//
//      return {
//        title: service.name,
//        start: start, // Date objektum
//        end: end, // Date objektum
//        allDay: true,
//        serviceId: service._id,
//        desc: service.description,
//        visible: service.visible,
//      };
//    }
//  })
//
//  return events;
//}
//