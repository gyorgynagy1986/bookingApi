import connect from "@/lib/db";
import Appointment from "@/models/Appointment";
import Service from "@/models/Service";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req = NextRequest) => {
  const body = await req.json();
  const { serviceId, date, userId } = body;
  
  const requestedDate = new Date(date);

  
  try {
    await connect();
    const service = await Service.findById(serviceId);
    

    if (!service) {
      return new NextResponse(JSON.stringify({ error: "Service not found" }), { status: 404 });
    }
    
    let requestedDateStartOfDay = new Date(requestedDate).setHours(0, 0, 0, 0);
    let serviceAvailableFromStartOfDay = new Date(service.availableFrom).setHours(0, 0, 0, 0);
    let serviceAvailableToStartOfDay = new Date(service.availableTo).setHours(0, 0, 0, 0);
    
    if (requestedDateStartOfDay < serviceAvailableFromStartOfDay || requestedDateStartOfDay > serviceAvailableToStartOfDay) {
        return new NextResponse(JSON.stringify({ error: "The requested date is out of the available range." }), { status: 400 });
    }

    // Újra ellenőrizzük a foglalások számát
    const appointmentsOnDate = await Appointment.find({ service: serviceId, date: { $gte: new Date(requestedDate.setHours(0,0,0,0)), $lt: new Date(requestedDate.setHours(23,59,59,999)) } });
    if (appointmentsOnDate.length >= service.maxSlots) {
      return new NextResponse(JSON.stringify({ error: "No available slots for this service on the selected date" }), { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const newAppointment = new Appointment({ user: userId, userName: user.name,  userEmail: user.email, serviceName: service.name,  service: serviceId, date: new Date(date) });
   
    await newAppointment.save();
    return new NextResponse(JSON.stringify(newAppointment), { status: 201 });
  } catch (error) {
    console.log(error)
    return new NextResponse(JSON.stringify({ error: "Error processing request" }), { status: 500 });
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