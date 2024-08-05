import React, { useRef, useContext, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import { storage } from '@/utils/firebaseConfig';
import { ThemeContext, UserContext } from '@/contexts/UserInfoContext';
import dynamic from 'next/dynamic';
import ReactQuill from 'react-quill';




export const findDeletedImage = (previousContent: string, currentContent: string): string | null => {
    const previousImages = extractImages(previousContent);
    const currentImages = extractImages(currentContent);

    const deletedImage = previousImages.find(image => !currentImages.includes(image));

    return deletedImage || null;
};

export const extractImages = (content: string): string[] => {
    const imageRegex = /<img[^>]+src="([^"]+)"/g;
    const matches = Array.from(content.matchAll(imageRegex), match => match[0]);

    return matches;
};

export const extractImageUrl = (image: string): string | null => {
    const srcRegex = /src="([^"]+)"/;
    const match = image.match(srcRegex);
    return match ? match[1] : null;
};

export const deleteImageFromDatabase = (imageUrl: string) => {
    try {
        const startIndex = imageUrl.indexOf('/o/') + 3;
        const endIndex = imageUrl.indexOf('?alt=media');
        const encodedPath = imageUrl.substring(startIndex, endIndex);
        const storagePath = decodeURIComponent(encodedPath);
        const imageRef = ref(storage, storagePath);
        deleteObject(imageRef).catch((error) => {
            if (error.code === "storage/object-not-found") {
                toast.error("Duplicate delete action, image has already been deleted", {
                    position: "top-center",
                    duration: 3500
                });
            } else {
                throw error;
            }
        });
    } catch (error) {
        console.error("Error deleting image:", error);
    }
};
