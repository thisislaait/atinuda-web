// components/ExperienceSection.tsx
import Image from "next/image";

const experiences = [
  {
    title: "Summit 2025",
    description:
      "Join global thought leaders and visionaries atop the Swiss Alps. An immersive summit experience blending intellect, innovation, and breathtaking alpine beauty. Expect fireside conversations, private panels, and curated networking. An invitation-only event for the refined explorer.",
    image: "/assets/images/Conference.png",
  },
  {
    title: "Retreat 2026",
    description:
      "Escape to serenity with a deeply rejuvenating wellness retreat in Bali. Indulge in personalized spa therapies, spiritual healing, and nature-immersed yoga flows. Every detail is crafted to restore body and soul. A retreat made for the discerning sybarite.",
    image: "/assets/images/Maritius.png",
  },
  {
    title: "Gala Dinner",
    description:
      "Step into an evening of splendor at our signature Gala Dinner. Held in an opulent heritage venue, enjoy world-class cuisine, vintage wines, and live classical performances. Mingle with elite guests in a celebration of elegance and fine living.",
    image: "/assets/images/Dinner.png",
  },
];

export default function ExperienceSection() {
  return (
    <section className="w-full px-2 py-16 sm:px-4 bg-white">
      <h2
        className="text-xs text-black uppercase nav-text text-left pb-2 border-b border-black"
        style={{ letterSpacing: "0.3em" }}
      >
        Ready for an Adventure?
      </h2>

      <div className="space-y-12 mt-8">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row gap-6 items-start"
          >
            <div className="relative w-full md:w-1/3 h-64">
              <Image
                src={exp.image}
                alt={exp.title}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-semibold mb-2">{exp.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
