"use client";

export default function ErrorMessage({ message }) {
  return (
    <p className="text-red-600 text-lg mb-6 font-semibold" role="alert">
      {message}
    </p>
  );
}
