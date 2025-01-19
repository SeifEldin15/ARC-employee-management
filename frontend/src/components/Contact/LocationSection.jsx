import Link from 'next/link';

const LocationSection = ({ address, region, companyId, onDeleteCompany }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/company/${companyId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete company');
        }

        // Redirect to contacts page after successful deletion
        window.location.href = '/contacts';
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.15)] p-8">
        <div className="flex items-center justify-between">
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
                <p className="text-gray-700">{address || 'Loading...'}</p>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {region || 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition-colors text-white font-medium"
            title="Delete company"
          >
            Delete Company
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
