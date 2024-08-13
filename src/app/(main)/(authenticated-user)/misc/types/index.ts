import { Timestamp } from "firebase/firestore";

export type TPost = {
    author_avatar: string;
    author_name: string;
    author_id: string;
    author_username: string;
    content: string;
    cover_image: string;
    created_at: Timestamp;
    post_id: string;
    tags: string[];
    title: string;
    title_for_search: string[];
    likes: string[];
    bookmarks: string[];
    total_reads: number;
    unique_reads: number;
    views: string;
}
export type TCreateBookmark = {
    bookmarker_id: string;
    post_id: string;
    post_title: string;
    post_cover_image: string;
    post_author_id: string;
    post_author_username: string;
    post_author_avatar: string;
    post_author_name: string;
    created_at: Date;
}
export type TBookmark = {
    bookmarker_id: string;
    post_id: string;
    post_title: string;
    post_cover_image: string;
    post_author_id: string;
    post_author_username: string;
    post_author_avatar: string;
    post_author_name: string;
    created_at: Timestamp;
}


export type TFollow = {
    follower_id: string;
    followed_id: string;
}
export type TLike = {
    liker_id: string;
    post_id: string;
}

export type TComment = {
    post_id: string;
    comment_id: string;
    commentor_id: string;
    commentor_username: string;
    commentor_name: string;
    commentor_avatar: string;
    content: string;
    parent_comment_id?: string | null;
    replies?: TComment[];
    created_at: Timestamp;
};
export type TCreateComment = {
    post_id: string;
    comment_id: string;
    commentor_id: string;
    commentor_username: string;
    commentor_name: string;
    commentor_avatar: string;
    content: string;
    parent_comment_id?: string | null;
    replies?: TComment[];
    created_at: Timestamp | Date;
};