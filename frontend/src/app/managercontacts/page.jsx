'use client'

const ManagerContacts = () => {
  const contracts = [
    { company: 'TechCorp Solutions', type: 'Service', hours: 65, total: 100 },
    { company: 'Innovate Systems', type: 'PM', hours: 42, total: 100 },
    { company: 'Global Manufacturing Inc', type: 'Service', hours: 88, total: 100 },
    { company: 'DataFlow Analytics', type: 'PM', hours: 15, total: 100 },
    { company: 'Precision Industries', type: 'Service', hours: 93, total: 100 },
  ]

  const getProgressColor = (hours) => {
    if (hours >= 70) return 'bg-green-500'
    if (hours >= 30) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Active Contracts</h1>
      
      <div className="bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-3 p-4 border-b bg-gray-50">
          <div className="text-sm text-gray-600">Company Name</div>
          <div className="text-sm text-gray-600">Contract Type</div>
          <div className="text-sm text-gray-600">Remaining Hours</div>
        </div>

        {contracts.map((contract, index) => (
          <div key={index} className="grid grid-cols-3 p-4 border-b last:border-b-0 items-center">
            <div className="text-blue-600 hover:text-blue-800 cursor-pointer">
              {contract.company}
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                contract.type === 'Service' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {contract.type}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`${getProgressColor(contract.hours)} h-2 rounded-full`}
                  style={{ width: `${contract.hours}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {contract.hours} / {contract.total} hours
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManagerContacts
