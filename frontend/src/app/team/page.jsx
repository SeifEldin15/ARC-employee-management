'use client';
import { useState, useEffect } from 'react';
import { BsTelephoneFill } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import { IoCloseCircle } from 'react-icons/io5';
import Sidebar from '@/components/Sidebar';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function TeamPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [teamMembers, setTeamMembers] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    Region: '',
    job_title: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching team members with token:', token ? 'Token exists' : 'No token');
        
        const response = await axios.get('/api/team/members', {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        console.log('Team members response:', response.data);
        
        // Transform the flat array into grouped object by region
        const groupedMembers = response.data.reduce((acc, member) => {
          const region = member.Region;
          if (!acc[region]) {
            acc[region] = [];
          }
          acc[region].push({
            initials: member.name.split(' ').map(n => n[0]).join(''),
            name: member.name,
            title: member.job_title,
            phone: member.phone,
            email: member.email,
            id: member._id
          });
          return acc;
        }, {});
        
        setTeamMembers(groupedMembers);
        setError('');
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setError(error.response?.data?.message || 'Error fetching team members');
      }
    };

    fetchTeamMembers();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Adding team member with data:', {
        ...formData,
        password: formData.password ? '[REDACTED]' : 'missing'
      });

      const response = await axios.post('/api/team/add', 
        formData,
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Add member response:', response.data);

      if (response.status === 200 || response.status === 201) {
        // Refresh team members list
        const updatedResponse = await axios.get('/api/team/members', {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        console.log('Updated team list:', updatedResponse.data);
        
        const groupedMembers = updatedResponse.data.reduce((acc, member) => {
          const region = member.Region;
          if (!acc[region]) acc[region] = [];
          acc[region].push({
            initials: member.name.split(' ').map(n => n[0]).join(''),
            name: member.name,
            title: member.job_title,
            phone: member.phone,
            email: member.email,
            id: member._id
          });
          return acc;
        }, {});
        
        setTeamMembers(groupedMembers);
        setIsModalOpen(false);
        setFormData({
          name: '',
          password: '',
          Region: '',
          job_title: '',
          email: '',
          phone: ''
        });
        setError('');
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(error.response?.data?.message || 'Error adding team member');
    }
  };

  const handleEmployeeClick = (id) => {
    router.push(`/Employee/${id}`);
  };

  const handleDeleteMember = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/team/delete/${id}`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        const updatedMembers = { ...teamMembers };
        Object.keys(updatedMembers).forEach(region => {
          updatedMembers[region] = updatedMembers[region].filter(member => member.id !== id);
          if (updatedMembers[region].length === 0) {
            delete updatedMembers[region];
          }
        });
        setTeamMembers(updatedMembers);
      } catch (error) {
        console.error('Error deleting team member:', error);
        setError(error.response?.data?.message || 'Error deleting team member');
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:ml-64 flex-1">
        <div className="md:p-8 p-4 pt-20 md:pt-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
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
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 whitespace-nowrap text-sm"
                >
                  + Add Employee
                </button>
              </div>
            </div>

            {Object.entries(filteredTeamMembers).map(([region, members]) => (
              <div key={region} className="mb-12">
                <h2 className="text-gray-600 text-sm font-medium mb-4">{region}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {members.map((member) => (
                    <div 
                      key={member.email} 
                      className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow relative"
                      onClick={() => handleEmployeeClick(member.id)}
                    >
                      <div className="absolute top-2 right-2">
                        <IoCloseCircle
                          className="w-6 h-6 text-red-500 hover:text-red-700 cursor-pointer"
                          onClick={(e) => handleDeleteMember(member.id, e)}
                        />
                      </div>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add New Team Member</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Region</label>
                <select
                  value={formData.Region}
                  onChange={(e) => setFormData({...formData, Region: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a region</option>
                  <option value="US-EAST">US-EAST</option>
                  <option value="US-WEST">US-WEST</option>
                  <option value="EUROPE">EUROPE</option>
                  <option value="ASIA">ASIA</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Job Title</label>
                <input
                  type="text"
                  value={formData.job_title}
                  onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
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
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
