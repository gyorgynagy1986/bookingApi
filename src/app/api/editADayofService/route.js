import { NextRequest, NextResponse } from 'next/server';
import dbConnect  from "../../../lib/db";
import EditModel from "@/models/EditModel";


export const POST = async (req = NextRequest) => {
    await dbConnect();
  
    try {
      // Parse the incoming request to JSON format
      const body = await req.json();
  
      // Create a new document in the database using the received body
      const edit = await EditModel.create({
        maxSlot: body.maxSlot,
        idRelatedToService: body.idRelatedToService,
      });
  
      // Respond with the created document using NextResponse
      return new NextResponse(JSON.stringify({ success: true, data: edit }), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to save edit:', error);
      // Return an error response using NextResponse
      return new NextResponse(JSON.stringify({ success: false, message: 'Server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  };



  
export const GET = async (req = NextRequest) => {
    await dbConnect();
  
    try {
      // Fetch all documents from the EditModel collection
      const edits = await EditModel.find({});
  
      // If there are no documents, return a message indicating so
      if (!edits.length) {
        return new NextResponse(JSON.stringify({ success: true, message: 'No edits found' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
  
      // Respond with the found documents
      return new NextResponse(JSON.stringify({ success: true, data: edits }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to fetch edits:', error);
      // Return an error response
      return new NextResponse(JSON.stringify({ success: false, message: 'Server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  };