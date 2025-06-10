
import React, { useState } from 'react';

type User = {
  serial: number;
  userId: string;
  fullname: string;
  email: string;
  mobileNumber: string;
  reraId: string;
  status: 'pending' | 'verified' | 'not_verified';
  reason?: string;
};

const initialUsers: User[] = [
  {
    serial: 1,
    userId: 'U001',
    fullname: 'Ravi Sharma',
    email: 'ravi.sharma@example.com',
    mobileNumber: '9876543210',
    reraId: 'RERA123',
    status: 'pending',
  },
  {
    serial: 2,
    userId: 'U002',
    fullname: 'Neha Singh',
    email: 'neha.singh@example.com',
    mobileNumber: '9123456780',
    reraId: 'RERA456',
    status: 'pending',
  },
  {
    serial: 3,
    userId: 'U003',
    fullname: 'Amit Verma',
    email: 'amit.verma@example.com',
    mobileNumber: '9988776655',
    reraId: 'RERA789',
    status: 'pending',
  },
];

const getStatusStyles = (status: User['status']) => {
  switch (status) {
    case 'verified':
      return { text: 'Verified', className: 'text-green-700 bg-green-100 px-2 py-1 rounded' };
    case 'not_verified':
      return { text: 'Not Verified', className: 'text-red-700 bg-red-100 px-2 py-1 rounded' };
    default:
      return { text: 'Pending', className: 'text-gray-700 bg-gray-100 px-2 py-1 rounded' };
  }
};

const ReraVerification = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [reasonInput, setReasonInput] = useState('');
  const [searchMobile, setSearchMobile] = useState('');

  const filteredUsers = users.filter((user) =>
    user.mobileNumber.includes(searchMobile.trim())
  );

  const verifyUser = (index: number) => {
    const updated = [...users];
    updated[index].status = 'verified';
    updated[index].reason = '';
    setUsers(updated);
  };

  const notVerifyUser = (index: number) => {
    setSelectedIndex(index);
    setReasonInput('');
    setShowModal(true);
  };

  const saveReason = () => {
    if (selectedIndex === null) return;
    const updated = [...users];
    updated[selectedIndex].status = 'not_verified';
    updated[selectedIndex].reason = reasonInput.trim() || 'No reason provided';
    setUsers(updated);
    setShowModal(false);
    setSelectedIndex(null);
    setReasonInput('');
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">RERA Document Verification</h2>

      {/* Search input */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by Mobile Number"
          value={searchMobile}
          onChange={(e) => setSearchMobile(e.target.value)}
          className="border px-3 py-1 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <table className="w-full border border-gray-300 rounded-md text-sm">
        <thead className="bg-gray-100">
          <tr>
            {[
              'S.No',
              'User ID',
              'Fullname',
              'Email',
              'Mobile Number',
              'ReraID',
              'Action',
              'Status',
              'Reason',
            ].map((header) => (
              <th
                key={header}
                className="py-2 px-3 border-b border-gray-300 text-left font-medium text-gray-700 whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => {
            const statusInfo = getStatusStyles(u.status);
            return (
              <tr key={u.userId} className="hover:bg-gray-50">
                <td className="py-2 px-3 border-b border-gray-300">{u.serial}</td>
                <td className="py-2 px-3 border-b border-gray-300">{u.userId}</td>
                <td className="py-2 px-3 border-b border-gray-300">{u.fullname}</td>
                <td className="py-2 px-3 border-b border-gray-300">{u.email}</td>
                <td className="py-2 px-3 border-b border-gray-300">{u.mobileNumber}</td>
                <td className="py-2 px-3 border-b border-gray-300">{u.reraId}</td>

                <td className="py-2 px-3 border-b border-gray-300 space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => verifyUser(users.indexOf(u))}
                    className={`px-3 py-1 rounded text-white ${
                      u.status === 'verified' ? 'bg-green-600' : 'bg-green-400 hover:bg-green-500'
                    }`}
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => notVerifyUser(users.indexOf(u))}
                    className={`px-3 py-1 rounded text-white ${
                      u.status === 'not_verified' ? 'bg-red-600' : 'bg-red-400 hover:bg-red-500'
                    }`}
                  >
                    Not Verify
                  </button>
                </td>

                <td className="py-2 px-3 border-b border-gray-300">
                  <span className={statusInfo.className}>{statusInfo.text}</span>
                </td>

                <td
                  className="py-2 px-3 border-b border-gray-300 text-red-600 max-w-xs truncate"
                  title={u.reason || '-'}
                >
                  {u.reason || '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Enter Reason for Not Verification</h3>
            <textarea
              rows={4}
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
              className="w-full border rounded p-2 mb-4 resize-none"
              placeholder="Enter reason here..."
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveReason}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                disabled={!reasonInput.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReraVerification;
