import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface RouteParams {
  params: { memberId: string };
}

const validateRequest = async (req: Request, params: RouteParams['params']) => {
  const user = await currentProfile();
  if (!user) {
    return { error: new NextResponse("Unauthorized", { status: 401 }) };
  }

  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get("serverId");

  if (!serverId) {
    return { error: new NextResponse("Server ID Missing", { status: 400 }) };
  }

  if (!params.memberId) {
    return { error: new NextResponse("Member ID Missing", { status: 400 }) };
  }

  return { user, serverId };
};

const serverQueryOptions = {
  include: {
    members: {
      include: {
        user: true,
      },
      orderBy: {
        role: "asc" as const,
      },
    },
  },
};

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const awaitedParams = await params;
    const validation = await validateRequest(req, awaitedParams);
    if ('error' in validation) {
      return validation.error;
    }
    const { user, serverId } = validation;

    const { role } = await req.json();

    const server = await db.server.update({
      where: {
        id: serverId,
        userDataId: user.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: awaitedParams.memberId,
              userDataId: {
                not: user.id,
              },
            },
            data: { role },
          },
        },
      },
      ...serverQueryOptions,
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error('[PATCH] Error:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const awaitedParams = await params;
    const validation = await validateRequest(req, awaitedParams);
    if ('error' in validation) {
      return validation.error;
    }
    const { user, serverId } = validation;

    const server = await db.server.update({
      where: {
        id: serverId,
        userDataId: user.id,
      },
      data: {
        members: {
          deleteMany: {
            id: awaitedParams.memberId,
            userDataId: {
              not: user.id,
            },
          },
        },
      },
      ...serverQueryOptions,
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error('[DELETE] Error:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}