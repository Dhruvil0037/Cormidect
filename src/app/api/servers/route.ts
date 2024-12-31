import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4} from "uuid";
import { MemberRole } from "@prisma/client";

export async function POST(req:Request){
  try{
    const { name , imageUrl } = await req.json();
    const user = await currentProfile();
    if(!user) return new NextResponse("Unauthorized",{ status: 401 });
    const server = await db.server.create({
      data: {
        userDataId: user.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{
            name: "general",
            userDataId: user.id,
          }]
        },
        members: {
          create: [{
            userDataId: user.id,
            role: MemberRole.ADMIN,
          }]
        }
      }
    });
    return  NextResponse.json(server);
  }
  catch(e){
    console.error(e);
    return new NextResponse("Internal Error",{ status: 500 });
  }
}