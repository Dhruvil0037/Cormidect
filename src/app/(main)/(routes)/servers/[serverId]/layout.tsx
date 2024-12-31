import { currentProfile } from "@/lib/current-profile"
import { redirect } from 'next/navigation';
import {db} from "@/lib/db";
import ServerSideBar from "@/components/server/server-sidebar";

const ServerIdLayout = async({children , params}:{children:React.ReactNode;
  params: {serverId: string};
}) => {

  const user = await currentProfile();
  if(!user) return redirect('/');
  const awaitedParams = await params;
  const server = await db.server.findUnique({
    where:{
      id: awaitedParams?.serverId,
      members:{
        some:{
          userDataId: user.id
        }
      }
    }
  });
  
  if(!server) return redirect('/');

  return (
    <div className='h-full'>
      <div className="md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSideBar 
          serverId={awaitedParams.serverId}
        />
      </div>
      <main className='h-full md:pl-60'>
        {children}
      </main>
    </div>
  )
}

export default ServerIdLayout