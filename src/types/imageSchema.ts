// types/imageSchema.ts
import { z } from "zod";

export const GalleryImageSchema = z.object({
    url: z.string().url(),
    uploaderId: z.string(),
    caption: z.string().optional(),
    taggedUserIds: z.array(z.string()),
    uploadedAt: z.any(), // Firestore Timestamp
});

export type GalleryImage = z.infer<typeof GalleryImageSchema>;
