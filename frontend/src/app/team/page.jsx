'use client';
import { useState } from 'react';
import { BsTelephoneFill } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import Sidebar from '@/components/Sidebar';

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const teamMembers = {
    'US-EAST': [
      { initials: 'EG', name: 'Elizabeth Garcia', title: 'FSE II', phone: '(555) 012-3456', email: 'elizabeth.garcia@company.com' },
      { initials: 'JW', name: 'James Wilson', title: 'FSE IV', phone: '(555) 111-2222', email: 'james.wilson@company.com' },
      { initials: 'LA', name: 'Lisa Anderson', title: 'FSE III', phone: '(555) 678-9012', email: 'lisa.anderson@company.com' },
      { initials: 'SJ', name: 'Sarah Johnson', title: 'FSE II', phone: '(555) 234-5678', email: 'sarah.johnson@company.com' },
    ],
    'US-WEST': [
      // ... similar structure for US-WEST members
    ],
    'EUROPE': [
      // ... similar structure for EUROPE members
    ],
  };

  const filteredTeamMembers = Object.entries(teamMembers).reduce((acc, [region, members]) => {
    const filteredMembers = members.filter(member => 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filteredMembers.length > 0) {
      acc[region] = filteredMembers;
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:ml-64 flex-1">
        <div className="md:p-8 p-4 pt-20 md:pt-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className=" ">Team Members</h1>
              
              <div className="flex gap-4 items-center">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, title, or region..."
                  className="w-56 p-2 border rounded-lg text-sm"
                />
                <button className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 whitespace-nowrap text-sm">
                  + Add Employee
                </button>
              </div>
            </div>

            {Object.entries(filteredTeamMembers).map(([region, members]) => (
              <div key={region} className="mb-12">
                <h2 className="text-gray-600 text-sm font-medium mb-4">{region}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {members.map((member) => (
                    <div key={member.email} className="bg-white p-4 rounded-lg shadow-sm border">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          {member.initials}
                        </div>
                        <div className="flex flex-col items-center justify-center flex-grow">
                          <h3 className="font-medium text-center text-sm">{member.name}</h3>
                          <div className="flex justify-center mt-2">
                            <p className="text-xs text-gray-900 bg-gray-100 rounded px-2 py-0.5 inline-block">
                              {member.title}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <BsTelephoneFill className="w-4 h-4 text-blue-500" />
                          {member.phone}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MdEmail className="w-4 h-4 text-blue-500" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
