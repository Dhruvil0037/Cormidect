import { initialProfile } from "@/lib/initial-profile";
import {redirect} from "next/navigation";
import { db } from "@/lib/db";

const SetupPage = async() => {
  const user = await initialProfile();
  const server = await db.server.findFirst({
    where:{
      members :{
        some: {
          userDataId:user.id
        }
      }
    }
  });
  if(server) {
    return redirect(`/servers/${server.id}`);
  }

  return (
    <div className='text-green-400 size-4'>
      SetupPage</div>
  )
}

export default SetupPage