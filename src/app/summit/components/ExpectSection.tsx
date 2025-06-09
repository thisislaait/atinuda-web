'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Experience {
  id: number;
  title: string;
  tag: string;
  description: string;
  image: string;
}

const experiences: Experience[] = [
  {
    id: 1,
    title: 'Atinuda Retreat 2026',
    tag: 'Member Privilege',
    description: 'Sun, sea, and the right company. An invitation to step away, recharge, and connect with the industry’s best in Mauritius.',
    image: '/assets/images/Maritius.png',
  },
  {
    id: 2,
    title: 'Local to Global Summit 2025',
    tag: 'Exclusive Event',
    description: 'Where bold ideas, big deals, and creative influence come together. This is the room you want to be in.',
    image: '/assets/images/Conference.png',
  },
  {
    id: 3,
    title: 'Networking Dinner',
    tag: 'Invite Only',
    description: 'Good food, great company, and conversations that go beyond small talk—A table set for game-changers.',
    image: '/assets/images/Dinner.png',
  },
  {
    id: 4,
    title: 'Brands Cocktail Mixer',
    tag: 'VIP Access',
    description: 'An evening of style, connections, and quiet power moves. Let’s talk, sip, and make things happen.',
    image: '/assets/images/CocktailMixer.png',
  },
];


const ExpectSummit = () => {

  return (
    <section id="expect-summit" className="w-full py-16 px-8">
      {/* Section Header */}
      <h2
        className="text-xs font-primary text-black nav-text border-b border-gray-300 pb-2 mb-8 uppercase"
        style={{ letterSpacing: '0.3em' }}
      >
        Upcoming Experiences
      </h2>

      {/* Experiences in Rows of 2 */}
      <div className="flex flex-col gap-8">
        {experiences.map((experience, index) => (
          index % 2 === 0 && (
            <div key={experience.id} className="flex flex-col md:flex-row gap-8">
              {/* First Experience */}
              <ExperienceCard data={experience} />
              {/* Second Experience */}
              {experiences[index + 1] && <ExperienceCard data={experiences[index + 1]} />}
            </div>
          )
        ))}
      </div>
    </section>
  );
};

const ExperienceCard = ({ data }: { data: Experience }) => {
  const linkHref = data.id === 1 ? "/join-the-waitlist" : "/ticket-payment";

  return (
    <div className="w-full md:w-1/2 bg-white shadow-lg p-6 flex flex-col gap-2">
      <Image
        src={data.image}
        alt={data.title}
        width={600}
        height={600}
        className="w-full h-80 object-cover"
      />
      <span
        className="text-sm nav-text uppercase text-gray-500"
        style={{ letterSpacing: '0.3em' }}
      >
        {data.tag}
      </span>
      <h3 className="text-2xl hero-text text-black">{data.title}</h3>
      <p className="text-sm text-gray-600">{data.description}</p>
      <div className="flex items-center gap-4 mt-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff7f41] text-white">
          <ArrowRight size={20} />
        </button>
      
        <Link href={linkHref} passHref>
          <motion.a
            whileHover={{ backgroundColor: "#ff7f41" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative px-6 py-2 border border-gray-500 text-black nav-text font-medium uppercase overflow-hidden group"
          >
            <span className="relative z-10">Make a Reservation</span>
            <span className="absolute inset-0 w-0 bg-[#ff7f41] transition-all duration-300 group-hover:w-full"></span>
          </motion.a>
        </Link>

      </div>
    </div>
  );
};

export default ExpectSummit;
