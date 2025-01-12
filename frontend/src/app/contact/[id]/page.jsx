'use client';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import LocationSection from '@/components/Contact/LocationSection';
import Link from 'next/link';
import ContactSection from '@/components/Contact/ContactSection';
import Table from '@/components/Contact/Table';

export default function DashboardPage() {
  const params = useParams();
  const id = params.id; // This will give you access to the dynamic ID parameter

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
            <div className=" rounded-lg ">
              <h1 className="text-3xl font-semibold text-gray-800">Acme Technologies</h1>
              <p className="text-gray-700 mt-2 bg-gray-200 ">{id}</p>
            </div>
          </div>

          <LocationSection />
          <ContactSection />
          <Table />
        </div>
      </div>
    </div>
  );
}
