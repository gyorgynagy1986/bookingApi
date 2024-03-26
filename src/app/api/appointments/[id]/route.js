import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db'; 
import Appointment from '../../../../models/Appointment'; 

export const DELETE = async(req = NextRequest) => {
  
    await dbConnect();
  
  const { pathname } = req.nextUrl;

  if (req.method !== 'DELETE') {
    return new NextResponse(JSON.stringify({ error: `Módszer ${req.method} nem engedélyezett.` }), { status: 405 });
  }

  // Az ID kinyerése az URL-ből
  const id = pathname.split('/').pop();

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return new NextResponse(JSON.stringify({ success: false, error: "Foglalás nem található." }), { status: 404 });
    }
    return new NextResponse(JSON.stringify({ success: true, data: {} }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}



export const GET = async(req = NextRequest) => {
  
await dbConnect();

const { pathname } = req.nextUrl;

if (req.method !== 'GET') {
  return new NextResponse(JSON.stringify({ error: `Módszer ${req.method} nem engedélyezett.` }), { status: 405 });
}

// Az ID kinyerése az URL-ből
const id = pathname.split('/').pop();

try {
  const deletedAppointment = await Appointment.findById({user});
  if (!deletedAppointment) {
    return new NextResponse(JSON.stringify({ success: false, error: "Foglalás nem található." }), { status: 404 });
  }
  return new NextResponse(JSON.stringify({ success: true, data: {} }), { status: 200 });
} catch (error) {
  return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 400 });
}
}
