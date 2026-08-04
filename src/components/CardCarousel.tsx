'use client';

import { useState, type ReactNode } from 'react';

// Carousel sederhana pengganti Alpine.js x-data chunk carousel di versi
// Laravel — kartu dikelompokkan 6 per halaman dengan navigasi panah + titik.
export default function CardCarousel({ items }: { items: ReactNode[] }) {
  const chunkSize = 6;
  const chunks: ReactNode[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  const [index, setIndex] = useState(0);
  const total = chunks.length;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {chunks.map((chunk, i) => (
            <div key={i} className="w-full flex-shrink-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{chunk}</div>
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setIndex(index > 0 ? index - 1 : total - 1)}
            aria-label="Sebelumnya"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-soft transition hover:bg-brand-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex gap-2">
            {chunks.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${index === i ? 'w-6 bg-brand-600' : 'w-2 bg-slate-300'}`}
              />
            ))}
          </div>
          <button
            onClick={() => setIndex(index < total - 1 ? index + 1 : 0)}
            aria-label="Berikutnya"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-soft transition hover:bg-brand-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
