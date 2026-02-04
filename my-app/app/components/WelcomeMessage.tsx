"use client";

import React, { useState } from "react";

export default function WelcomeMessage() {
  const [isHovered, setIsHovered] = useState(false);

  // Orange highlight: forms "I love fun"
  const orange = (text: string) => (
    <span
      className={`transition-all duration-300 ${
        isHovered ? "font-bold text-orange-500 text-2xl" : ""
      }`}
    >
      {text}
    </span>
  );

  // Blue highlight: forms "I love programming"
  const blue = (text: string) => (
    <span
      className={`transition-all duration-300 ${
        isHovered ? "italic text-blue-500 text-2xl" : ""
      }`}
    >
      {text}
    </span>
  );

  return (
    <div
      className="text-left"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h1 className="text-6xl font-bold text-zinc-900 dark:text-purple-600 mb-6">
        Welcome to My Digital Playground
      </h1>


      {/* Two-column layout: text left, image right */}
      <div className="flex flex-col md:flex-row gap-8 mt-4">
        {/* Left column: text */}
        <div className="flex-1">
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4 italic">
            🚧 This page is a very work in progress as {blue("I")} explore the world of React and front-end development.
            Expect experiments, iterations, and the occasional delightful chaos!
          </p>

          <p className="standard-text mt-0">
            What {orange("I")} enjoy most is building things that work beautifully—there&apos;s nothing quite
            like seeing structured code come together. {orange("love")} for clean architecture drives
            everything I create. But this space? It&apos;s where {orange("fun")} takes the wheel.
          </p>

          <p className="standard-text">
            Beyond the polished projects, I {blue("love")} experimenting freely. This is my informal playground,
            a deep dive into my playful spirit where {blue("programming")} meets creativity. Welcome to the
            intersection of precision and curiosity!
          </p>

        </div>

        {/* Right column: image placeholder */}
        <div className="w-full md:w-156 shrink-0">
          <div className="w-full h-156 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden border
           border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
            {/* Replace with your image */}
            <span className="text-zinc-400 dark:text-zinc-500 text-sm">Image placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
}
