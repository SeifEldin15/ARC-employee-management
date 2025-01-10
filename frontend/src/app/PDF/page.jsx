'use client'
import Sidebar from '@/components/Sidebar'

export default function CustomerServiceReport() {
  return (
    <>
      <Sidebar />
      <div className="md:ml-64 pt-20 md:pt-8">
        <div className="max-w-4xl mx-auto p-8 bg-white">
          <form className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">CUSTOMER SERVICE REPORT</h1>
              <p className="text-sm text-gray-600">TECH LINK Sr. Lt. (Hamburg) St. 34756, tel 07/57/77999 p 048-286-4550</p>
            </div>

            {/* Top Section Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">SRV Number</label>
                  <input type="text" className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Customer</label>
                  <input type="text" className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Address</label>
                  <input type="text" className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Contact</label>
                  <input type="text" className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Tel</label>
                  <input type="tel" className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input type="email" className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Service Engineer</label>
                  <input type="text" className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Tool ID Number</label>
                  <input type="text" className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Job Type</label>
                  <input type="text" className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">System Type</label>
                  <input type="text" className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">JIRA Ticket Number</label>
                  <input type="text" className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
              </div>
            </div>

            {/* Time Sheet Table */}
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Travel and Work Time</h2>
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
                      <th className="border px-4 py-2">Hourly Rate</th>
                      <th className="border px-4 py-2">Total (EUR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Travel Hours', 'Regular Hrs 8am-5pm', 'Overtime', 'Holiday OT'].map((row) => (
                      <tr key={row}>
                        <td className="border px-4 py-2">{row}</td>
                        {[...Array(7)].map((_, i) => (
                          <td key={i} className="border px-4 py-2">
                            <input type="number" className="w-full" />
                          </td>
                        ))}
                        <td className="border px-4 py-2">0</td>
                        <td className="border px-4 py-2">€150.00</td>
                        <td className="border px-4 py-2">€0.00</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Text Areas */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Purpose of Visit / Problem Description</label>
                <textarea rows={4} className="w-full border rounded-md px-3 py-2" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Solution</label>
                <textarea rows={4} className="w-full border rounded-md px-3 py-2" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Recommendations</label>
                <textarea rows={4} className="w-full border rounded-md px-3 py-2" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Additional</label>
                <textarea rows={4} className="w-full border rounded-md px-3 py-2" />
              </div>
            </div>

            {/* Return Visit Radio Buttons */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Return Visit Required?</label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input type="radio" name="return-visit" className="form-radio" />
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
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
