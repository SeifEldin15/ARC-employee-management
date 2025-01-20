import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

const ContactsDashboard = () => {
  // Add state for contacts data
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add state for sorting and search
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  // Add modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    companyName: '',
    address: '',
    region: '',
    contactName: '',
    email: '',
    phone: '',
    role: ''
  });

  // Extract fetchCompanies function from useEffect
  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found in localStorage');
        return;
      }

      const response = await fetch('/api/company', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('Unauthorized access - redirecting to login');
          window.location.href = '/';
          return;
        }
        throw new Error('Failed to fetch companies');
      }
      
      const companies = await response.json();
      
      // Transform the data
      const groupedByCompany = {};
      companies.forEach(company => {
        if (!groupedByCompany[company._id]) {
          groupedByCompany[company._id] = {
            company: company.name,
            companyId: company._id,
            address: company.address,
            contacts: company.contacts.map(contact => ({
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              role: contact.role || 'N/A'
            }))
          };
        }
      });
      
      setContacts(Object.values(groupedByCompany));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Use fetchCompanies in useEffect
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Sort function
  const sortedContacts = useMemo(() => {
    let sortableContacts = [...contacts];
    if (sortConfig.key) {
      sortableContacts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableContacts;
  }, [contacts, sortConfig]);

  // Sort handler
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter contacts based on search
  const filteredContacts = useMemo(() => {
    return sortedContacts.filter(contact => 
      Object.values(contact).some(value => 
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedContacts, searchTerm]);

  // Now handleAddContact can use fetchCompanies
  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const companyData = {
        name: newContact.companyName,
        address: newContact.address,
        region: newContact.region,
        contacts: [
          {
            name: newContact.contactName,
            email: newContact.email,
            phone: newContact.phone,
            role: newContact.role
          }
        ]
      };

      const response = await fetch(`/api/company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(companyData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          throw new Error('Company or contact information already exists');
        }
        throw new Error(errorData.message || 'Failed to add company');
      }

      // Success case
      await fetchCompanies(); // Refresh the companies list
      setIsModalOpen(false);
      setNewContact({
        companyName: '',
        address: '',
        region: '',
        contactName: '',
        email: '',
        phone: '',
        role: ''
      });
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {/* <h2 className="text-xl font-semibold text-gray-600">Bright Solutions Inc.</h2> */}
          <h1 className="text-2xl">Contacts</h1>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts..."
            className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Contact
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Contact</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleAddContact}>
              <input
                type="text"
                placeholder="Company Name"
                value={newContact.companyName}
                onChange={(e) => setNewContact({...newContact, companyName: e.target.value})}
                className="w-full mb-4 px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={newContact.address}
                onChange={(e) => setNewContact({...newContact, address: e.target.value})}
                className="w-full mb-4 px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Region"
                value={newContact.region}
                onChange={(e) => setNewContact({...newContact, region: e.target.value})}
                className="w-full mb-4 px-3 py-2 border rounded"
                required
              />
              <hr className="my-4" />
              <h3 className="text-lg font-medium mb-4">Primary Contact</h3>
              <input
                type="text"
                placeholder="Contact Name"
                value={newContact.contactName}
                onChange={(e) => setNewContact({...newContact, contactName: e.target.value})}
                className="w-full mb-4 px-3 py-2 border rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                className="w-full mb-4 px-3 py-2 border rounded"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                className="w-full mb-4 px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Role"
                value={newContact.role}
                onChange={(e) => setNewContact({...newContact, role: e.target.value})}
                className="w-full mb-4 px-3 py-2 border rounded"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Company</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Address</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.map((company, index) => (
                company.contacts.map((contact, contactIndex) => (
                  <tr 
                    key={`${index}-${contactIndex}`} 
                    className={`hover:bg-gray-50 ${contactIndex === 0 ? '' : 'border-t-0'}`}
                  >
                    {contactIndex === 0 && (
                      <>
                        <td 
                          className="px-6 py-4 align-top border-b-0" 
                          rowSpan={company.contacts.length}
                        >
                          <Link 
                            href={`/Contact/${company.companyId}`}
                            className="text-blue-600 hover:underline"
                          >
                            {company.company}
                          </Link>
                        </td>
                        <td 
                          className="px-6 py-4 text-sm text-gray-500 align-top border-b-0" 
                          rowSpan={company.contacts.length}
                        >
                          {company.address}
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 text-sm text-gray-900">{contact.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{contact.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{contact.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{contact.role}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContactsDashboard;
