// utils/fetchTaggedImages.ts
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

export const fetchTaggedImages = async (userId: string) => {
    const q = query(
        collection(db, "gallery"),
        where("taggedUserIds", "array-contains", userId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };
