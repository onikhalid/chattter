import { Timestamp } from "firebase/firestore";

export type TPost = {
    author_avatar: string;
    author_name: string;
    author_username: string;
    author_id: string;
    post_id: string;
    title: string;
    content: string;
    cover_image: string;
    tags: string[];
    created_at: Timestamp;
}

export type TCreatePost = {
    title: string;
    title_for_search: string[];
    content: string;
    cover_image: string;
    tags: string[];
    created_at: string | Date; 
    author_id: string;
    author_name: string;
    author_username: string;
    author_avatar: string;
}

export type TUpdatePost = {
    post_id: string;
    title?: string;
    title_for_search?: string[];
    content?: string;
    cover_image?: string;
    tags?: string[];
    created_at?: string | Date;
}
