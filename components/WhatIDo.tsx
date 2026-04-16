"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { src: "/photos/1.png" },
  { src: "/photos/2.png" },
  { src: "/photos/3.png" },
  { src: "/photos/4.png" },
  { src: "/photos/5.png" },
  { src: "/photos/6.png" },
  { src: "/photos/7.png" },
  { src: "/photos/8.png" },
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function WhatIDo() {
  const [[index, direction], setPage] = useState([0, 0]);

  const paginate = (newDir: number) => {
    setPage(([prev]) => [(prev + newDir + slides.length) % slides.length, newDir]);
  };

  const slide = slides[index];

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What I Do Now</h2>
        <p className="text-muted-foreground text-lg">A glimpse into my current life and work</p>
      </div>

      <div className="relative w-full max-w-sm">
        {/* Instagram-style portrait slide */}
        <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-muted shadow-xl">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div
                className="w-full h-full bg-zinc-200 dark:bg-zinc-800"
                style={{
                  backgroundImage: `url(${slide.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center top",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border border-black/10 rounded-full p-2 shadow-md transition-all z-10"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 text-black" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border border-black/10 rounded-full p-2 shadow-md transition-all z-10"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage([i, i > index ? 1 : -1])}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "bg-primary w-6" : "bg-muted-foreground/30 w-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
