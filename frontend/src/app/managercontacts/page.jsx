'use client'
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

const ManagerContacts = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:5000/api/manager/contracts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Check content type
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("API didn't return JSON");
        }

        const data = await response.json();
        const contractsArray = Array.isArray(data) ? data : (data.contracts || []);
        
        const transformedData = contractsArray.map(contract => ({
          company: contract.customer,
          type: contract.serviceType,
          hours: contract.contractHours,
          total: 100
        }));
        setContracts(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setContracts([]); // Set empty array on error
      }
    };

    fetchContracts();
  }, []);

  const getProgressColor = (hours) => {
    if (hours >= 70) return 'bg-emerald-500'
    if (hours >= 30) return 'bg-orange-400'
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
                  <div className="flex items-center gap-2 w-full">
                    <div className="relative flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 ${getProgressColor(contract.hours)} h-full rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min(contract.hours, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap min-w-[90px]">
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
