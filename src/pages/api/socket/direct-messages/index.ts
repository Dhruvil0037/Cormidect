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
    const { content, fileUrl , fileName } = req.body;
    const { conversationId } = req.query;

    if(!user || !conversationId || !content ){
      return res.status(401).json({error:"Unauthorized"});
    } 

    const conversation = await db.conversation.findFirst({
      where:{
        id: conversationId as string,
        OR:[{
          memberOne:{
            userDataId: user.id
          }
        },{
          memberTwo:{
            userDataId: user.id
          }
        }
      ]
      },
      include:{
        memberOne:{
          include:{
            user:true,
          }
        },
        memberTwo:{
          include:{
            user:true,
          }
        }
      }
    });

    if(!conversation){
      return res.status(401).json({error:"conversation not found"});
    }

    const member = conversation.memberOne.userDataId === user.id ? conversation.memberOne : conversation.memberTwo;

    if(!member){
      return res.status(401).json({error:"member not found"});
    }

    const message = await db.directMessage.create({
      data:{
        content,
        fileUrl,
        fileName,
        conversationId:conversationId as string,
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

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);

  } catch (error) {
    console.error(error);
    return res.status(500).json({error:"Internal Server Error"});
  }

}