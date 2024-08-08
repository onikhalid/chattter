import React from 'react'
import { Skeleton, } from '@/components/ui'
import { Ellipsis } from 'lucide-react'


const PostCardSkeleton = () => {

  return (
    <article className='flex flex-col gap-4 py-5 px-2 xl:px-4'>
      <header className='grid grid-cols-[1fr,max-content] items-center w-full'>
        <div className='flex items-center gap-2 w-full'>
          <Skeleton className='w-9 h-9 rounded-full' />
          <Skeleton className='w-[30%] max-w-40 h-5' />
          <Skeleton className='w-[15%] h-3.5' />
        </div>

        <Ellipsis className='ml-auto' />
      </header>

      <section className='flex flex-col-reverse md:grid md:grid-cols-[1fr,max-content] items-stretch justify-between gap-8 w-full'>
        <div className='w-full'>
          <Skeleton className='w-[90%] max-w-[28rem] h-8 ' />
          <Skeleton className='w-[35%] max-w-60 h-8 mt-2' />

          <Skeleton className='w-full md:w-[70%] max-w-58 h-2 md:h-3 mt-5' />
          <Skeleton className='w-full md:w-[70%] max-w-58 h-2 md:h-3 mt-2' />
          <Skeleton className='w-full md:w-[68%] max-w-30 h-2 md:h-3 mt-2' />
        </div>

        <Skeleton className='relative w-full md:max-w-[200px] h-[150px] aspect-[16/9]' />
      </section>

      <footer className='flex items-center'>
        <Skeleton className='w-16 lg:w-24 h-7 rounded-md' />


        <div className='flex items-center gap-2 ml-auto'>
          <Skeleton className='w-10 md:w-12 h-5 rounded-full' />
          <Skeleton className='w-12 md:w-16 h-5 rounded-full' />
          <Skeleton className='w-5 h-5 rounded-none' />
        </div>
      </footer>
    </article>
  )
}

export default PostCardSkeleton