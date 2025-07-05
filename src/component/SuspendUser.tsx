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
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Suspended Users List</h1>

      <div className="mb-6 flex gap-6 flex-wrap">
        {/* Suspend Section */}
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Enter mobile number"
            value={mobileInput}
            onChange={(e) => setMobileInput(e.target.value)}
            className="p-2 border rounded w-64"
          />
          <input
            type="text"
            placeholder="Enter reason for suspension"
            value={reasonInput}
            onChange={(e) => setReasonInput(e.target.value)}
            className="p-2 border rounded w-64"
          />
          <button
            onClick={handleSuspend}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
            className="p-2 border rounded w-64"
          />
          <input
            type="text"
            placeholder="Reason for un-suspension"
            value={unsuspendReason}
            onChange={(e) => setUnsuspendReason(e.target.value)}
            className="p-2 border rounded w-64"
          />
          <button
            onClick={handleUnsuspend}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            Un-Suspend User
          </button>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white border shadow-md rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">S.No.</th>
              <th className="p-2 border">User ID</th>
              <th className="p-2 border">Full Name</th>
              <th className="p-2 border">Mobile Number</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Reason for Suspension</th>
            </tr>
          </thead>
          <tbody>
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
  );
};

export default SuspendedUsers;

