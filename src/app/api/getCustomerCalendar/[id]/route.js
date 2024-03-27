import connect from "@/lib/db";
import Service from "@/models/Service";
import Appointment from "@/models/Appointment";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req) => {
    await connect();
  
    const { pathname } = req.nextUrl;
    const companyName = pathname.split('/').pop();

    try {
        const services = await Service.find({companyName});
      
        if (!services.length) {
            return new NextResponse(JSON.stringify({ success: false, error: "Service not found." }), { status: 404 });
        }
        
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

      
          return new NextResponse(JSON.stringify({ data: servicesWithAvailableSlots }), { status: 200 });
        } catch (error) {
          console.error("Error processing request:", error);
          return new NextResponse(JSON.stringify({ error: error }), { status: 500 });
        }
      };
      