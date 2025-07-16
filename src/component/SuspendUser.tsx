import React, { useState, useEffect } from "react";
import { suspendAPI } from '../services/api';
import type { SuspendedUser } from '../services/api';

type User = {
  serial: number;
  userId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  reason: string;
};

const SuspendedUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [mobileInput, setMobileInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [unsuspendMobile, setUnsuspendMobile] = useState("");
  const [unsuspendReason, setUnsuspendReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch suspended users from API
  const fetchSuspendedUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await suspendAPI.getSuspendedUsers();
      const apiUsers: User[] = response.data.map((item, idx) => ({
        serial: idx + 1,
        userId: item.userId || '-',
        fullName: item.fullName || 'unknown',
        mobileNumber: item.mobileNumber,
        email: item.email || 'unknown@gmail.com',
        reason: item.reason,
      }));
      setUsers(apiUsers);
    } catch (err) {
      setError('Failed to load suspended users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuspendedUsers();
  }, []);

  const handleSuspend = async () => {
    if (!mobileInput || !reasonInput) {
      alert("Please enter both mobile number and reason.");
      return;
    }
    try {
      await suspendAPI.suspendUser(mobileInput, reasonInput);
      setMobileInput("");
      setReasonInput("");
      fetchSuspendedUsers();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to suspend user.');
    }
  };

  const handleUnsuspend = async () => {
    if (!unsuspendMobile) {
      alert("Please enter mobile number to un-suspend.");
      return;
    }
    try {
      await suspendAPI.unsuspendUser(unsuspendMobile);
      setUnsuspendMobile("");
      setUnsuspendReason("");
      fetchSuspendedUsers();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to unsuspend user.');
    }
  };

  return (
<div className="min-h-screen p-6 text-gray-800">
    <div className="w-[90wh] bg-white shadow-md rounded-lg p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-left text-gray-800 mb-5">Suspended Users List</h1>

      <div className="mb-6 flex gap-6 flex-wrap">
        {/* Suspend Section */}
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Enter mobile number"
            value={mobileInput}
            onChange={(e) => setMobileInput(e.target.value)}
            className="p-2 w-64 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Enter reason for suspension"
            value={reasonInput}
            onChange={(e) => setReasonInput(e.target.value)}
            className="p-2 w-64 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSuspend}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded shadow"
            disabled={loading}
          >
            Suspend User
          </button>
        </div>

        {/* Unsuspend Section */}
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Enter mobile number"
            value={unsuspendMobile}
            onChange={(e) => setUnsuspendMobile(e.target.value)}
            className="p-2 w-64 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Reason for un-suspension"
            value={unsuspendReason}
            onChange={(e) => setUnsuspendReason(e.target.value)}
            className="p-2 w-64 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleUnsuspend}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded shadow"
            disabled={loading}
          >
            Un-Suspend User
          </button>
        </div>
      </div>

      {error && <div className="text-red-600 font-medium">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full border border-gray-300 rounded text-sm mt-2">
          <thead className="bg-gray-100 text-gray-700 font-medium">
            <tr>
              <th className="p-2  px-4 border">S.No.</th>
              <th className="p-2  px-4 border">User ID</th>
              <th className="p-2  px-4 border">Full Name</th>
              <th className="p-2  px-4 border">Mobile Number</th>
              <th className="p-2  px-4 border">Email</th>
              <th className="p-2  px-4 border">Reason for Suspension</th>
            </tr>
          </thead>
          <tbody className="text-center text-gray-700">
            {users.map((user) => (
              <tr key={user.serial + user.mobileNumber}>
                <td className="p-2 border text-center">{user.serial}</td>
                <td className="p-2 border text-center">{user.userId}</td>
                <td className="p-2 border text-center">{user.fullName}</td>
                <td className="p-2 border text-center">{user.mobileNumber}</td>
                <td className="p-2 border text-center">{user.email}</td>
                <td className="p-2 border text-center">{user.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
};

export default SuspendedUsers;

