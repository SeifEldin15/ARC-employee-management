const Table = ({ tools }) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto mt-10">
      {/* Installed Tools Table */}
      <div>
        <h2 className="text-xl mb-4 text-center">Installed Tools</h2>
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.15)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tool Description</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Warranty Start</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Warranty End</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Warranty Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tools.map((tool) => {
                  const isInWarranty = new Date(tool.warrantyEnd) > new Date();
                  return (
                    <tr key={tool._id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm text-gray-900">{tool.PNumber}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm text-gray-900">{tool.toolDescription}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm text-gray-900">
                        {new Date(tool.warrantyStart).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm text-gray-900">
                        {new Date(tool.warrantyEnd).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded border ${
                          isInWarranty
                            ? 'border-green-500 text-green-600 bg-green-50/70' 
                            : 'border-red-500 text-red-600 bg-red-50/70'
                        }`}>
                          {isInWarranty ? 'In Warranty' : 'Out of Warranty'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
