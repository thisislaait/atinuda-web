'use client';

import React from 'react';

import ExpectSection from '../sections/home/ExpectSection';
import SummitSpeakers from '../sections/home/SummitSpeakers';
import SummitSponsors from '../sections/home/SummitSponsors';
import BecomeSponsor from '../sections/home/BecomeSponsor';
// import SummitNews from './summit/components/SummitNews';
import BottomNav from '../components/layout/Nav/BottomNav';
import SummitHero from '../sections/home/SummitHero';
import AboutSummit from '../sections/home/AboutSummit';

const SummitPage = () => {
  return (
    <div>
      <div className="relative">
        <SummitHero />
        <BottomNav />
      </div>

      <ExpectSection />
      <AboutSummit />
      <SummitSpeakers />
      <SummitSponsors />
      <BecomeSponsor />
      {/* <SummitNews /> */}
    </div>
  );
};

export default SummitPage;
