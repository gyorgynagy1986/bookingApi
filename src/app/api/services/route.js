import connect from "../../../lib/db";
import Service from "../../../models/Service";
import Appointment from "@/models/Appointment";

import { NextRequest, NextResponse } from "next/server";



export const GET = async () => {
  await connect();

  try {
    const findServices = await Service.find({}); // Minden szolgáltatás lekérdezése
    const services = await Promise.all(findServices.map(async (service) => {
      const appointments = await Appointment.find({ service: service._id }); // A szolgáltatáshoz tartozó foglalások lekérdezése
      const bookedSlots = appointments.length;
      const availableSlots = service.maxSlots - bookedSlots;

      return {
        ...service.toObject(),
        bookedSlots,
        availableSlots,
      };
    }));

    return new NextResponse(
      JSON.stringify({
        services,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error processing request" }),
      { status: 500 },
    );
  }
};

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
