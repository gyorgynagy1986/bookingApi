import connect from "../../../lib/db";
import Users from '@/models/User';
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

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


  export const POST = async (req = NextRequest) => {
   
    const body = await req.json();    
    
    const {name, email, phone, password } = body;
    
    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = new Users({name, email, phone, password: hashedPassword})
    
    await connect();

    try { 
      await newUser.save();
      return new NextResponse(
        JSON.stringify({
          newUser
        }),
        { status: 200 },
      );
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 500 },
      );
    }
  };
