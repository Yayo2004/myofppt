"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <h1 className="mb-2 text-6xl font-bold text-gray-300">500</h1>
      <p className="mb-6 text-lg text-gray-500">
        Une erreur est survenue
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Réessayer
      </button>
    </div>
  );
}
