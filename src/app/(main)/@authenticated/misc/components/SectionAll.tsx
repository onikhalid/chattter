import { useInView } from 'react-intersection-observer';
import React, { useEffect } from 'react';
import { TPost } from '../types';
import { useAllPostsInfiniteQuery } from '../api';
import { QueryResult } from '../api/getPostsAll';
import PostCard from './PostCard';

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

  if (isLoading) return <div>Loading...</div>;
  if (status === 'error') return <div>Error fetching posts</div>;

  return (
    <div className='w-full'>
      {data?.pages.map((page: QueryResult, i: number) => (
        <div key={i} className='flex flex-col gap-5'>
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
    </div>
  );
};

export default PostsList;