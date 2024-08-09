import { TUser } from "@/contexts";
import { db } from "@/utils/firebaseConfig";
import { User } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

interface props {
    username: string;
    user: User | null;
    isLoading: boolean;
}
export const checkIfUsernameTaken = async ({ username, user }: props) => {
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);

    let userWithUserName = {} as TUser
    querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        userWithUserName = data as TUser
    });
    if (user && user?.uid === userWithUserName?.uid) {
        return true
    } else return querySnapshot.empty;
};
