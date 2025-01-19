import { IoCloseCircle } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa';
import { useState } from 'react';

const Table = ({ tools, companyId, onDeleteTool }) => {
  const userRole = localStorage.getItem('role');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    PNumber: '',
    toolDescription: '',
    warrantyStart: '',
    warrantyEnd: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/company/${companyId}/tools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add tool');
      }

      const newTool = await response.json();
      onDeleteTool([...tools, newTool]);
      setShowModal(false);
      setFormData({
        PNumber: '',
        toolDescription: '',
        warrantyStart: '',
        warrantyEnd: ''
      });
    } catch (error) {
      console.error('Error adding tool:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTool = async (toolId) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/company/${companyId}/tools/${toolId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete tool');
        }

        // Update the parent component's state
        const updatedTools = tools.filter(tool => tool._id !== toolId);
        onDeleteTool(updatedTools);
      } catch (error) {
        console.error('Error deleting tool:', error);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto mt-10">
      {/* Add Tool Button - Only show for Managers */}
      {userRole === 'Manager' && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 border-2 border-dashed border-blue-600/30 rounded-lg hover:bg-blue-50"
          >
            <FaPlus className="w-4 h-4" />
            <span>Add Tool</span>
          </button>
        </div>
      )}

      {/* Installed Tools Table */}
      <div>
        <h2 className="text-xl mb-4 text-center">Installed Tools</h2>
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.15)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {userRole === 'Manager' && (
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
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
                      {userRole === 'Manager' && (
                        <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm">
                          <IoCloseCircle
                            className="w-6 h-6 text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={() => handleDeleteTool(tool._id)}
                          />
                        </td>
                      )}
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

      {/* Add Tool Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add Tool Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Tool ID</label>
                <input
                  type="text"
                  name="PNumber"
                  value={formData.PNumber}
                  onChange={handleInputChange}
                  placeholder="Enter tool ID"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Tool Description</label>
                <input
                  type="text"
                  name="toolDescription"
                  value={formData.toolDescription}
                  onChange={handleInputChange}
                  placeholder="Enter tool description"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Warranty Start Date</label>
                <input
                  type="date"
                  name="warrantyStart"
                  value={formData.warrantyStart}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Warranty End Date</label>
                <input
                  type="date"
                  name="warrantyEnd"
                  value={formData.warrantyEnd}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  disabled={isLoading}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Tool'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
