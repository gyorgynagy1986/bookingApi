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
      // availableFrom: { $gte: today },
    });

    const servicesWithAvailableSlots = await Promise.all(services.map(async (service) => {
      const bookingsAggregation = await Appointment.aggregate([
        // Csak azokat a foglalásokat szűrjük, amik a szolgáltatáshoz tartoznak
        { $match: { service: service._id } },
        // Csoportosítás dátum szerint, hogy megtudjuk hány foglalás van minden egyes napon
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
              day: { $dayOfMonth: "$date" },
            },
            bookedSlots: { $sum: 1 },
          },
        },
        // Formázzuk az adatokat, hogy megkapjuk a kívánt kimenetet
        {
          $project: {
            _id: 0,
            date: {
              $concat: [
                { $toString: "$_id.year" }, "-",
                { $cond: [{ $lt: ["$_id.month", 10] }, "0", ""] },
                { $toString: "$_id.month" }, "-",
                { $cond: [{ $lt: ["$_id.day", 10] }, "0", ""] },
                { $toString: "$_id.day" }
              ],
            },
            bookedSlots: 1,
          },
        },
        // Rendezzük dátum szerint
        { $sort: { date: 1 } },
      ]);

      // Naponta elérhető helyek kiszámítása
      const availableSlotsPerDay = {};
      
      bookingsAggregation.forEach(booking => {
        const dateKey = booking.date; // "YYYY-MM-DD"
        availableSlotsPerDay[dateKey] = service.maxSlots - booking.bookedSlots;
      });

      return {
        ...service.toObject(),
        availableSlotsPerDay,
      };
    }));

    return new NextResponse(JSON.stringify({ services: servicesWithAvailableSlots }), { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse(JSON.stringify({ error: error }), { status: 500 });
  }
};



export const POST = async (req, res) => {
  try {
    const body = await req.json();

    console.log(body)
    
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
      JSON.stringify({ error: error }),
      { status: 500 },
    );
  }
};