"use client";

import { useState, useEffect } from "react";

// Egyedi hook a naptár események és a teljesen lefoglalt napok kezelésére.
const useCalendarEvents = (bookedDaysData, servicesData) => {
  // A naptárban megjelenítendő események állapota.
  const [events, setEvents] = useState([]);
  // Egy objektum, ami nyilvántartja azokat a napokat, amikre minden időpont foglalt egy adott szolgáltatáshoz.
  const [fullyBookedDays, setFullyBookedDays] = useState({});

  useEffect(() => {
    // Feldolgozás: Teljesen lefoglalt napok.
    // Ellenőrizzük, hogy az adatok megfelelő struktúrájúak-e, és tömböt tartalmaznak-e.
    if (bookedDaysData && Array.isArray(bookedDaysData.fullyBookedDays)) {
      // Lefoglalt napok átalakítása egy objektummá, ahol a kulcs a szolgáltatás azonosítója, és a hozzá tartozó érték a lefoglalt napok tömbje.
      const bookedDays = bookedDaysData.fullyBookedDays.reduce((acc, item) => {
        if (!acc[item.serviceId]) {
          acc[item.serviceId] = [];
        }
        acc[item.serviceId].push(item.date);
        return acc;
      }, {});
      setFullyBookedDays(bookedDays);
    }

    // Feldolgozás: Szolgáltatásokból származó események.
    // Ellenőrizzük, hogy a szolgáltatási adatok megfelelő formátumban érkeztek-e.
    if (servicesData && Array.isArray(servicesData.services)) {
      // Események létrehozása minden szolgáltatási időszakra.
      const newEvents = servicesData.services.flatMap((service) => {
        console.log(service)
        const serviceEvents = [];
        let currentDate = new Date(service.availableFrom);
        const endDate = new Date(service.availableTo);

        // Létrehozunk egy eseményt minden egyes naphoz az elérhetőségi időszakon belül.
        while (currentDate <= endDate) {
          const start = new Date(currentDate);
          const end = new Date(currentDate);
          start.setHours(
            parseInt(service.startTime.split(":")[0], 10),
            parseInt(service.startTime.split(":")[1], 10),
            0,
          );
          end.setHours(
            parseInt(service.endTime.split(":")[0], 10),
            parseInt(service.endTime.split(":")[1], 10),
            0,
          );
          // Az esemény hozzáadása a tömbhöz, tartalmazza a szolgáltatás nevét, kezdő és befejező időpontot, azonosítót és leírást.
          serviceEvents.push({
            title: service.name + ' | Elérhető : ' + service.availableSlots + ' hely.',
            start,
            end,
            serviceId: service._id,
            desc: service.description,
          });

          // A következő napra ugrunk.
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return serviceEvents;
      });

      // Az állapot frissítése az újonnan létrehozott eseményekkel.
      setEvents(newEvents);
    }
  }, [bookedDaysData, servicesData]); // A hook függőségei, amelyek változásakor újra fut.

  // A hook által visszaadott értékek: események és teljesen lefoglalt napok.
  return { events, fullyBookedDays };
};

export default useCalendarEvents;
