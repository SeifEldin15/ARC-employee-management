import { FaUser, FaEnvelope, FaPhone, FaPlus } from 'react-icons/fa';

const ContactSection = ({ contacts }) => {
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
        
        {/* Add Contact Card */}
        <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:bg-gray-50" 
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
      </div>
    </div>
  );
};

export default ContactSection;
