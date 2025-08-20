'use client';

import Image from 'next/image';
import ExperienceSection from '../../sections/home/ExperienceSection';

const AboutPage = () => {
  return (
    <div className="relative text-black">
      {/* Hero Section */}
      <section id='hero' className="relative w-full h-[90vh]">
        <Image
          src="/assets/images/AtinudaAbout.png"
          alt="About"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/45 60 z-10" />
        <div className="absolute inset-0 flex items-center justify-center text-left px-6 z-20">
          <h1 className="text-white hero-text text-4xl md:text-5xl font-semibold tracking-wide max-w-4xl leading-snug">
            We’re an independent, lifestyle event providing high-end experiences for everyone.
          </h1>
        </div>
      </section>

      {/* Overview Section */}
      <section className="max-w-5xl mx-auto px-3 py-16 space-y-10">
        <div>
          <h2 className="text-xs text-black uppercase nav-text text-left pb-2 border-b border-black"
            style={{ letterSpacing: "0.3em" }}>
            Who We Are
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-gray-700 mt-6">
            At Atinuda, we create intentional, refined, and boundary-pushing experiences across culture, design, events, and influence.
            From summits to retreats, brand activations to private dinners — we help people and brands make bold moves and lasting connections.
          </p>
        </div>

        {/* Why Join Section */}
        <div>
          <h2 className="text-xs text-black uppercase nav-text text-left pb-2 border-b border-black"
            style={{ letterSpacing: "0.3em" }}>
            Why Join Atinuda?
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              {
                title: "Curated Access",
                description: "Be part of exclusive, high-impact gatherings, designed for industry leaders and creative thinkers.",
              },
              {
                title: "Global Network",
                description: "Join a growing collective of visionaries, founders, creatives, and collaborators shaping the future.",
              },
              {
                title: "Strategic Visibility",
                description: "Position your brand at the intersection of culture, influence, and commerce.",
              },
            ].map((card, index) => (
              <div key={index} className="bg-white p-6 shadow-md hover:shadow-lg transition rounded-md">
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>

        <ExperienceSection />

        {/* Two Column Form Section */}
      <div className="py-20 px-3">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          {/* Left Column */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-5xl font-medium hero-text leading-tight">Learn more about luxury lifestyle by signing up for free</h1>
            <p className="text-lg">
              For our latest experiences and editorials, be the first in the know.
            </p>
            <p className="text-lg">
              You will learn about upcoming experiences happening worldwide and the secrets and lifestyle of a sybarite...
            </p>
          </div>

          {/* Right Column: Modern Form */}
          <div className="md:w-1/2 bg-white p-8 rounded-2xl shadow-xl w-full">
            <form className="space-y-6">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:border-black"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:border-black"
              />
              <textarea
                rows={4}
                placeholder="Tell us what you're looking for"
                className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                className="w-full py-4 bg-black text-white rounded uppercase tracking-wider hover:bg-gray-800 transition"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
