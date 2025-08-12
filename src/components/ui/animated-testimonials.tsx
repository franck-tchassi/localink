

"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isOpen, setIsOpen] = useState(false);

  const handleNext = () => {
    setDirection("right");
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection("left");
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const truncate = (text: string, maxLength = 180) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const current = testimonials[active];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-stretch lg:gap-24">
        {/* Image */}
        <div className="relative h-96 w-full max-w-md lg:h-[480px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              initial={{ opacity: 0, x: direction === "right" ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === "right" ? -100 : 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className=" h-full w-full"
            >
              <div className="relative h-full w-full overflow-hidden rounded-full shadow-2xl">
                <img
                  src={current.src}
                  alt={current.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
                  <h3 className="text-2xl font-bold">{current.name}</h3>
                  <p className="text-blue-200">{current.designation}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Miniatures */}
          <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > active ? "right" : "left");
                  setActive(index);
                }}
                className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  index === active ? "bg-blue-500 w-12" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Texte */}
        <div className="flex flex-2/3 flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-xl" 
            >
              <div className="relative space-y-4">
                <p className="text-base md:text-lg  font-medium leading-relaxed text-gray-800">
                  {truncate(current.quote)}
                </p>

                {/* Bouton Voir Plus */}
                {current.quote.length > 180 && (
                  <button
                    onClick={() => setIsOpen(true)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Voir plus
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Contrôles */}
          <div className="mt-12 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
              >
                <IconArrowLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
              >
                <IconArrowRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modale citation complète */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-lg rounded-2xl bg-white p-6 shadow-lg">
            <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
              Témoignage de {current.name}
            </Dialog.Title>
            <Dialog.Description className="text-gray-700 whitespace-pre-line">
              {current.quote}
            </Dialog.Description>
            <div className="mt-6 text-right">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Fermer
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};
