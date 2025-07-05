"use client";

export default function FactCard({ text, category }) {
  return (
    <article className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-blue-300 p-10 transition-shadow hover:shadow-2xl">
      <p className="mb-6 text-2xl leading-relaxed text-gray-900 font-semibold tracking-wide">
        {text}
      </p>
      <span className="inline-block px-4 py-2 text-sm font-semibold bg-blue-300 text-blue-900 rounded-full select-none tracking-wide">
        {category}
      </span>
    </article>
  );
}
