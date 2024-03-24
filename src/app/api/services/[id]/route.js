import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db'; 
import Service from '../../../../models/Service'; 

export const DELETE = async(req = NextRequest) => {
  
    await dbConnect();
  
  const { pathname } = req.nextUrl;

  if (req.method !== 'DELETE') {
    return new NextResponse(JSON.stringify({ error: `Módszer ${req.method} nem engedélyezett.` }), { status: 405 });
  }

  // Az ID kinyerése az URL-ből
  const id = pathname.split('/').pop();

  try {
    const deletedAppointment = await Service.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return new NextResponse(JSON.stringify({ success: false, error: "A szolgáltatás nem található." }), { status: 404 });
    }
    return new NextResponse(JSON.stringify({ success: true, data: {} }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}


export const GET = async (req = NextRequest) => {
  await dbConnect();

  const { pathname } = req.nextUrl;

  if (req.method !== 'GET') {
      return new NextResponse(JSON.stringify({ error: `Method ${req.method} not allowed.` }), { status: 405 });
  }

  // Extract the ID from the URL
  const id = pathname.split('/').pop();

  try {
      const service = await Service.findById(id);
      if (!service) {
          return new NextResponse(JSON.stringify({ success: false, error: "Service not found." }), { status: 404 });
      }
      return new NextResponse(JSON.stringify({ success: true, data: service }), { status: 200 });
  } catch (error) {
      return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}


// PUT művelet a szolgáltatás adatainak frissítésére
export const PUT = async (req = NextRequest) => {
    await dbConnect();

    const { pathname } = req.nextUrl;

    if (req.method !== 'PUT') {
        return new NextResponse(JSON.stringify({ error: `Method ${req.method} not allowed.` }), { status: 405 });
    }

    // Az ID kinyerése az URL-ből
    const id = pathname.split('/').pop();

    try {
        // A kérés törzsének kinyerése
        const body = await req.json();

        // A szolgáltatás keresése és frissítése a kapott adatokkal
        const updatedService = await Service.findByIdAndUpdate(id, body, { new: true });
        if (!updatedService) {
            return new NextResponse(JSON.stringify({ success: false, error: "Service not found." }), { status: 404 });
        }
        return new NextResponse(JSON.stringify({ success: true, data: updatedService }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ success: false, error: error.message }), { status: 400 });
    }
};
