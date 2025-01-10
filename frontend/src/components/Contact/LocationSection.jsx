import Link from 'next/link';

const LocationSection = () => {
  return (
    <div className="max-w-4xl mx-auto ">
      {/* Location card */}
      <div className="bg-white rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.15)] p-8">
        <div className="flex items-center gap-8">
          {/* Building icon */}
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1H6z" />
              <path d="M7 5h6v2H7V5zm0 4h6v2H7V9zm0 4h6v2H7v-2z" />
            </svg>
          </div>

          {/* Address information */}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-gray-700">799 Innovation Way, San Francisco, CA 94105</p>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                US-WEST
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
