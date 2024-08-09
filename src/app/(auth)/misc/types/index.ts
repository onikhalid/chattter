export type UserData ={
    username?: string | null;
    email: string;
    id: string;
}


export type TUpdateUser = {
    name: string;
    username: string;
    interests: string[];
    bio: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    avatar: File | null;
};
