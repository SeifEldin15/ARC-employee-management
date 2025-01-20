'use client'
import Sidebar from '@/components/Sidebar'
import { useState, useEffect } from 'react'
import axios from 'axios'

const hideSpinButtons = {
  /* Chrome, Safari, Edge, Opera */
  'WebkitAppearance': 'none',
  'MozAppearance': 'textfield',
  'appearance': 'textfield',
  margin: 0,
  /* Firefox */
  '&::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0
  },
  '&::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0
  }
}

export default function CustomerServiceReport() {
  const [companies, setCompanies] = useState([])
  const [formData, setFormData] = useState({
    srvNumber: '',
    serviceEngineer: '',
    customer: '',
    address: '',
    contact: '',
    email: '',
    mobileNumber: '',
    toolNumber: '',
    jobType: '',
    systemType: '',
    jiraTicketNumber: '',
    WorkWeekNumber: '',
    weekEndDate: '',
    weeklyTaskReport: Array(7).fill().map(() => ({
      day: '',
      date: '',
      travelHours: 0,
      regularHours: 0,
      overtimeHours: 0,
      holidayHours: 0,
      hourlyRate: 150
    })),
    purposeOfVisit: '',
    solution: '',
    recommendations: '',
    additionalNotes: '',
    returnVisitRequired: false,
    companyId: '6782d0a60b59aba0fc7ae808'
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Add useEffect to handle URL parameters and initialize dates
  useEffect(() => {
    const fetchCurrentWeek = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        let weekNumber = parseInt(searchParams.get('week'));
        
        if (!weekNumber) {
          // Fetch current week from API if not provided in URL
          const response = await axios.get('/api/currentWeek');
          weekNumber = response.data.weekNumber;
          
          // Update URL with the week number without page reload
          const newUrl = `${window.location.pathname}?week=${weekNumber}`;
          window.history.pushState({ path: newUrl }, '', newUrl);
        }
        
        // Calculate dates based on week number
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1);
        startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);
        
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weekDates = Array(7).fill().map((_, index) => {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + index);
          return date;
        });

        const endDate = weekDates[6];

        setFormData(prev => ({
          ...prev,
          WorkWeekNumber: weekNumber,
          weekEndDate: endDate.toISOString().split('T')[0],
          weeklyTaskReport: weekDates.map((date, index) => ({
            day: days[index],
            date: date.toISOString().split('T')[0],
            travelHours: 0,
            regularHours: 0,
            overtimeHours: 0,
            holidayHours: 0,
            hourlyRate: 150
          }))
        }));
      } catch (error) {
        console.error('Error fetching current week:', error);
        setError('Failed to fetch current week');
      }
    };

    fetchCurrentWeek();
  }, []);

  // Add useEffect to get companyId from localStorage
  useEffect(() => {
    const companyId = localStorage.getItem('companyId');
    if (companyId) {
      setFormData(prev => ({
        ...prev,
        companyId
      }));
    }
  }, []);

  // Add useEffect to get user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/auth/info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setFormData(prev => ({
          ...prev,
          serviceEngineer: response.data.name
        }));
      } catch (error) {
        console.error('Error fetching user info:', error);
        setError('Failed to fetch user information');
      }
    };

    fetchUserInfo();
  }, []);

  // Add useEffect to fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('/api/company')
        setCompanies(response.data)
      } catch (error) {
        console.error('Error fetching companies:', error)
        setError('Failed to fetch companies')
      }
    }

    fetchCompanies()
  }, [])

  // Add handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Add handle time sheet input
  const handleTimeSheetChange = (rowType, dayIndex, value) => {
    setFormData(prev => ({
      ...prev,
      weeklyTaskReport: prev.weeklyTaskReport.map((day, idx) => {
        if (idx === dayIndex) {
          const hours = parseFloat(value) || 0;
          const updatedDay = {
            ...day,
            [rowType]: hours
          };
          
          // Calculate total hours
          updatedDay.totalHours = 
            parseFloat(updatedDay.travelHours) + 
            parseFloat(updatedDay.regularHours) + 
            parseFloat(updatedDay.overtimeHours) + 
            parseFloat(updatedDay.holidayHours);
          
          // Calculate USD based on different rates
          updatedDay.totalUSD = 
            (updatedDay.travelHours * 253) +
            (updatedDay.regularHours * 253) +
            (updatedDay.overtimeHours * 380) +
            (updatedDay.holidayHours * 506);
          
          return updatedDay;
        }
        return day;
      })
    }));
  };

  // Update company selection handler to allow editing of all fields
  const handleCompanyChange = (e) => {
    const selectedCompanyId = e.target.value
    const selectedCompany = companies.find(company => company._id === selectedCompanyId)
    
    if (selectedCompany) {
      // Pre-fill all fields but keep them editable
      setFormData(prev => ({
        ...prev,
        companyId: selectedCompany._id,
        customer: selectedCompany.name,
        address: selectedCompany.address,
        contact: '',
        email: '',
        mobileNumber: ''
      }))
    }
  }

  // Update form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const submitData = {
      ...formData,
      srvNumber: formData.srvNumber,
      weeklyTaskReport: formData.weeklyTaskReport.map(day => ({
        ...day,
        travelHours: parseFloat(day.travelHours) || 0,
        regularHours: parseFloat(day.regularHours) || 0,
        overtimeHours: parseFloat(day.overtimeHours) || 0,
        holidayHours: parseFloat(day.holidayHours) || 0,
        hourlyRate: parseFloat(day.hourlyRate) || 0
      }))
    };

    // Validate required fields
    if (!submitData.srvNumber) {
      setError('SRV Number is required');
      setLoading(false);
      return;
    }

    if (!submitData.companyId) {
      setError('Company ID is missing. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      let token = '';
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
      }
      
      const response = await axios.post(
        '/api/reports/csr', 
        submitData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        }
      )
      
      alert('Report submitted successfully!')
    } catch (err) {
      console.error('Error submitting report:', err)
      setError(err.response?.data?.details || err.response?.data?.error || 'Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  // Update the form element to include onSubmit
  return (
    <>
      <Sidebar />
      <div className="md:ml-64 pt-20 md:pt-8">
        <div className="max-w-6xl mx-auto p-8 bg-white">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">CUSTOMER SERVICE REPORT</h1>
              {/* <p className="text-sm text-gray-600">TECH LINK Sr. Lt. (Hamburg) St. 34756, tel 07/57/77999 p 048-286-4550</p> */}
            </div>

            {/* Top Section Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">SRV Number*</label>
                  <input 
                    type="text" 
                    name="srvNumber"
                    value={formData.srvNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Select Company*</label>
                  <select
                    onChange={handleCompanyChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Select a company</option>
                    {companies.map(company => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Customer*</label>
                  <input 
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Address</label>
                  <input 
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Contact</label>
                  <input 
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Tel</label>
                  <input 
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Service Engineer*</label>
                  <input 
                    type="text"
                    name="serviceEngineer"
                    value={formData.serviceEngineer}
                    className="mt-1 block w-full border rounded-md px-3 py-2 bg-gray-100"
                    required 
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Tool ID Number</label>
                  <input 
                    type="text"
                    name="toolNumber"
                    value={formData.toolNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Job Type</label>
                  <input 
                    type="text"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">System Type</label>
                  <input 
                    type="text"
                    name="systemType"
                    value={formData.systemType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">JIRA Ticket Number</label>
                  <input type="text" className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Work Week Number*</label>
                  <input 
                    type="number"
                    name="WorkWeekNumber"
                    value={formData.WorkWeekNumber}
                    className="mt-1 block w-full border rounded-md px-3 py-2 bg-gray-100"
                    required 
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Time Sheet Table */}
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Travel and Work Time:</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border px-4 py-2">Date</th>
                      <th className="border px-4 py-2">Mon</th>
                      <th className="border px-4 py-2">Tue</th>
                      <th className="border px-4 py-2">Wed</th>
                      <th className="border px-4 py-2">Thu</th>
                      <th className="border px-4 py-2">Fri</th>
                      <th className="border px-4 py-2">Sat</th>
                      <th className="border px-4 py-2">Sun</th>
                      <th className="border px-4 py-2">Hours Total</th>
                      <th className="border px-4 py-2">Hourly Rate$</th>
                      <th className="border px-4 py-2">Totals (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1 text-sm w-32">Travel Hours</td>
                      {[...Array(7)].map((_, i) => (
                        <td key={i} className="border px-1 py-0.5">
                          <input 
                            type="text"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            value={formData.weeklyTaskReport[i].travelHours}
                            onChange={(e) => handleTimeSheetChange('travelHours', i, e.target.value)}
                            className="w-full text-center"
                          />
                        </td>
                      ))}
                      <td className="border px-4 py-2">0</td>
                      <td className="border px-4 py-2">$253.00</td>
                      <td className="border px-4 py-2">$0.00</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 text-sm w-32">Regular Hrs<br />8am - 5pm</td>
                      {[...Array(7)].map((_, i) => (
                        <td key={i} className="border px-1 py-0.5">
                          <input 
                            type="text"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            value={formData.weeklyTaskReport[i].regularHours}
                            onChange={(e) => handleTimeSheetChange('regularHours', i, e.target.value)}
                            className="w-full text-center"
                          />
                        </td>
                      ))}
                      <td className="border px-4 py-2">0</td>
                      <td className="border px-4 py-2">$253.00</td>
                      <td className="border px-4 py-2">$0.00</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 text-sm w-32">Overtime/<br />Weekend (h)</td>
                      {[...Array(7)].map((_, i) => (
                        <td key={i} className="border px-1 py-0.5">
                          <input 
                            type="text"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            value={formData.weeklyTaskReport[i].overtimeHours}
                            onChange={(e) => handleTimeSheetChange('overtimeHours', i, e.target.value)}
                            className="w-full text-center"
                          />
                        </td>
                      ))}
                      <td className="border px-4 py-2">0</td>
                      <td className="border px-4 py-2">$380.00</td>
                      <td className="border px-4 py-2">$0.00</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 text-sm w-32">Holiday (h)</td>
                      {[...Array(7)].map((_, i) => (
                        <td key={i} className="border px-1 py-0.5">
                          <input 
                            type="text"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            value={formData.weeklyTaskReport[i].holidayHours}
                            onChange={(e) => handleTimeSheetChange('holidayHours', i, e.target.value)}
                            className="w-full text-center"
                          />
                        </td>
                      ))}
                      <td className="border px-4 py-2">0</td>
                      <td className="border px-4 py-2">$506.00</td>
                      <td className="border px-4 py-2">$0.00</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2"></td>
                      {[...Array(7)].map((_, i) => (
                        <td key={i} className="border px-1 py-0.5 text-center">0</td>
                      ))}
                      <td className="border px-4 py-2">0</td>
                      <td className="border px-4 py-2">Total</td>
                      <td className="border px-4 py-2">$0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Text Areas */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Purpose of Visit / Problem Description</label>
                <textarea 
                  name="purposeOfVisit"
                  value={formData.purposeOfVisit}
                  onChange={handleInputChange}
                  rows={4} 
                  className="w-full border rounded-md px-3 py-2" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Solution</label>
                <textarea 
                  name="solution"
                  value={formData.solution}
                  onChange={handleInputChange}
                  rows={4} 
                  className="w-full border rounded-md px-3 py-2" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Recommendations</label>
                <textarea 
                  name="recommendations"
                  value={formData.recommendations}
                  onChange={handleInputChange}
                  rows={4} 
                  className="w-full border rounded-md px-3 py-2" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Additional</label>
                <textarea 
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  rows={4} 
                  className="w-full border rounded-md px-3 py-2" 
                />
              </div>
            </div>

            {/* Return Visit Radio Buttons */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Return Visit Required?</label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="returnVisitRequired" 
                    value="true"
                    checked={formData.returnVisitRequired === true}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      returnVisitRequired: e.target.value === "true"
                    }))}
                    className="form-radio" 
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="return-visit" className="form-radio" />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 mt-8">
              <div>
                <div className="border-t border-black pt-2">
                  <p className="text-center">Customer Signature</p>
                </div>
                <div className="border-t border-black mt-8 pt-2">
                  <p className="text-center">Date</p>
                </div>
              </div>
              <div>
                <div className="border-t border-black pt-2">
                  <p className="text-center">Service Engineer Signature</p>
                </div>
                <div className="border-t border-black mt-8 pt-2">
                  <p className="text-center">Date</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button 
                type="submit" 
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
