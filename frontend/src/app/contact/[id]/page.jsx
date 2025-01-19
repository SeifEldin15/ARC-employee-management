'use client';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import LocationSection from '@/components/Contact/LocationSection';
import Link from 'next/link';
import ContactSection from '@/components/Contact/ContactSection';
import Table from '@/components/Contact/Table';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const params = useParams();
  const id = params.id;
  const [companyData, setCompanyData] = useState(null);

  const handleContactAdded = (newContact) => {
    console.log('Previous state:', companyData);
    console.log('New contact:', newContact);
    
    setCompanyData(prev => {
      const updatedContacts = prev.details.contacts ? [...prev.details.contacts, newContact] : [newContact];
      return {
        ...prev,
        details: {
          ...prev.details,
          contacts: updatedContacts
        }
      };
    });
  };

  const handleDeleteContact = async (contactId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/company/${id}/contacts/${contactId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      // Update the state to remove the deleted contact
      setCompanyData(prev => ({
        ...prev,
        details: {
          ...prev.details,
          contacts: prev.details.contacts.filter(contact => contact._id !== contactId)
        }
      }));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found in localStorage');
          return;
        }

        const response = await fetch(`/api/company/${id}`, {
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
          throw new Error('Failed to fetch company data');
        }

        const data = await response.json();
        setCompanyData(data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchCompanyData();
  }, [id]);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:ml-64 flex-1">
        <div className="md:p-8 p-4 pt-20 md:pt-8">
          {/* Back button container */}
          <div className="flex justify-center mb-8">
            <Link 
              href="/contacts" 
              className="text-gray-600 hover:text-gray-800 inline-block text-base border border-gray-200 rounded px-4 py-2"
            >
              ← Back to Contacts
            </Link>
          </div>

          {/* Company header */}
          <div className="text-center mb-8 max-w-4xl mx-auto">
            <div className="rounded-lg">
              <h1 className="text-3xl font-semibold text-gray-800">{companyData?.company || 'Loading...'}</h1>
            </div>
          </div>

          <LocationSection address={companyData?.address} region={companyData?.region} />
          <ContactSection 
            contacts={companyData?.details?.contacts || []} 
            companyId={id}
            onContactAdded={handleContactAdded}
            onDeleteContact={handleDeleteContact}
          />
          <Table tools={companyData?.details?.tools_installed || []} />
        </div>
      </div>
    </div>
  );
}
