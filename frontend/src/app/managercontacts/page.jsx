'use client'
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

const ManagerContacts = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/manager/contracts');
        const data = await response.json();
        // Transform the API data to match our component's structure
        const transformedData = data.map(contract => ({
          company: contract.customer,
          type: contract.serviceType,
          hours: contract.contractHours,
          total: 100 // You might want to adjust this based on your needs
        }));
        setContracts(transformedData);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      }
    };

    fetchContracts();
  }, []);

  const getProgressColor = (hours) => {
    if (hours >= 70) return 'bg-green-500'
    if (hours >= 30) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:ml-64 flex-1">
        <div className="md:p-8 p-4 pt-20 md:pt-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-700 mb-6">Active Contracts</h1>
            
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
        </div>
      </div>
    </div>
  )
}

export default ManagerContacts
