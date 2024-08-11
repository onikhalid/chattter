import { Timestamp } from "firebase/firestore";

export type UserData ={
    username?: string | null;
    email: string;
    id: string;
}


export type TUpdateUser = {
    name: string;
    name_for_search: string[];
    username: string;
    interests: string[];
    bio: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    avatar: File | null;
    updated_at: Date;
};
