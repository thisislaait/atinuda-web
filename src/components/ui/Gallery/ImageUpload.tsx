'use client';

import { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebase/config";
import { auth } from "@/firebase/config";
import { v4 as uuidv4 } from 'uuid';

const ImageUpload = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState("");

    const handleUpload = async () => {
        if (!imageFile) return alert("Please select a file");

        const user = auth.currentUser;
        if (!user) return alert("You must be logged in");

        const storageRef = ref(storage, `uploads/${user.uid}/${uuidv4()}_${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        setUploading(true);

        uploadTask.on(
        "state_changed",
        (snapshot) => {
            const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(percent);
        },
        (error) => {
            console.error("Upload failed:", error);
            setUploading(false);
        },
        async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setDownloadURL(url);
            setUploading(false);
        }
        );
    };

    return (
        <div className="bg-white p-6 rounded shadow w-full max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-4">Upload an Image</h2>
        <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="mb-4"
        />
        <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={uploading}
        >
            {uploading ? `Uploading (${progress.toFixed(0)}%)...` : "Upload"}
        </button>

        {downloadURL && (
            <div className="mt-4">
            <p className="text-sm text-gray-600">Uploaded Image:</p>
            <img src={downloadURL} alt="Uploaded" className="mt-2 max-w-full rounded" />
            </div>
        )}
        </div>
    );
    };

    export default ImageUpload;
