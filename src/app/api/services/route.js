import connect from "../../../lib/db";
import Service from "../../../models/Service";
import Appointment from "@/models/Appointment";
import User from "@/models/User";

import { NextRequest, NextResponse } from "next/server";


export const GET = async () => {
  await connect();
  
  try {
    
  //  const today = new Date();
  //   today.setHours(0, 0, 0, 0);

    const services = await Service.find({
     // availableFrom: { $gte: today },
    });

    console.log(services)

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
    
      
      const elementsCount = Object.keys(availableSlotsPerDay).length;

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

    // Csatlakozás az adatbázishoz, ha még nem történt meg
    await connect();

    // Lekérdezzük a felhasználót az adatbázisból a userID alapján, hogy megszerezzük a cégnév információt
    const user = await User.findById(body.user).exec(); // Feltételezzük, hogy a userID a body részében van

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }),
        { status: 404 },
      );
    }

    // Létrehozzuk az új service-t, hozzáadjuk a cégnév információt
    const newService = new Service({
      ...body,
      companyName: user.businessName, // Hozzáadjuk a cégnévet
    });

    // Mentjük az új service-t
    await newService.save();

    return new NextResponse(
      JSON.stringify({
        message: "Service created successfully",
        newService,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: error.toString() }), // Jobb hibakezelés
      { status: 500 },
    );
  }
};



 // Az időzóna konstansok definiálása
 // const LOCAL_TIMEZONE = 'Europe/Budapest';
 // const UTC_TIMEZONE = 'UTC';

 //  // A dátumok átalakítása a helyi időzóna napjának kezdetére és végére
 //  const convertToLocalDayStartEnd = (date, isStartOfDay) => {
 //      const formattedDate = moment.tz(date, LOCAL_TIMEZONE);
 //      if (isStartOfDay) {
 //          return formattedDate.startOf('day').tz(UTC_TIMEZONE, true).format();
 //      } else {
 //          return formattedDate.endOf('day').tz(UTC_TIMEZONE, true).format();
 //      }
 //  };
 //  // Konvertálás és kiíratás
 //  const availableFromUTC = convertToLocalDayStartEnd(body.availableFrom, true);
 //  const availableToUTC = convertToLocalDayStartEnd(body.availableTo, false);

 //  const newServiceData = {
 //      ...body,
 //        availableFrom: availableFromUTC, // '00:00:00.000Z'
 //        availableTo: availableToUTC,     // '23:59:59.999Z'
 //  };

 //  console.log(availableFromUTC)