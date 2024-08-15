import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { LinkButton } from '@/components/ui';

import { TPost } from '../types';
import { useAllPostsInfiniteQuery } from '../api';
import { QueryResult } from '../api/getPostsAll';
import PostCard from './PostCard';
import PostCardSkeleton from './PostCardSkeleton';



const PostsList: React.FC = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status
  } = useAllPostsInfiniteQuery();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'error') return <div>Error fetching posts</div>;

  return (
    <>
      <div className='flex flex-col divide-y-[1.5px] w-full divide-muted-foreground dark:divide-muted'>
        {
          isLoading && Array.from({ length: 10 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))
        }
      </div>

      {
        data?.pages.reduce((total, page) => total + page.posts.length, 0) == 0 && !isLoading && (
          <div className='flex flex-col items-center justify-center h-[50vh] w-full'>
            <article className='bg-background p-6 lg:p-10 rounded-3xl max-md:rounded-b-none mx-auto w-full max-w-[525px]'>
              <h3 className='text-5xl font-medium'>No posts found.</h3>
              <p>
                No posts has been created on Chattter, try again later or create a new post.
              </p>
              <LinkButton href='/new' className='mt-4'>
                Create a new post
              </LinkButton>
            </article>
          </div>
        )
      }

      {
        data?.pages.map((page: QueryResult, i: number) => (
          <div key={i} className='flex flex-col divide-y-[1.5px] w-full divide-muted-foreground dark:divide-muted'>
            {
              page.posts.map((post: TPost) => (
                <PostCard
                  key={post.post_id}
                  post={post} />
              ))
            }
          </div>
        ))}

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
              ?
              <div className="h-2" />
              :
              <div className='mt-4 py-5 w-full text-center'>
                - End -
              </div>
        }
      </div>
    </>
  );
};

export default PostsList;