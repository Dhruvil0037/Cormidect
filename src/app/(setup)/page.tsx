import { initialProfile } from "@/lib/initial-profile";
import {redirect} from "next/navigation";
import { db } from "@/lib/db";
import InitialModal from "@/components/modals/intial-modal";

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
    <InitialModal />
  )
}

export default SetupPage