import React, { useState, useEffect } from 'react';
import { adminAPI, type AdminKYCUser } from '../services/api';

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [reasonInput, setReasonInput] = useState('');
  const [searchMobile, setSearchMobile] = useState('');

  // Fetch KYC data from API
  const fetchKYCData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getAllKYCSubmissions();
      // Map API data to User type for this table
      const apiUsers: User[] = response.data.map((item, idx) => ({
        serial: idx + 1,
        userId: item.userId,
        fullname: item.fullName,
        email: item.email,
        mobileNumber: item.mobileNumber,
        reraId: item.reraId || '',
        status: item.kycStatus === 'Success' ? 'verified' : item.kycStatus === 'Rejected' ? 'not_verified' : 'pending',
        reason: '', // You can add a reason field in the backend if needed
      }));
      setUsers(apiUsers);
    } catch (err) {
      console.error('Error fetching KYC data:', err);
      setError('Failed to load KYC data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKYCData();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.mobileNumber.includes(searchMobile.trim())
  );

  const verifyUser = async (index: number) => {
    try {
      const user = users[index];
      await adminAPI.updateKYCStatus(user.userId, 'Success');
      const updated = [...users];
      updated[index].status = 'verified';
      updated[index].reason = '';
      setUsers(updated);
      console.log(`User ${user.userId} verified successfully`);
    } catch (err) {
      console.error('Error verifying user:', err);
      alert('Failed to verify user. Please try again.');
    }
  };

  const notVerifyUser = (index: number) => {
    setSelectedIndex(index);
    setReasonInput('');
    setShowModal(true);
  };

  const saveReason = async () => {
    if (selectedIndex === null) return;
    try {
      const user = users[selectedIndex];
      await adminAPI.updateKYCStatus(user.userId, 'Rejected', reasonInput.trim());
      const updated = [...users];
      updated[selectedIndex].status = 'not_verified';
      updated[selectedIndex].reason = reasonInput.trim() || 'No reason provided';
      setUsers(updated);
      setShowModal(false);
      setSelectedIndex(null);
      setReasonInput('');
      console.log(`User ${user.userId} rejected with reason: ${reasonInput.trim()}`);
    } catch (err) {
      console.error('Error rejecting user:', err);
      alert('Failed to reject user. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading KYC data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

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
