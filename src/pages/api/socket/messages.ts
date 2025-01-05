import { NextApiResponseWithSocket } from "@/types";
import { NextApiRequest } from "next";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if(req.method !== "POST"){
    return res.status(405).json({error:"Method not allowed"});
  }

  try{
    const user = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { serverId , channelId } = req.query;

    if(!user || !serverId || !channelId || !content ){
      return res.status(401).json({error:"Unauthorized"});
    } 

    const server = await db.server.findFirst({
      where:{
        id: serverId as string,
        members:{
          some:{
            userDataId: user.id
          }
        }
      },
      include:{
        members:true,
      }
    });

    if(!server){
      return res.status(401).json({error:"Unauthorized"});
    }

    const channel = await db.channel.findFirst({
      where:{
        id: channelId as string,
        serverId: serverId as string,
      }
    });  
    
    if(!channel){
      return res.status(401).json({error:"Unauthorized"});
    }

    const member = server.members.find((member) => member.userDataId === user.id);

    if(!member){
      return res.status(401).json({error:"Unauthorized"});
    }

    const message = await db.message.create({
      data:{
        content,
        fileUrl,
        channelId:channelId as string,
        memberId: member.id,
      },
      include:{
        member:{
          include:{
            user:true,
          }
        }
      }
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);

  } catch (error) {
    console.error(error);
    return res.status(500).json({error:"Internal Server Error"});
  }

}