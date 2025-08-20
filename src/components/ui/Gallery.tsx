// components/ui/Gallery.tsx
'use client';

import { useState } from 'react';
import GalleryModal from './GalleryModal';

const images = [
  {
    id: 1,
    src: '/images/gallery1.jpg',
    caption: 'Keynote Speech, Day 1',
  },
  {
    id: 2,
    src: '/images/gallery2.jpg',
    caption: 'Dinner Setup',
  },
  {
    id: 3,
    src: '/images/gallery3.jpg',
    caption: 'Workshop in Session',
  },
  // Add more...
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <div id="gallery" className="columns-1 sm:columns-2 md:columns-3 gap-4 p-4 space-y-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="break-inside-avoid cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.src}
              alt={image.caption}
              className="w-full rounded-lg shadow-md hover:opacity-90 transition"
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <GalleryModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </>
  );
};

export default Gallery;
