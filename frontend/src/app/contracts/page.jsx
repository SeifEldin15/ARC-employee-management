'use client'
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import LoadingScreen from '@/components/LoadingScreen';

const ManagerContacts = () => {
  const [contracts, setContracts] = useState([]);
  const [token, setToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    customer: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    srvNumber: '',
    contractHours: '',
    startDate: '',
    endDate: '',
    serviceType: 'Service'
  });
  const [companies, setCompanies] = useState([]);

  // First useEffect to get token after component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  // Update second useEffect to handle loading state
  useEffect(() => {
    if (token) {
      Promise.all([fetchContracts(), fetchCompanies()])
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [token]);

  // Move fetchContracts outside of useEffect
  const fetchContracts = async () => {
    if (!token) return; // Don't fetch if we don't have a token
    
    try {
      const response = await fetch(`/api/contract`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
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
      
      console.log('Raw API data:', contractsArray);
      
      const transformedData = contractsArray.map(contract => ({
        id: contract._id,
        company: contract.company,
        type: contract.contractType,
        hours: contract.usedHours,
        total: contract.contractHours
      }));
      setContracts(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setContracts([]);
    }
  };

  // Add function to fetch companies
  const fetchCompanies = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/company', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 70) return 'bg-emerald-500'
    if (percentage >= 30) return 'bg-orange-400'
    return 'bg-red-500'
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        // Refresh the contracts list
        fetchContracts();
        // Reset form
        setFormData({
          customer: '',
          contactName: '',
          email: '',
          phone: '',
          address: '',
          srvNumber: '',
          contractHours: '',
          startDate: '',
          endDate: '',
          serviceType: 'Service'
        });
      }
    } catch (error) {
      console.error('Error creating contract:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:ml-64 flex-1">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <div className="md:p-8 p-4 pt-20 md:pt-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-700">Active Contracts</h1>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Contract
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-md">
                <div className="grid grid-cols-12 p-4 border-b bg-gray-50">
                  <div className="text-sm text-gray-600 col-span-3">Company Name</div>
                  <div className="text-sm text-gray-600 col-span-3">Contract Type</div>
                  <div className="text-sm text-gray-600 col-span-6">Remaining Hours</div>
                </div>

                {contracts.map((contract, index) => (
                  <div key={index} className="grid grid-cols-12 p-4 border-b last:border-b-0 items-center">
                    <div className="col-span-3">
                      <Link 
                        href={`/Contract/${contract.id}`}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        {contract.company}
                      </Link>
                    </div>
                    <div className="col-span-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        contract.type === 'Service' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contract.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 w-full col-span-6">
                      <div className="relative flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 ${getProgressColor((contract.hours / contract.total) * 100)} h-full rounded-full transition-all duration-300`}
                          style={{ width: `${Math.min((contract.hours / contract.total) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 whitespace-nowrap min-w-[90px]">
                        {contract.hours} / {contract.total} hours
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Add New Contract</h2>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company Name</label>
                          <select
                            value={formData.customer}
                            onChange={(e) => setFormData({...formData, customer: e.target.value})}
                            className="mt-1 block w-full rounded-md border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                            required
                          >
                            <option value="">Select a company</option>
                            {companies.map((company) => (
                              <option key={company._id} value={company.name}>
                                {company.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                          <input
                            type="text"
                            value={formData.contactName}
                            onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                            className="mt-1 block w-full rounded-md border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="mt-1 block w-full rounded-md border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="mt-1 block w-full rounded-md border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Address</label>
                          <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="mt-1 block w-full rounded-md border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Service Number</label>
                          <input
                            type="text"
                            value={formData.srvNumber}
                            onChange={(e) => setFormData({...formData, srvNumber: e.target.value})}
                            className="mt-1 block w-full rounded-md border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Contract Hours</label>
                          <input
                            type="number"
                            value={formData.contractHours}
                            onChange={(e) => setFormData({...formData, contractHours: e.target.value})}
                            className="mt-1 block w-full rounded-md border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Date</label>
                          <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                            className="mt-1 block w-full rounded-md border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Date</label>
                          <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                            className="mt-1 block w-full rounded-md border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Service Type</label>
                          <select
                            value={formData.serviceType}
                            onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                            className="mt-1 block w-full rounded-md border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                            required
                          >
                            <option value="Service">Service</option>
                            <option value="PC">PC</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-4 mt-6">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="px-4 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Create Contract
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManagerContacts
