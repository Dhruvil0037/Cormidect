import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface InviteCodePageProps {
  params:{
    inviteCode:string;
  };
};

const InviteCodePage = async({
  params
}: InviteCodePageProps) => {

  const user = await currentProfile();

  if(!user) return redirect('/');

  const awaitedParams = await params;
  
  if(!awaitedParams.inviteCode){
    return redirect('/');
  }

  const existingServer = await db.server.findFirst({
    where:{
      inviteCode: awaitedParams.inviteCode,
      members:{
        some:{
          userDataId: user.id,
        }
      }
    }
  });

  if(existingServer){
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where:{
      inviteCode: awaitedParams.inviteCode,
    },
    data: {
      members: {
        create: [{
          userDataId: user.id,          
        }]
      }
    }
  });

 
  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
}

export default InviteCodePage;