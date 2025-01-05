import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ServerPageProps {
  params: {
    serverId: string;
  };
}

const ServerPage = async ({ params }: ServerPageProps) => {
  const user = await currentProfile();

  if (!user) {
    return redirect("/");
  }

  const awaitedParams = await params;

  const server = await db.server.findUnique({
    where: {
      id: awaitedParams.serverId,
      members: {
        some: {
          userDataId: user.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(
    `/servers/${awaitedParams.serverId}/channels/${initialChannel?.id}`
  );
};

export default ServerPage;
