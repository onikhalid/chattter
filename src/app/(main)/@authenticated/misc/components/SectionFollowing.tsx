'use context'
import { useInView } from 'react-intersection-observer';
import React, { useContext, useEffect } from 'react';
import { TPost } from '../types';
import { useFollowsPostsInfiniteQuery } from '../api';
import { QueryResult } from '../api/getPostsAll';
import PostCard from './PostCard';
import { UserContext } from '@/contexts';

const FollowsPostsList: React.FC = () => {
  const { userData } = useContext(UserContext)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
    error
  } = useFollowsPostsInfiniteQuery(userData?.followings || ['']);
  console.log(error)
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <div>Loading...</div>;
  if (status === 'error') return <div>Error fetching posts</div>;

  return (
    <>
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
      <div ref={ref}>
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
            ? 'Load More'
            : 'No more posts'}
      </div>
    </>
  );
};

export default FollowsPostsList;