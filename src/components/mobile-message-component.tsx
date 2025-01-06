export const MobileMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-xl font-bold mb-4 text-indigo-600">Desktop View Recommended</h2>
        <p className="text-gray-600 mb-4">
          This application is optimized for desktop viewing. For the best experience, 
          please open this page on a larger screen or switch to desktop mode.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};