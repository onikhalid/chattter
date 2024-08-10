'use client'

'use client'
import React, { useContext, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Badge, LinkButton, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

import { TPost } from '../types';
import { usePostsByTagInfiniteQuery } from '../api';
import { QueryResult } from '../api/getPostsAll';
import PostCard from './PostCard';
import PostCardSkeleton from './PostCardSkeleton';
import { cn } from '@/lib/utils';

type SortOption = 'date_desc' | 'date_asc' | 'alpha_asc' | 'alpha_desc' | 'likes_desc' | 'likes_asc';

const PostsByTagList: React.FC<{ tag_name: string }> = ({ tag_name }) => {
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
  } = usePostsByTagInfiniteQuery(tag_name, sortBy);

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

  if (status === 'error') return <div>Error fetching posts</div>;

  return (
    <>
      <section className='relative flex flex-col w-full max-w-[1200px] mx-auto'>
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
            <div className='flex flex-col items-center justify-center w-full my-auto'>
              <article className='bg-background p-6 lg:p-10 rounded-3xl max-md:rounded-b-none mx-auto w-full max-w-[525px]'>
                <h3 className='text-5xl font-medium'>No posts found.</h3>
                <p className='my-5'>
                  We couldn&apos;t find any post with this tag "{tag_name}" on Chatter, try again later or be the first to create a post with this tag.
                </p>
                <LinkButton href={`/new?tag=${tag_name}`} className='mt-4'>
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
                <div className={cn('mt-4 py-5 w-full text-center', data?.pages.reduce((total, page) => total + page.posts.length, 0) == 0 && "hidden")}>
                  - End -
                </div>
          }
        </div>
      </section>

      <section className='sticky top-0 max-h-96  pt-8'>
        <article className='size-full p-4 xl:p-8 border-[0.3px] border-muted-foreground/60 dark:border-muted-foreground/20 rounded-xl mt-'>
          <h2 className='flex items-center gap-1 text-3xl font-display font-medium'>{tag_name} <Badge variant="secondary">tag</Badge></h2>

          <div className='flex items-center gap-4 text-muted-foreground'>
            <p>
              {data?.pages.reduce((total, page) => total + page.posts.length, 0)}
              {" "}
              posts.
            </p>
            <p>
              {data?.pages.flatMap((page) => page.posts.map((post) => post.author_id)).filter((value, index, self) => self.indexOf(value) === index).length}
              {" "}
              authors.
            </p>
          </div>
        </article>
      </section>
    </>

  );
};

export default PostsByTagList;