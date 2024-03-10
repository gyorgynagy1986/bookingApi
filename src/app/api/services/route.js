import connect from "../../../lib/db";
import Service from "../../../models/Service";
import Appointment from "@/models/Appointment";

import { NextRequest, NextResponse } from "next/server";


export const GET = async () => {
  await connect();

  try {
    const services = await Service.find({}); // Minden szolgáltatás lekérdezése

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
                $lt: new Date(new Date(day).setDate(new Date(day).getDate() + 1)),
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
  for(var arr=[], dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
    arr.push(new Date(dt));
  }
  return arr;
}

export const POST = async (req = NextRequest, res) => {
  try {
    const body = await req.json();
    const newService = new Service(body);

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
