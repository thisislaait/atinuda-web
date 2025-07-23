// src/components/SpeakerModal.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Speaker {
  name: string;
  image: string;
  bio: string;
  topic: string;
}

interface SpeakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  speaker: Speaker | null;
}

const SpeakerModal = ({ isOpen, onClose, speaker }: SpeakerModalProps) => {
  if (!isOpen || !speaker) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-white max-w-4xl w-full rounded-lg p-8 shadow-lg relative flex flex-col md:flex-row gap-6"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg"
          >
            &times;
          </button>

          <div className="md:w-1/2 w-full">
            <Image
              src={speaker.image}
              alt={speaker.name}
              width={500}
              height={500}
              className="rounded-md object-cover w-full h-auto"
            />
          </div>

          <div className="md:w-1/2 w-full">
            <h2 className="text-3xl font-bold hero-text mb-2">{speaker.name}</h2>
            <p className="text-sm text-gray-500 italic mb-4">
              Topic: <span className="text-black font-medium">{speaker.topic}</span>
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{speaker.bio}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SpeakerModal;
