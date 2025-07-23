import React from 'react';
import Link from 'next/link';

const QuizHome = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F2] text-[#333] flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-wide uppercase">What’s Your High-End Persona?</h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl">Luxury isn’t one-size-fits-all. Discover your unique persona and see how you match with the world’s most elite brands.</p>
      </div>
      
      <div className="mt-8">
<Link href="/luxury-persona/quiz" className="bg-black text-white px-8 py-4 text-lg uppercase tracking-wide rounded-full hover:bg-gray-800 transition-all">
          Start Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizHome;
