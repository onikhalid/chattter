import { updateProfile, User } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, collection, updateDoc, getDocs, writeBatch, query, where } from "firebase/firestore";

import { db, storage } from "@/utils/firebaseConfig";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

import { TUpdateUser } from "../types";
import { generateTitleSearchTerms } from "@/app/(main)/(authenticated-user)/new/misc/utils";



const handleUploadImage = async (imageFile: File, user: User) => {
    const picRef = ref(storage, `avatars/${user?.uid}.jpg`);
    const snapshot = await uploadBytes(picRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
};

export const updateUserProfile = async (
    user: User | null,
    data: TUpdateUser,
    selectedImage: File | null,
    profileImgURL: string
): Promise<void> => {
    if (!user) throw new Error("User is not authenticated");

    const newImageURL = selectedImage ? await handleUploadImage(selectedImage, user) : null;
    const userData = {
        uid: user.uid,
        name: data.name,
        email: user.email,
        name_for_search:  generateTitleSearchTerms(data.name),
        username: data.username,
        avatar: selectedImage ? newImageURL : profileImgURL,
        bio: data.bio,
        interests: data.interests,
        twitter: data.twitter,
        instagram: data.instagram,
        facebook: data.facebook,
        linkedin: data.linkedin
    };

    const userDocRef = doc(db, `users/${user.uid}`);
    await updateDoc(userDocRef, { ...userData });

    await updateProfile(user, { photoURL: selectedImage ? newImageURL : profileImgURL, displayName: data.name });

    const batch = writeBatch(db);

    // Update user's posts
    const allUsersPostsQuery = query(collection(db, "posts"), where("author_id", "==", user.uid));
    const allUsersPostsSnap = await getDocs(allUsersPostsQuery);
    allUsersPostsSnap.docs.forEach((postDoc) => {
        const postDocRef = doc(db, `posts/${postDoc.id}`);
        batch.update(postDocRef, {
            author_name: data.name,
            author_avatar: selectedImage ? newImageURL : profileImgURL,
            author_username: data.username,
        });
    });

    // Update user's bookmarks
    const allUsersPostsBookmarkssQuery = query(collection(db, "bookmarks"), where("post_author_id", "==", user.uid));
    const allUsersPostsBookmarksSnap = await getDocs(allUsersPostsBookmarkssQuery);
    allUsersPostsBookmarksSnap.docs.forEach((bookmarkDoc) => {
        const bookmarkDocRef = doc(db, `bookmarks/${bookmarkDoc.id}`);
        batch.update(bookmarkDocRef, {
            post_author_name: data.name,
            post_author_avatar: selectedImage ? newImageURL : profileImgURL,
        });
    });

    // Update user's folders
    const allUsersFoldersQuery = query(collection(db, "folders"), where("uid", "==", user.uid));
    const allUsersFoldersSnap = await getDocs(allUsersFoldersQuery);
    allUsersFoldersSnap.docs.forEach((folderDoc) => {
        const folderDocRef = doc(db, `folders/${folderDoc.id}`);
        batch.update(folderDocRef, {
            folder_owner_name: data.name,
            folder_owner_avatar: selectedImage ? newImageURL : profileImgURL,
        });
    });

    // Update user's contributions
    const allUsersContributionsQuery = query(collection(db, "comments"), where("commentor_id", "==", user.uid));
    const allUsersContributionSnap = await getDocs(allUsersContributionsQuery);
    allUsersContributionSnap.docs.forEach((contributionDoc) => {
        const contributionDocRef = doc(db, `comments/${contributionDoc.id}`);
        batch.update(contributionDocRef, {
            commentor_name: data.name,
            commentor_avatar: selectedImage ? newImageURL : profileImgURL,
            commentor_username: data.username,
        });
    });

    await batch.commit();
};

interface UseUpdateUserProfileProps {
    user: User | null;
    selectedImage: File | null;
    profileImgURL: string;
}

export const useUpdateUserProfile = ({
    user,
    selectedImage,
    profileImgURL,
}: UseUpdateUserProfileProps): UseMutationResult<void, Error, TUpdateUser> => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, TUpdateUser>({
        mutationFn: (data: TUpdateUser) => updateUserProfile(user, data, selectedImage, profileImgURL),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["userProfile", user?.uid]
            });
        },
        onError: (error) => {
            console.error("Failed to update profile:", error);
        },
    }

    );
};
