import { NextResponse } from 'next/server';
import connect from "../../../lib/db";
import Users from '@/models/User';

export const GET = async () => {
    try {
      await connect();
      const getAllUser = await Users.find({});
      return new NextResponse(
        JSON.stringify({
            getAllUser,
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