// Ikon SVG sederhana, disalin persis dari resources/views/components/icon.blade.php
// (versi Laravel) supaya tampilannya identik.

const paths: Record<string, string> = {
  wheat:
    'M12 2v20M8 6c0 2 4 2 4 4s-4 2-4 4 4 2 4 4M16 6c0 2-4 2-4 4s4 2 4 4-4 2-4 4',
  sparkles:
    'M9 4.5 10.5 9 15 10.5 10.5 12 9 16.5 7.5 12 3 10.5 7.5 9 9 4.5ZM18 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z',
  cake: 'M4 21v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7M4 21h16M4 14v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2M12 4v4m-3-4c0 1.5 1.343 2 3 2s3-.5 3-2-1.343-2-3-2-3 .5-3 2Z',
  leaf: 'M5 21c9 0 14-5 14-14V5h-2C8 5 5 12 5 19v2Zm0 0c0-3 1-6 3-8',
  gift: 'M3 10h18v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3ZM4 14h16v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6ZM12 10V6M12 6C10.5 6 9 5.2 9 4s1.5-2 3-2 3 .8 3 2-1.5 2-3 2Z',
  fire: 'M12 22c4 0 7-2.5 7-6.5 0-3-2-4.5-2.5-7C15.8 10 14 11 14 8c0-2-1-4-2-5-.3 2.5-2 4-3.5 6C7 11 5 12.5 5 15.5 5 19.5 8 22 12 22Z',
  basket:
    'm3 9 2-5h14l2 5M3 9h18M3 9l1.5 10.5A2 2 0 0 0 6.48 21h11.04a2 2 0 0 0 1.98-1.5L21 9M9 13v3m6-3v3',
};

const doublePaths: Record<string, string[]> = {
  eye: [
    'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z',
    'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  ],
  'eye-off': [
    'M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88',
  ],
};

export type IconName = keyof typeof paths | keyof typeof doublePaths;

export function Icon({ icon, className = 'h-6 w-6' }: { icon: IconName; className?: string }) {
  const single = paths[icon];
  const double = doublePaths[icon];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.6}
      stroke="currentColor"
      className={className}
    >
      {single && <path strokeLinecap="round" strokeLinejoin="round" d={single} />}
      {double &&
        double.map((d) => <path key={d} strokeLinecap="round" strokeLinejoin="round" d={d} />)}
    </svg>
  );
}
