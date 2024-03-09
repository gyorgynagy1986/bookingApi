import connect from "@/lib/db";
import Appointment from "@/models/Appointment";
import Service from "@/models/Service";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req = NextRequest) => {
  // const { serviceId, date, userId } = req.json();

  const body = await req.json();

  const { serviceId, date, userId } = body;

  const requestedDate = new Date(date);

  try {
    await connect();

    const service = await Service.findById(serviceId);

    if (!service) {
      return NextResponse({ status: 404, statusText: "Service not found" });
    }

    const availableFrom = new Date(service.availableFrom);
    const availableTo = new Date(service.availableTo);
    if (requestedDate < availableFrom || requestedDate > availableTo) {
      return new NextResponse(
        JSON.stringify({
          error: "The requested date is out of the available range.",
        }),
        { status: 400 },
      );
    }

    const appointmentsOnDate = await Appointment.find({
      service: serviceId,
      date: requestedDate,
    });

    if (appointmentsOnDate.length >= service.maxSlots) {
      return new NextResponse(
        JSON.stringify({
          error: "No available slots for this service on the selected date",
        }),
        { status: 400 },
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "USer Not found" }), {
        status: 404,
      });
    }

    const newAppointment = new Appointment({
      user: userId,
      service: serviceId,
      date: new Date(date),
    });

    await newAppointment.save();

    return new NextResponse(JSON.stringify(newAppointment), { status: 201 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Error processing request" }),
      { status: 500 },
    );
  }
};


export const GET = async () => {
  
  try {
    await connect();
    const appointment = await Appointment.find({});

    return new NextResponse(
      JSON.stringify({
        appointment,
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