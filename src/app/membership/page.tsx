'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MembersPage() {
  return (
    <main className="bg-white text-black">
      {/* Hero Banner */}
      <section className="relative w-full h-screen">
        <Image
          src="/assets/images/elementfour.png"
          alt="Atinuda Members Club"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-6xl hero-text text-white mb-4">
            Members of Influence
          </h1>
          <p className="text-lg text-gray-300 max-w-xl">
            A world of exclusivity, crafted experiences, and elite circles. Welcome to Atinuda’s private membership community.
          </p>
          <motion.button
            whileHover={{ backgroundColor: "#ff7f41" }}
            className="mt-6 px-6 py-2 text-white border border-white uppercase rounded transition-colors"
          >
            Explore More
          </motion.button>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-white py-20 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-5xl hero-text text-black mb-6">
          The Club for Creatives, Visionaries & Cultural Game-Changers
        </h2>
        <p className="text-gray-700 text-lg">
          From the minds behind Africa’s most anticipated wedding summit comes a sanctuary where ideas flourish, deals unfold, and moments transcend.
        </p>
      </section>

      {/* Featured Experience */}
      <section className="bg-[#fff8f3] py-20 px-6">
        <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
          <Image
            src="/assets/images/Maritius.png"
            alt="Retreat in Mauritius"
            width={600}
            height={400}
            className="rounded-xl object-cover"
          />
          <div>
            <h3 className="text-3xl hero-text text-black mb-4">
              The Atinuda Retreat – Mauritius 2026
            </h3>
            <p className="text-gray-600 text-lg">
              A luxurious escape for those who move culture forward. Sip, swim, connect with global leaders.
            </p>
          </div>
        </div>
      </section>

      {/* Global Impact */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-5xl hero-text text-black mb-6">
          From Lagos to the World
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-700">
          Atinuda doesn’t just host experiences; we export influence. Our members connect across continents to redefine luxury, leadership, and legacy.
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 px-6 max-w-6xl mx-auto">
          <Image src="/assets/images/Morrocco.webp" alt="Morrocco" width={300} height={200} className="rounded-xl" />
          <Image src="/assets/images/kigali.jpg" alt="Kigali" width={300} height={200} className="rounded-xl" />
          <Image src="/assets/images/Mauritius2.png" alt="Mauritius" width={300} height={200} className="rounded-xl" />
          <Image src="/assets/images/theatre.png" alt="Lagos" width={300} height={200} className="rounded-xl" />
        </div>
      </section>

      {/* Call to Action with elementsix background */}
      <section className="relative py-20 text-white text-center px-6">
        <Image
          src="/assets/images/elementsix.png"
          alt="Background"
          fill
          className="object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/70 z-10" />
        <div className="relative z-20">
          <h2 className="text-4xl hero-text mb-4">Join the Circle of Influence</h2>
          <p className="max-w-xl mx-auto text-lg text-gray-300 mb-6">
            Unlock priority invites, bespoke experiences, and curated connections.
          </p>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 bg-[#ff7f41] text-white uppercase tracking-wide rounded hover:bg-[#e66a30] transition"
          >
            Become a Member
          </Link>
        </div>
      </section>
    </main>
  );
}

