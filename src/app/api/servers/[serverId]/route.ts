import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  req:Request,
  { params}:{params : {serverId: string}}
){
  try{
    const user = await currentProfile();
    const { name , imageUrl } = await req.json();
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
        name,
        imageUrl,
      }
    })

    return NextResponse.json(server);
  }catch(error){
    console.log("[SERVER_ID]",error);
    return new NextResponse("Internal Server Error", {status:500});
  }
}

export async function DELETE(
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

    const server = await db.server.delete({
      where:{
        id: awaitedParams.serverId,       
        userDataId: user.id, 
      }
    })

    return NextResponse.json(server);
  }catch(error){
    console.log("[SERVER_ID]",error);
    return new NextResponse("Internal Server Error", {status:500});
  }
}