'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import Image from 'next/image';

export type AccordionItem = {
  id: string;
  title: ReactNode;
  image: string;
  content: ReactNode;
};

export type AccordionWithImageProps = {
  items: AccordionItem[];
  selectedIndex: number | null;
  quantity: number;
  onIncrement: (index: number) => void;
  onDecrement: (index: number) => void;
  onCheckout: () => void;
};

const AccordionWithImage: React.FC<AccordionWithImageProps> = ({
  items,
  selectedIndex,
  quantity,
  onIncrement,
  onDecrement,
  onCheckout,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [lastImage, setLastImage] = useState<string>(items[0].image);

  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('accordionIndex');
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) {
        setOpenIndex(parsed);
        setLastImage(items[parsed]?.image || items[0].image);
        return;
      }
    }
    setOpenIndex(0);
    setLastImage(items[0].image);
  }, [items]);

  useEffect(() => {
    if (openIndex !== null) {
      setLastImage(items[openIndex].image);
      localStorage.setItem('accordionIndex', String(openIndex));
    }
  }, [openIndex, items]);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="flex flex-col md:flex-row w-full gap-6">
      {/* Accordion Panel */}
      <div className="w-full md:w-1/2">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.id} className="border-b border-gray-300">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between py-4 text-left font-semibold text-lg focus:outline-none"
                aria-expanded={isOpen}
                aria-controls={`accordion-content-${index}`}
              >
                <span>{item.title}</span>
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`accordion-content-${index}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden text-sm text-gray-700 pb-4"
                  >
                    <div>
                      {item.content}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => onDecrement(index)}
                          className="border px-2 py-1 text-sm"
                        >
                          -
                        </button>
                        <span className="font-semibold">
                          {selectedIndex === index ? quantity : 0}
                        </span>
                        <button
                          onClick={() => onIncrement(index)}
                          className="border px-2 py-1 text-sm"
                        >
                          +
                        </button>
                      </div>

                      {selectedIndex === index && quantity > 0 && (
                        <div className="mt-4">
                          <button
                            onClick={onCheckout}
                            className="bg-[#ff7f41] text-white font-medium px-4 py-2 rounded hover:bg-[#e66a30] transition"
                          >
                            Go to Checkout
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Image Preview Panel */}
      <div className="w-full md:w-1/2 h-[300px] md:h-auto flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden">
        <Image
          src={lastImage}
          alt="Accordion visual"
          className="object-cover w-full h-full transition duration-300"
          width={600}
          height={400}
        />
      </div>
    </div>
  );
};

export default AccordionWithImage;

