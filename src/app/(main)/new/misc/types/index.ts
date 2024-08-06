export type TPost = {
    id: string;
    title: string;
    content: string;
    cover_image: string;
    tags: string[];
    created_at: string | Date
}

export type TCreatePost = {
    title: string;
    title_for_search:string[]
    content: string;
    cover_image: string;
    tags: string[];
    created_at: string | Date
}

export type TUpdatePost = {
    post_id: string;
    title?: string;
    title_for_search?:string[]
    content?: string;
    cover_image?: string;
    tags?: string[];
    created_at?: string | Date
}