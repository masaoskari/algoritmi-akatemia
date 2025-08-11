export default function LoadingExercise() {
  return (
    <>
      <h2 className="mt-4">Harjoitus</h2>
      <div className="rounded shadow-lg">
        <div className="bg-blue-600 rounded-tl-md rounded-tr-md">
          <div className="flex justify-between items-center p-4">
            <span className="text-white text-lg">⏳ Ladataan...</span>
            <span className="text-white">--/-- pistettä</span>
          </div>
        </div>
        <div className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </>
  );
}
