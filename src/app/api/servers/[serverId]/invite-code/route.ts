import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";

export async function PATCH(
  req:Request,
  { params}:{params : {serverId: string}}
){
  try{
    const user = await currentProfile();
    if(!user){
      return new NextResponse("Unauthorized", {status:401});
    }

    const awaitedParams = await params;

    if(!awaitedParams.serverId){
      return new NextResponse("Server ID Missing", {status:400});
    }

    const server = await db.server.update({
      where:{
        id: awaitedParams.serverId,
        userDataId: user.id,
      },
      data:{
        inviteCode: uuidv4(),
      }
    })

    return NextResponse.json(server);
  }catch(error){
    console.log("[SERVER_ID]",error);
    return new NextResponse("Internal Server Error", {status:500});
  } 
}