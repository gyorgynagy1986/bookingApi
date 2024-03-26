import User from "@/models/User";
import connect from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse,  NextRequest } from "next/server";

export const POST = async (req = NextRequest) => {
   
  const body = await req.json();    
  
  const {name, email, businessName, password } = body;

  console.log(name, email, businessName, password)
  
  const hashedPassword = await bcrypt.hash(password, 5);

  const newUser = new User({name, email, businessName, password: hashedPassword})
  
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