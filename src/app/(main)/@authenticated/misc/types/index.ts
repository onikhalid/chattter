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
    reads: string[];
}
export type TBookmark = {
    bookmarker_id: string;
    post_id: string;
    post_title: string;
    post_cover_image: string;
    post_author_id: string;
    post_author_username: string;
    post_author_avatar: string;
}
export type TFollow = {
    follower_id: string;
    followed_id: string;
}
export type TLike = {
    liker_id: string;
    post_id: string;
}