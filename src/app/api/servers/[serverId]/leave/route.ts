import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface RouteParams {
  params: { serverId: string };
}

const validateRequest = async (req: Request, params: RouteParams["params"]) => {
  const user = await currentProfile();
  if (!user) {
    return { error: new NextResponse("Unauthorized", { status: 401 }) };
  }

  if (!params.serverId) {
    return { error: new NextResponse("Server ID Missing", { status: 400 }) };
  }

  return { user, serverId: params.serverId };
};

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const awaitedParams = await params;
    const validation = await validateRequest(req, awaitedParams);
    if ("error" in validation) {
      return validation.error;
    }
    const { user, serverId } = validation;

    const server = await db.server.update({
      where: {
        id: serverId,
        userDataId: {
          not: user.id,
        },
        members: {
          some: {
            userDataId: user.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            userDataId: user.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[PATCH] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

