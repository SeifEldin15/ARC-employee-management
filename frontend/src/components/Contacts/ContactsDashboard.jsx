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

  // Fetch companies data
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token); // Debug log
        
        if (!token) {
          console.log('No token found in localStorage');
          window.location.href = '/';
          return;
        }

        const response = await fetch('http://localhost:5000/api/company', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Response status:', response.status); // Debug log
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Unauthorized access - redirecting to login');
            window.location.href = '/';
            return;
          }
          throw new Error('Failed to fetch companies');
        }
        
        const companies = await response.json();
        
        // Transform company data into contacts format
        const transformedContacts = companies.flatMap(company => 
          company.contacts.map(contact => ({
            company: company.name,
            companyId: company._id,
            address: company.address,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            role: contact.role || 'N/A' // Add fallback if role is not provided
          }))
        );
        
        setContacts(transformedContacts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">Contacts</h1>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts..."
            className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-50">
                {['Company', 'Address', 'Name', 'Email', 'Phone', 'Role'].map((header, index) => (
                  <th
                    key={index}
                    onClick={() => requestSort(header.toLowerCase())}
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      {header}
                      {sortConfig.key === header.toLowerCase() && (
                        <span className="ml-2">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.map((contact, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link 
                      href={`/contact/${contact.companyId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {contact.company}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{contact.address}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{contact.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{contact.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{contact.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{contact.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContactsDashboard;
