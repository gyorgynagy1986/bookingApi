import connect from "../../../lib/db";
import Service from "../../../models/Service";
import Appointment from "@/models/Appointment";
import moment from 'moment-timezone';

import { NextRequest, NextResponse } from "next/server";


export const GET = async () => {
  await connect();
  
  try {

    // const today = new Date();
    // today.setHours(0, 0, 0, 0); 

    const services = await Service.find({
   //   availableFrom: { $gte: today },
    });

    const servicesWithAvailableSlots = await Promise.all(
      services.map(async (service) => {
        // Kiszámoljuk az összes napot az időintervallumban
        const daysInRange = getDaysArray(service.availableFrom, service.availableTo);


        const availableSlotsPerDay = {};

        await Promise.all(
          daysInRange.map(async (day) => {
            // Foglalások számának meghatározása az adott napon
            const bookingsForDay = await Appointment.find({
              service: service._id,
              date: {
                $gte: new Date(day),
                $lt: new Date(new Date(day).setDate(new Date(day).getDate() +1)),
              },

            });

            const bookedSlots = bookingsForDay.length;
            const availableSlots = service.maxSlots - bookedSlots;

            // Naponta elérhető helyek hozzáadása az objektumhoz
            availableSlotsPerDay[day.toISOString().split('T')[0]] = availableSlots;
          })
        );


        return {
          ...service.toObject(),
          availableSlotsPerDay,
        };
      })
    );

    return new NextResponse(JSON.stringify({ services: servicesWithAvailableSlots }), { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse(JSON.stringify({ error: "Error processing request" }), { status: 500 });
  }
};

// Segédfüggvény az időintervallum összes napjának meghatározásához
function getDaysArray(start, end) {
  let arr = [];
  let dt = new Date(start);
  end = new Date(end);

  while (dt <= end) {
    arr.push(new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())));
    dt.setUTCDate(dt.getUTCDate() + 1);
  }
  return arr;
}


export const POST = async (req, res) => {
  try {
    const body = await req.json();
    
 // Az időzóna konstansok definiálása
    const LOCAL_TIMEZONE = 'Europe/Budapest';
    const UTC_TIMEZONE = 'UTC';

      // A dátumok átalakítása a helyi időzóna napjának kezdetére és végére
      const convertToLocalDayStartEnd = (date, isStartOfDay) => {
          const formattedDate = moment.tz(date, LOCAL_TIMEZONE);
          if (isStartOfDay) {
              return formattedDate.startOf('day').tz(UTC_TIMEZONE, true).format();
          } else {
              return formattedDate.endOf('day').tz(UTC_TIMEZONE, true).format();
          }
      };

      // Konvertálás és kiíratás
      const availableFromUTC = convertToLocalDayStartEnd(body.availableFrom, true);
      const availableToUTC = convertToLocalDayStartEnd(body.availableTo, false);

      const newServiceData = {
          ...body,
            availableFrom: availableFromUTC, // '00:00:00.000Z'
            availableTo: availableToUTC,     // '23:59:59.999Z'
            
      };


    const newService = new Service(newServiceData);

    await connect();
    await newService.save();

    return new NextResponse(
      JSON.stringify({
        newService,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Error processing request" }),
      { status: 500 },
    );
  }
};