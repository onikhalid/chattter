import { Timestamp } from "firebase/firestore";

export type TCreatePost = {
    title: string;
    title_for_search: string[];
    content: string;
    cover_image: string;
    tags: string[];
    tags_lower: string[];
    created_at: Timestamp | Date; 
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
    tags_lower?: string[];
    created_at?: Timestamp | Date;
}
