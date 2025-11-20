'use client';

import { useState } from 'react';

type Question = {
  id: string;
  prompt: string;
  options: Array<{ label: string; value: string }>;
};

const QUESTIONS: Question[] = [
  {
    id: 'style',
    prompt: 'Which creative style best describes you?',
    options: [
      { label: 'Bold & Vibrant', value: 'bold' },
      { label: 'Minimal & Chic', value: 'minimal' },
      { label: 'Classic & Timeless', value: 'classic' },
    ],
  },
  {
    id: 'focus',
    prompt: 'Your primary summit focus?',
    options: [
      { label: 'Learning', value: 'learning' },
      { label: 'Networking', value: 'networking' },
      { label: 'Showcasing Work', value: 'showcase' },
    ],
  },
];

export default function QuizHome() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <section className="max-w-2xl mx-auto p-6 space-y-6 bg-white text-black rounded-2xl border border-gray-200 shadow-sm">
      <header className="text-center space-y-2">
        <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Luxury Persona</p>
        <h1 className="text-3xl font-bold">Discover your Atinuda style</h1>
        <p className="text-gray-600 text-sm">
          Answer a few prompts to see which summit persona fits you best. Replace this placeholder with the real quiz
          when available.
        </p>
      </header>

      <div className="space-y-6">
        {QUESTIONS.map((q) => (
          <div key={q.id} className="space-y-3">
            <p className="font-semibold">{q.prompt}</p>
            <div className="flex flex-wrap gap-3">
              {q.options.map((option) => {
                const active = answers[q.id] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(q.id, option.value)}
                    className={`px-4 py-2 text-sm rounded-full border transition ${
                      active ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-700 hover:border-black'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-lg bg-black text-white py-3 font-semibold hover:bg-gray-900"
      >
        Get persona
      </button>

      {submitted && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          Thanks! Replace this notice with real persona logic. Selected:{' '}
          <code className="text-xs">{JSON.stringify(answers)}</code>
        </div>
      )}
    </section>
  );
}
