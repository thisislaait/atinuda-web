/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SpeakerModal from './SpeakerModal';

const speakers = [
  {
    id: 1,
    name: 'Preston Bailey',
    title: 'Event Producer',
    company: 'Preston Bailey Events',
    image: '/assets/images/Preston.jpeg',
    topic: 'Designing Dreams: Transforming Spaces with Emotion',
    bio: 'Preston Bailey is an internationally celebrated event designer known for his ability to transform ordinary spaces into theatrical environments. With a career spanning over four decades, he has become a leading figure in the event and wedding design industry. Born in Panama and later relocating to New York City, Preston initially pursued fashion modeling before discovering his passion for floral design. He launched his design business in 1980, and quickly gained recognition for his bold, opulent, and immersive event experiences. His client list includes celebrities, royalty, CEOs, and high-profile weddings and galas around the world.'
    },
  {
    id: 2,
    name: 'TY Bello',
    title: 'Creative Director',
    company: 'TY Bello Photography',
    image: '/assets/images/TY.png',
    topic: 'The Power of Storytelling Through Photography',
    bio: 'TY Bello is renowned for her distinctive portrait style and has photographed presidents, celebrities, and everyday people with equal grace. One of her most viral moments came in 2016 when she discovered Olajumoke Orisaguna, a bread seller, during a street shoot with British rapper Tinie Tempah. TY’s photo of Jumoke led to the her modeling career and widespread media attention.'
  },
  {
    id: 3,
    name: 'Ndidi Okonkwo Nwuneli',
    title: 'President / CEO',
    company: 'ONE Campaign',
    image: '/assets/images/Ndidi.jpeg',
    topic: 'Leadership with Purpose: Building for Impact',
    bio: 'Ndidi Okonkwo Nwuneli is a globally recognized expert in agriculture, nutrition, social innovation, and entrepreneurship, with over 25 years of international development experience. In April 2024, she became the President and CEO of The ONE Campaign, a global advocacy organization dedicated to ending extreme poverty and preventable diseases, particularly in Africa.',
  },
  {
    id: 4,
    name: 'David Tutera',
    title: 'Founder',
    company: 'David Tutera Experience',
    image: '/assets/images/David.jpg',
    topic: 'Designing Dreams: Transforming Spaces with Emotion',
    bio: 'David Tutera is a globally celebrated lifestyle and event expert with over 30 years of experience in designing luxurious weddings, parties, and special events for celebrities, royalty, politicians, and discerning clients worldwide. Known for his meticulous attention to detail and unique artistic vision, David has built a reputation as one of the most talented and sought-after event planners in the world. Tutera began his career at the age of 19 with just one client and quickly rose to prominence through his innovative designs and passion for creating memorable experiences.',
  },
  {
    id: 5,
    name: 'Oke Maduewesi',
    title: 'Founder / CEO',
    company: 'Zaron Group',
    image: '/assets/images/Oke.webp',
    topic: 'Designing Dreams: Transforming Spaces with Emotion',
    bio: 'Preston Bailey is a celebrated floral and event designer known for his ability to transform ordinary spaces into lavish theatrical environments...',
  },
  {
    id: 6,
    name: 'Chike Nwobu',
    title: 'President',
    company: 'MunaLuchi',
    image: '/assets/images/Chike.jpg',
    topic: 'Designing Dreams: Transforming Spaces with Emotion',
    bio: 'Preston Bailey is a celebrated floral and event designer known for his ability to transform ordinary spaces into lavish theatrical environments...',
  },
  {
    id: 7,
    name: 'Marcy Blum',
    title: 'Owner',
    company: 'Marcy Blum Associates',
    image: '/assets/images/Marcy.jpg',
    topic: 'Designing Dreams: Transforming Spaces with Emotion',
    bio: 'Preston Bailey is a celebrated floral and event designer known for his ability to transform ordinary spaces into lavish theatrical environments...',
  },
  {
    id: 8,
    name: 'Frances Quarcoopome',
    title: 'Founder',
    company: 'JamJar',
    image: '/assets/images/Frances.png',
    topic: 'Designing Dreams: Transforming Spaces with Emotion',
    bio: 'Preston Bailey is a celebrated floral and event designer known for his ability to transform ordinary spaces into lavish theatrical environments...',
  },
];

const SummitSpeakers = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      const speakers = scrollContainer.children;
      const speakerWidth = speakers[0].clientWidth + 32; // speaker width + gap

      scrollContainer.scrollTo({
        left:
          direction === 'left'
            ? scrollContainer.scrollLeft - speakerWidth
            : scrollContainer.scrollLeft + speakerWidth,
        behavior: 'smooth',
      });
    }
  };

  const openModal = (speaker: any) => {
    setSelectedSpeaker(speaker);
    setIsModalOpen(true);
  };

  return (
    <section
      id="summit-speakers"
      className="relative w-full min-h-screen flex flex-col justify-center items-center text-center text-white p-8"
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/images/RepeatBg.jpg"
          alt="Speakers Background"
          fill
          style={{ objectFit: 'cover' }}
          className="w-full h-full"
        />
      </div>

      {/* Section Header */}
      <h2 className="text-6xl font-primary hero-text mb-4">Past Atinuda Speakers</h2>
      <p className="max-w-2xl text-2xl hero-text text-gray-300">
        Meet our industry leaders and visionaries who have shared invaluable insights at the summit.
      </p>

      {/* Scrollable Speaker List */}
      <div className="relative w-full max-w-6xl mt-8 overflow-hidden">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg z-10"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Speaker List */}
        <div ref={scrollRef} className="flex gap-32 px-20 py-6 overflow-hidden scroll-smooth">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="flex flex-col items-center min-w-[200px]">
              <div className="w-48 h-48 rounded-full overflow-hidden">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl hero-text mt-4">{speaker.name}</h3>
              <p
                className="text-sm nav-text uppercase font-extrabold text-gray-300"
                style={{ letterSpacing: '0.2em' }}
              >
                {speaker.title}
              </p>
              <p
                className="text-xs uppercase font-extrabold nav-text text-[#ff7f41]"
                style={{ letterSpacing: '0.2em' }}
              >
                {speaker.company}
              </p>

              {/* Read More */}
              <motion.span
                onClick={() => openModal(speaker)}
                className="mt-2 cursor-pointer hero-text text-xs text-gray-300 relative"
                initial={{ backgroundSize: '0% 1px' }}
                whileHover={{ backgroundSize: '100% 1px' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{
                  backgroundImage: 'linear-gradient(to right, white, white)',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '0 100%',
                  backgroundSize: '0% 1px',
                }}
              >
                Read More
              </motion.span>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg z-10"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Speaker Modal */}
      <SpeakerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        speaker={selectedSpeaker}
      />
    </section>
  );
};

export default SummitSpeakers;

