'use client';

import Link from 'next/link'
import { useEffect, useState } from 'react'

const calculateDaysUntilExpiration = (endDate) => {
  const today = new Date();
  const expirationDate = new Date(endDate);
  const diffTime = expirationDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const ContractDetails = () => {
  const [contract, setContract] = useState(null)
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const id = window.location.pathname.split('/').pop()

  useEffect(() => {
    const fetchContractDetails = async () => {
      console.log('Fetching contract details for ID:', id)
      if (!id) {
        console.log('No id provided')
        return
      }

      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.log('No token found in localStorage')
          setLoading(false)
          return
        }

        console.log('Making API request...')
        const response = await fetch(`/api/contract/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        console.log('Response status:', response.status)

        if (!response.ok) {
          if (response.status === 401) {
            console.log('Unauthorized access - redirecting to login')
            window.location.href = '/'
            return
          }
          throw new Error('Failed to fetch contract details')
        }

        const data = await response.json()
        console.log('Received data:', data)
        setContract(data.contract)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching contract details:', error)
        setLoading(false)
      }
    }

    fetchContractDetails()
  }, [id])

  const handleDeleteContract = async () => {
    if (!confirm('Are you sure you want to delete this contract? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('No token found in localStorage')
        return
      }

      const response = await fetch(`/api/contract/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/'
          return
        }
        throw new Error('Failed to delete contract')
      }

      // Redirect to contracts page after successful deletion
      window.location.href = '/Contracts'
    } catch (error) {
      console.error('Error deleting contract:', error)
      alert('Failed to delete contract. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="max-w-7xl mx-auto p-6">Loading...</div>
  if (!contract) return <div className="max-w-7xl mx-auto p-6">Contract not found</div>

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-3 flex justify-between items-center">
        <Link href="/Contracts" className="text-gray-500 hover:text-gray-700 text-sm">
          ← Back to Contracts
        </Link>
        <button
          onClick={handleDeleteContract}
          disabled={deleting}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Delete Contract'}
        </button>
      </div>

      <h1 className="text-xl font-semibold text-gray-800 mb-4">{contract.company}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Contract Details Card */}
        <div className="lg:col-span-2 bg-white rounded shadow p-4">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Contract Details</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Type:</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-0.5 rounded-full">
                {contract.serviceType}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Duration:</span>
              <span className="text-gray-800">
                {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Status:</span>
              <div className="flex items-center gap-2">
                <span className="text-orange-500">
                  {calculateDaysUntilExpiration(contract.endDate)} days until expiration
                </span>
                <button className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs">
                  Send Reminder
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Hours:</span>
              <span className="text-gray-800">{contract.usedHours} / {contract.contractHours} hours</span>
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Contact Information</h2>
          <div className="space-y-3">
            <div className="text-sm">
              <span className="text-gray-600">Contact:</span>
              <p className="mt-1 text-gray-800">{contract.contactName}</p>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Email:</span>
              <p className="mt-1 text-gray-800">{contract.email}</p>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Phone:</span>
              <p className="mt-1 text-gray-800">{contract.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Past Visits Table */}
      <div className="mt-4 bg-white rounded-lg shadow-md overflow-x-auto">
        <div className="min-w-[768px] grid grid-cols-12 p-4 border-b bg-gray-50">
          <div className="text-sm text-gray-600 col-span-2">Date</div>
          <div className="text-sm text-gray-600 col-span-3">Engineer</div>
          <div className="text-sm text-gray-600 col-span-2">Hours Used</div>
          <div className="text-sm text-gray-600 col-span-5">Description</div>
        </div>

        <div className="divide-y divide-gray-100">
          {contract.visits && contract.visits.map((visit, index) => (
            <div key={index} className="min-w-[768px] grid grid-cols-12 p-4 items-center">
              <div className="col-span-2 text-sm text-gray-900">
                {new Date(visit.date).toLocaleDateString()}
              </div>
              <div className="col-span-3 text-sm text-gray-900">{visit.engineer}</div>
              <div className="col-span-2 text-sm text-gray-900">{visit.hoursUsed}</div>
              <div className="col-span-5 text-sm text-gray-900">{visit.description}</div>
            </div>
          ))}
          {(!contract.visits || contract.visits.length === 0) && (
            <div className="p-4 text-sm text-gray-500 text-center">
              No visits recorded
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContractDetails
