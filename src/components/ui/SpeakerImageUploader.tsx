// components/SpeakerImageUploader.tsx
'use client';

import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '@/firebase/config'; // your initialized app

const storage = getStorage(app);
const db = getFirestore(app);

export default function SpeakerImageUploader({ speakerId }: { speakerId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.type === 'image/png' ? 'png' : 'jpg';
      const path = `speakers/${speakerId}/portrait.${ext}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file, { contentType: file.type });
      const url = await getDownloadURL(storageRef);

      // Save on the speaker doc
      await setDoc(doc(db, 'speakers', speakerId), { photoURL: url, photoPath: path }, { merge: true });
      alert('Uploaded!');
    } catch (e) {
      console.error(e);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        disabled={!file || uploading}
        onClick={handleUpload}
        className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {uploading ? 'Uploading…' : 'Upload Speaker Image'}
      </button>
    </div>
  );
}
