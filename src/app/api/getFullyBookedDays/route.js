import connect from "../../../lib/db";
import Appointment from "../../../models/Appointment";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req, res = NextResponse) => {
  try {
    await connect();
    const fullyBookedDays = await Appointment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "serviceDetails",
        },
      },
      {
        $unwind: "$serviceDetails",
      },
      {
        $unwind: "$userDetails",
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            service: "$service",
          },
          serviceId: { $first: "$serviceDetails._id" },
          serviceName: { $first: "$serviceDetails.name" },
          totalBookings: { $sum: 1 },
          maxSlots: { $first: "$serviceDetails.maxSlots" },
          userEmails: { $push: "$userDetails.email" },
        },
      },
      {
        $match: {
          $expr: { $gte: ["$totalBookings", "$maxSlots"] },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          serviceId: 1,
          serviceName: 1,
          totalBookings: 1,
          maxSlots: 1,
          userEmails: 1,
        },
      },
    ]);

    return new NextResponse(
      JSON.stringify({
        fullyBookedDays,
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
