import React from 'react'
import { currentProfile } from '@/lib/current-profile'
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import NavigationAction from './navigation-action';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import NavigationItem from './navigation-itm';
import { ModeToggle } from '../theme-toggle';
import { UserButton } from '@clerk/nextjs';

const Sidebar = async() => {
  const user = await currentProfile();
  if(!user) return redirect('/');

  const servers = await db.server.findMany({
    where:{
      members:{
        some:{
          userDataId: user.id
        }
      }
    }
  })

  return (
    <div
      className='space-y-4 flex flex-col items-center h-full w-full dark:bg-[#1E1F22] bg-secondary py-3'
    >
      <NavigationAction/>
      <Separator
        className='h-[2px] bg-primary rounded-md w-10 mx-auto'
      />
      <ScrollArea
        className='flex-1 w-full'>
        {servers.map(server => (
          <div
            key={server.id}
            className='mb-4'
          >
           <NavigationItem
            name={server.name}
            imageUrl={server.imageUrl}
            id={server.id}
           />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle/>
        <UserButton
          appearance={{
            elements: {
              avatarBox:"h-[48px] w-[48px]",
            }
          }}
        />
      </div>
    </div>
  )
}

export default Sidebar