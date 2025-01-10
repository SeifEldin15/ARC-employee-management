const Table = () => {
  const pastVisits = [
    {
      fseName: "John Smith",
      weekStarting: "10/21/2024",
      hoursOnSite: 31,
      project: "Installation - Advanced Thermal Analysis Tool (P13579)"
    },
    {
      fseName: "Alex Turner",
      weekStarting: "09/09/2024",
      hoursOnSite: 41,
      project: "Upgrade - Advanced Thermal Analysis Tool (P13579)"
    },
    // ... more visits data
  ];

  const installedTools = [
    {
      id: "P12345",
      toolDescription: "High-Precision Laser Calibration System",
      warrantyStart: "01/14/2023",
      warrantyEnd: "12/14/2024",
      warrantyStatus: "In Warranty"
    },
    {
      id: "P13579",
      toolDescription: "Advanced Thermal Analysis Tool",
      warrantyStart: "05/31/2022",
      warrantyEnd: "05/31/2023",
      warrantyStatus: "Out of Warranty"
    },
    // ... more tools data
  ];

  return (
    <div className="space-y-8    max-w-4xl mx-auto mt-10">
      {/* Past Visits Table */}
      <div>
        <h2 className="text-xl mb-4 text-center">Past Visits</h2>
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.15)]">
          <div className="overflow-x-auto ">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">FSE Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Week Starting</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hours on Site</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Project</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pastVisits.map((visit, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm text-gray-900">{visit.fseName}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm text-gray-900">{visit.weekStarting}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm text-gray-900">{visit.hoursOnSite}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm text-gray-900">{visit.project}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
                {installedTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm text-gray-900">{tool.id}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm text-gray-900">{tool.toolDescription}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm text-gray-900">{tool.warrantyStart}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm text-gray-900">{tool.warrantyEnd}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded border ${
                        tool.warrantyStatus === 'In Warranty' 
                          ? 'border-green-500 text-green-600 bg-green-50/70' 
                          : 'border-red-500 text-red-600 bg-red-50/70'
                      }`}>
                        {tool.warrantyStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
