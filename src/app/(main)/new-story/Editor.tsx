import React, { useRef, useContext, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import { storage } from '@/utils/firebaseConfig';
import { ThemeContext, UserContext } from '@/contexts/UserInfoContext';
import dynamic from 'next/dynamic';

interface EditProps {
  editorRef: React.RefObject<any>;
  setContent: (content: string) => void;
  editorContent: string;
  type: string;
}

export default function Edit({ editorRef, setContent, editorContent, type }: EditProps) {
  const { userData, setUserData, authenticatedUser, loadingauthenticatedUser } = useContext(UserContext);
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
  const previousContentRef = useRef<string>('');

  const { theme } = useContext(ThemeContext);
  const tinytheme = theme === 'dark' ? 'oxide-dark' : 'oxide';

  const handleImageUpload = async (blobInfo: any, progress: (percentage: number) => void): Promise<string> => {
    if (!authenticatedUser?.uid) {
      throw new Error("User not authenticated");
    }

    const storageRef = ref(storage, `post_images/${authenticatedUser.uid}/${type}/${blobInfo.filename()}`);

    try {
      const snapshot = await uploadBytes(storageRef, blobInfo.blob(), {
        contentType: blobInfo.blob().type,
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

  const handleEditorChange = (content: string, editor: any) => {
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

  return (
    <div>
      <h3>Main Content</h3>
      <Editor
        apiKey='msbbpj95lqonltw1kc7t8dhfszyfrq2eckl4l51v6avn3h5v'
        onInit={(evt: any, editor: any) => {
          const currentEditorRef = editorRef.current;
          if (currentEditorRef) {
            currentEditorRef.current = editor;
          }
        }}
        onEditorChange={handleEditorChange}
        initialValue={editorContent}
        
        init={{
          height: 800,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          menubar: 'edit view insert format view table tools ',
        //   menubar: 'file edit view insert format view table tools ',
          menu: {
            file: { title: 'File', items: 'restoredraft | preview | export print | deleteallconversations' },
            edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
            view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview | showcomments' },
            insert: { title: 'Insert', items: 'image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
            format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks align lineheight | language | removeformat' },
            tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
            table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
          },
          toolbar: 'undo redo | blocks link image | ' +
            'bold italic | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat',
          block_formats: 'Paragraph=p; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6',
          images_upload_handler: handleImageUpload,
          content_css: false,
          content_style: `
            @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap');
            body {
              font-family: 'Lora', serif;
              padding: 10px;
              color: #333;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #444;
            }
          `,
        }}
        
      />
    </div>
  );
}