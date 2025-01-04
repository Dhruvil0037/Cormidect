import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";


const validateRequest = async (req: Request) => {
  const user = await currentProfile();
  if (!user) {
    return { error: new NextResponse("Unauthorized", { status: 401 }) };
  }

  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get("serverId");

  if (!serverId) {
    return { error: new NextResponse("Server ID Missing", { status: 400 }) };
  }

  return { user, serverId };
};

export async function POST(
  req: Request
){
  try{
    const validation = await validateRequest(req);
    if ('error' in validation) {
      return validation.error;
    }
    const { user, serverId } = validation;
    const { name , type } = await req.json();

    if(name === "general"){
      return new NextResponse("Channel name cannot be general", {status:400});
    }
    
    const server = await db.server.update({
      where:{
        id: serverId,
        members:{
          some:{
            userDataId: user.id,
            role:{
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
    data:{
        channels:{
          create:{
            userDataId: user.id,
            name,
            type,
          }
        }
      }
    });
    return  NextResponse.json(server);
  }catch(error){
    console.error("[POST]",error);
    return new NextResponse("Internal Server Error", {status:500});
  }
}