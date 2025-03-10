export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      <p className="text-lg text-gray-600">Loading cards...</p>
    </div>
  );
}; 