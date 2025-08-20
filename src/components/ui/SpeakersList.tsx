import React from 'react';

type SpeakersListProps = {
  day: string;
};

const SpeakersList: React.FC<SpeakersListProps> = ({ day }) => {
  return (
    <section className="my-8">
      <h2 className="text-xl font-bold mb-4">{day} Keynote Speakers</h2>
      {/* Placeholder for speaker list */}
      <div className="space-y-4">
        <div className="p-4 border rounded shadow">
          <p className="font-semibold">Dr. Jane Doe</p>
          <p className="text-sm text-gray-600">Topic: Future of AI in Healthcare</p>
          <span className="inline-block mt-2 px-3 py-1 text-sm bg-mint-500 text-white rounded-full">
            Speaking Now
          </span>
          <button className="block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Ask a Question
          </button>
        </div>
        {/* Add more speakers here */}
      </div>
    </section>
  );
};

export default SpeakersList;

