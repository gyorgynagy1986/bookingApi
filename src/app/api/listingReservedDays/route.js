// pages/api/bookings/count.js
import connect from '@/lib/db';
import Booking from '@/models/Appointment';
import { NextResponse } from 'next/server';

export const GET = async () => {
  await connect();

  try {
    const bookingsCountByDate = await Booking.aggregate([
      {
        $group: {
          _id: { serviceId: "$serviceId", date: "$date" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          serviceId: "$_id.serviceId",
          date: "$_id.date",
          count: 1,
          _id: 0
        }
      }
    ]);

    return new NextResponse(JSON.stringify(bookingsCountByDate), { status: 200 });
  } catch (error) {
    console.error("Error fetching booking counts:", error);
    return new NextResponse(JSON.stringify({ error: "Error fetching booking counts" }), { status: 500 });
  }
};
