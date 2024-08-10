import { Dot } from 'lucide-react';
import { Skeleton } from '@/components/ui';

export const CommentCardSkeleton = () => {


    return (
        <article className="my-4 divide-muted-foreground w-full py-4">
            <header className="flex max-md:flex-col items-center gap-1.5">
                <div className='flex items-center gap-2' >
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <Skeleton className='h-5 w-24' />
                </div>
                <Dot size={10} className='max-md:hidden' />
                <Skeleton className='h-3 w-16' />
            </header>

            <div className='flex flex-col gap-2.5 my-4 w-full'>
                <Skeleton className='h-3 w-full' />
                <Skeleton className='h-3 w-full' />
                <Skeleton className='h-3 w-[50%]' />
            </div>

            <footer className='flex items-cwnter justify-between gap-1.5'>
                <Skeleton className='h-3.5 w-16' />
                <Skeleton className='h-3.5 w-16' />
            </footer>
        </article>
    );
};