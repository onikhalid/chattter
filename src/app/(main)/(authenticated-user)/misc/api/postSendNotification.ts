import { doc, Firestore, setDoc } from 'firebase/firestore';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { TNotification, CreateNotificationInput } from '@/app/(main)/(authenticated-user)/misc/types/notification';
import { db } from '@/utils/firebaseConfig';
import { v4 } from 'uuid';


export const createNotification = async (
  input: CreateNotificationInput
): Promise<void> => {
  const notificationsCollectionsRef = collection(db, 'notifications');

  const notification_id = v4()
  const notificationsDocRef = doc(notificationsCollectionsRef, notification_id);

  const newNotification: TNotification = {
    receiver_id: input.receiver_id,
    sender_id: input.sender_id,
    read_status: false,
    sender_details: input.sender_details,
    receiver_details: input.receiver_details,
    notification_type: input.notification_type,
    notification_details: input.notification_details,
    created_at: new Date(),
    notification_id
  };
  console.log(newNotification)

  await setDoc(notificationsDocRef, newNotification);
};

export const useCreateNotification = (): UseMutationResult<void, unknown, CreateNotificationInput> => {
  return useMutation<void, unknown, CreateNotificationInput, unknown>({
    mutationFn: (input: CreateNotificationInput) => createNotification(input)
  });
};
