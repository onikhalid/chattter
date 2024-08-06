import React from 'react'
import { Avatar, Button, ChatterLogo, Input, LinkButton, Popover, PopoverContent, PopoverTrigger } from '../ui'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/utils/firebaseConfig';
import { getInitials } from '@/utils/strings';
import { PenIcon, PlusIcon, SearchIcon } from '../icons';
import { Tabs, TabsList } from '../ui/tabs';

const AuthenticatedHomepage = () => {
  const [user, loading] = useAuthState(auth);
const tabsArray =[
  {
    
  }
]

  return (
    <main className="flex flex-col h-screen items-center justify-between font-display overflow-hidden">
      <header className="sticky top-0 flex items-center justify-between w-full px-5 py-3 md:px-10 md:py-4 border-b-[0.3px] border-b-[#E4E7EC]">
        <ChatterLogo />
        <section className='flex items-center gap-2'>
          <LinkButton href='/new' shape='rounded' variant='outline' className='flex items-center gap-2 rounded-lg border-[#b6b5b5] py-1.5'>
            Write story <PenIcon />
          </LinkButton>

          <Popover>
            <PopoverTrigger>
              <Avatar alt='' fallback={getInitials(user?.displayName! || "")} src={user?.photoURL} />
            </PopoverTrigger>
            <PopoverContent>
              <div>
                <span className="text-sm">Signed in as</span>
                <h6 className="font-semibold">{user?.displayName}</h6>
              </div>
            </PopoverContent>
          </Popover>
        </section>
      </header>


      <div className="grow w-full lg:grid grid-cols-[1fr,0.4fr] px-4 lg:px-[7.5vw] lg:gap-[5vw] max-h-[calc(100vh_-_4.5rem)] pt-8">
        <section className='overflow-y-scroll w-full max-w-[1200px] mx-auto'>
          <header className='flex items-center justify-between gap-10 border-b pt-10 pb-5'>
            <Button variant='ghost' className='flex items-center gap-1.5'>
              <PlusIcon />
              Add interest
            </Button>


            <Input
              placeholder='by topics or title'
              className='w-[220px] md:w-[300px]'
              leftIcon={<SearchIcon/>}
            />

            <LinkButton href='new-story' shape='rounded' variant='outline' className='flex items-center gap-2 rounded-lg border-[#b6b5b5] py-1.5'>
              Write story <PenIcon />
            </LinkButton>
          </header>
        </section>
        <section>p</section>
      </div>

      <section>
        <Tabs>
          <TabsList>
            
          </TabsList>
        </Tabs>
      </section>

      {/* <footer className="sticky bottom-0 flex items-center justify-between bg-black text-background w-full p-4 max-md:text-xs">
        <small>&copy; 2024 Chatter. All rights reserved</small>
        <span>
          Built with ❤️ by
          <a href="https://github.com/onikhalid" target="_blank" className="ml-1.5 underline decoration-white hover:decoration-primary">
            Khalid.
          </a>
        </span>
      </footer> */}
    </main>
  )
}

export default AuthenticatedHomepage