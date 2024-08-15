import React, { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer';

import { Badge, Button, LinkButton, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

import { useGetUserPostsInfiniteQuery } from '../api';
import PostCardSkeleton from './PostCardSkeleton';
import PostCard from './PostCard';
import { UserProfileQueryResult } from '../api/getAllUserPosts';
import { TPost } from '../types';
import { cn } from '@/lib/utils';


interface Props {
  username: string
}

type SortOption = 'date_desc' | 'date_asc' | 'alpha_asc' | 'alpha_desc' | 'likes_desc' | 'likes_asc';

const PublicProfilePosts: React.FC<Props> = ({ username }) => {
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
    error,
    refetch
  } = useGetUserPostsInfiniteQuery(username, sortBy);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
    refetch();
  };

  return (
    <section className='grow relative flex flex-col w-full max-w-[550px] h-full lg:max-w-[1200px] mx-auto'>
      <div className={cn('flex items-center border-b-[1.5px] w-full border-muted-foreground dark:border-muted py-4',
        data?.pages.reduce((total, page) => total + page.posts.length, 0) == 0 && "hidden")}
      >
        <Select onValueChange={handleSortChange} defaultValue={sortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_desc">Newest First</SelectItem>
            <SelectItem value="date_asc">Oldest First</SelectItem>
            <SelectItem value="alpha_asc">Title A-Z</SelectItem>
            <SelectItem value="alpha_desc">Title Z-A</SelectItem>
            <SelectItem value="likes_desc">Most Likes</SelectItem>
            <SelectItem value="likes_asc">Fewest Likes</SelectItem>
          </SelectContent>
        </Select>
      </div>


      <div className='flex flex-col divide-y-[1.5px] w-full divide-muted-foreground dark:divide-muted'>
        {
          isLoading && Array.from({ length: 10 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))
        }
      </div>


      {
        data?.pages.reduce((total, page) => total + page.posts.length, 0) == 0 && !isLoading && (
          <div className='grow flex flex-col items-center justify-center size-full my-auto'>
            <article className='bg-background p-6 lg:p-10 rounded-3xl max-md:rounded-b-none mx-auto w-full max-w-[525px]'>
              <h3 className='text-5xl font-medium'>No posts found.</h3>
              <p className='my-5'>
                This user hasn&apos;t made any posts yet. You can either try again later or view other users posts.
              </p>

              <LinkButton href='/' className='mt-4 md:mt-10 px-12 py-6 text-lg'>
                Go back home
              </LinkButton>
            </article>
          </div>
        )
      }


      {
        data?.pages.map((page: UserProfileQueryResult, i: number) => (
          <div key={i} className='flex flex-col divide-y-[1.5px] w-full divide-muted-foreground dark:divide-muted'>
            {
              page.posts.map((post: TPost) => (
                <PostCard
                  key={post.post_id}
                  post={post}
                  isFromProfile={true}
                  refetch={refetch}
                />
              ))
            }
          </div>
        ))
      }


      <div ref={ref} className='w-full'>
        {
          isFetchingNextPage
            ?
            <div className='flex flex-col divide-y-[1.5px] w-full divide-muted-foreground dark:divide-muted'>
              {
                Array.from({ length: 4 }).map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))
              }
            </div>

            :
            hasNextPage
              ? null
              :
              <div className={cn('mt-8 py-5 w-full text-center ', data?.pages.reduce((total, page) => total + page.posts.length, 0) == 0 && "hidden")}>
                <span className='font-sans'>&mdash;&mdash;</span>
                {" "}End{" "}
                <span className='font-sans'>&mdash;&mdash;</span>
              </div>
        }
      </div>
    </section>
  )
}

export default PublicProfilePosts