import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaPlus } from 'react-icons/fa';

const ContactSection = ({ contacts, companyId }) => {
  const userRole = localStorage.getItem('role');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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
      
      const response = await fetch(`http://localhost:5000/api/company/${companyId}/addContact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ name: '', email: '', phone: '' });
        // You might want to refresh the contacts list here
      } else {
        const errorData = await response.json();
        console.error('Failed to add contact:', errorData.message);
      }
    } catch (error) {
      console.error('Error adding contact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 shadow-[0_0_8px_rgba(0,0,0,0.15)] rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center mt-8">Contacts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <div key={contact._id} className="bg-white shadow-[0_0_8px_rgba(0,0,0,0.15)] rounded-lg p-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center">
                <FaUser className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
              <a href={`mailto:${contact.email}`} className="text-sm text-gray-900 hover:text-blue-800 flex items-center mb-2">
                <FaEnvelope className="w-4 h-4 mr-2 text-blue-600" />
                {contact.email}
              </a>
              <a href={`tel:${contact.phone}`} className="text-sm text-gray-900 hover:text-blue-800 flex items-center">
                <FaPhone className="w-4 h-4 mr-2 text-blue-600" />
                {contact.phone}
              </a>
            </div>
          </div>
        ))}
        
        {/* Add Contact Card - Only show for Managers */}
        {userRole === 'Manager' && (
          <div 
            onClick={() => setShowModal(true)}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:bg-gray-50" 
            style={{
              background: 'linear-gradient(90deg, #d1d5db 50%, transparent 50%) repeat-x,linear-gradient(90deg, #d1d5db 50%, transparent 50%) repeat-x,linear-gradient(0deg, #d1d5db 50%, transparent 50%) repeat-y,linear-gradient(0deg, #d1d5db 50%, transparent 50%) repeat-y',
              backgroundSize: '10px 2px, 10px 2px, 2px 10px, 2px 10px',
              backgroundPosition: '0 0, 0 100%, 0 0, 100% 0',
              padding: '24px',
              backgroundRepeat: 'repeat-x,repeat-x,repeat-y,repeat-y',
              backgroundColor: 'rgba(37, 99, 235, 0.05)'
            }}>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-blue-600 rounded-full p-1.5 mb-3">
                <FaPlus className="w-4 h-4 text-white" />
              </div>
              <p className="text-blue-600 font-medium mb-2 text-lg">Add Contact</p>
              <p className="text-sm text-gray-400">Add a new contact to this company</p>
            </div>
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add Contact Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
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
                  {isLoading ? 'Saving...' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSection;
