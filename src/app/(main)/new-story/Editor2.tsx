import React, { useRef, useContext, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import { storage } from '@/utils/firebaseConfig';
import { ThemeContext, UserContext } from '@/contexts/UserInfoContext';
import dynamic from 'next/dynamic';
import ReactQuill from 'react-quill';

const ReactQuillEditor = dynamic(() => import('react-quill'), { ssr: false });
interface EditProps {
  editorRef: React.RefObject<ReactQuill>;
  setContent: (content: string) => void;
  editorContent: string;
  type: string;
}

export default function Editor2({ editorRef, setContent, editorContent, type }: EditProps) {
  const { userData, setUserData, authenticatedUser, loadingauthenticatedUser } = useContext(UserContext);
  const previousContentRef = useRef<string>('');
  const { theme } = useContext(ThemeContext);

 
  const handleImageUpload = async (file: File): Promise<string> => {
    if (!authenticatedUser?.uid) {
      throw new Error("User not authenticated");
    }
  
    const storageRef = ref(storage, `post_images/${authenticatedUser.uid}/${type}/${file.name}`);
  
    try {
      const snapshot = await uploadBytes(storageRef, file, {
        contentType: file.type,
        customMetadata: {
          // Add any additional metadata you need for the image
        },
      });
  
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error(error);
      throw new Error("Image upload failed.");
    }
  };

  const handleEditorChange = (content: string) => {
    setContent(content);
    const previousContent = previousContentRef.current;
    const deletedImage = findDeletedImage(previousContent, content);

    if (deletedImage) {
      const deletedImageUrl = extractImageUrl(deletedImage);
      if (deletedImageUrl) {
        deleteImageFromDatabase(deletedImageUrl);
      }
    }

    previousContentRef.current = content;
  };

  const findDeletedImage = (previousContent: string, currentContent: string): string | null => {
    const previousImages = extractImages(previousContent);
    const currentImages = extractImages(currentContent);

    const deletedImage = previousImages.find(image => !currentImages.includes(image));

    return deletedImage || null;
  };

  const extractImages = (content: string): string[] => {
    const imageRegex = /<img[^>]+src="([^"]+)"/g;
    const matches = Array.from(content.matchAll(imageRegex), match => match[0]);

    return matches;
  };

  const extractImageUrl = (image: string): string | null => {
    const srcRegex = /src="([^"]+)"/;
    const match = image.match(srcRegex);
    return match ? match[1] : null;
  };

  const deleteImageFromDatabase = (imageUrl: string) => {
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

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        [{ 'align': [] }],
        ['clean']
      ],
      handlers: {
        image: () => {} // This is handled by our custom module
      }
    },
    imageUploader: {
      upload: handleImageUpload
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image',
    'align',
  ];

  return (
    <div>
      <h3>Main Content</h3>
      <ReactQuillEditor
        // ref={editorRef}
        theme="snow"
        value={editorContent}
        onChange={handleEditorChange}
        modules={modules}
        formats={formats}
        style={{
          height: '800px',
          fontFamily: "'Lora', serif",
          color: theme === 'dark' ? '#fff' : '#333',
        }}
      />
    </div>
  );
}