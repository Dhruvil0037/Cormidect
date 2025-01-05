import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@prisma/client";
import { db } from "@/lib/db";

interface RouteParams {
  params: { channelId: string };
}

const validateRequest = async (req: Request, params: RouteParams["params"] , name="") => {
  const user = await currentProfile();
  if (!user) {
    return { error: new NextResponse("Unauthorized", { status: 401 }) };
  }

  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get("serverId");

  if (!serverId) {
    return { error: new NextResponse("Server ID Missing", { status: 400 }) };
  }

  if (!params.channelId) {
    return { error: new NextResponse("Channel ID Missing", { status: 400 }) };
  }

  if( name=== "general"){
    return { error: new NextResponse("Name cannot be general channel", { status: 400 }) };
  }

  return { user, serverId, channelId: params.channelId };
};

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const awaitedParams = await params;
    const validation = await validateRequest(req, awaitedParams);
    if ("error" in validation) {
      return validation.error;
    }
    const { user, serverId, channelId } = validation;

    const server = await db.server.update({
      where:{
        id:serverId,
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
          delete:{
            id: channelId,
            name:{
              not:"general"
            }
          }
        }
      }
    });

    return NextResponse.json(server);

  } catch (e) {
    console.error(e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const awaitedParams = await params;
    const { name, type } = await req.json();
    const validation = await validateRequest(req, awaitedParams , name);
    if ("error" in validation) {
      return validation.error;
    }
    const { user, serverId, channelId } = validation;

    const server = await db.server.update({
      where:{
        id:serverId,
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
          update:{
            where:{
              id: channelId,
              NOT:{
                name:"general"
              },
            },
            data:{
              name,
              type
            }
          }
        }
      }
    });

    return NextResponse.json(server);

  } catch (e) {
    console.error(e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
