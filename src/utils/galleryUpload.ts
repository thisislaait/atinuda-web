// utils/galleryUpload.ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { storage, db } from "@/firebase/config";
import { GalleryImageSchema } from "@/types/imageSchema";
import { v4 as uuidv4 } from "uuid";

export const uploadGalleryImage = async (
    file: File,
    uploaderId: string,
    caption: string,
    taggedUserIds: string[]
    ) => {
    const fileRef = ref(storage, `gallery/${uuidv4()}-${file.name}`);
    await uploadBytes(fileRef, file);

    const url = await getDownloadURL(fileRef);

    const imageData = {
        url,
        uploaderId,
        caption,
        taggedUserIds,
        uploadedAt: Timestamp.now(),
    };

    const validated = GalleryImageSchema.safeParse(imageData);
    if (!validated.success) {
        throw new Error("Invalid image metadata");
    }

    const docRef = await addDoc(collection(db, "gallery"), validated.data);

    return { id: docRef.id, ...validated.data };
    };
