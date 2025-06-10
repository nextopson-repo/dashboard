
import React, { useState } from "react";

type User = {
  serial: number;
  userId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  reason: string;
};

const initialUsers: User[] = [
  {
    serial: 1,
    userId: "U001",
    fullName: "Ravi Kumar",
    mobileNumber: "9876543210",
    email: "ravi@example.com",
    reason: "Fake documents submitted",
  },
  {
    serial: 2,
    userId: "U002",
    fullName: "Priya Mehta",
    mobileNumber: "9123456780",
    email: "priya@example.com",
    reason: "Misuse of platform",
  },
];

const SuspendedUsers = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [mobileInput, setMobileInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");
 
  const [unsuspendMobile, setUnsuspendMobile] = useState("");
  const [unsuspendReason, setUnsuspendReason] = useState("");

  const handleSuspend = () => {
    if (!mobileInput || !reasonInput) {
      alert("Please enter both mobile number and reason.");
      return;
    }

    const alreadySuspended = users.find(
      (user) => user.mobileNumber === mobileInput
    );
    if (alreadySuspended) {
      alert("This user is already suspended.");
      return;
    }

    const newUser: User = {
      serial: users.length + 1,
      userId: "U" + String(100 + users.length + 1),
      fullName: "unknown",
      mobileNumber: mobileInput,
      email: "unknown@gmail.com",
      reason: reasonInput,
    };

    setUsers([...users, newUser]);
    setMobileInput("");
    setReasonInput("");
    
  };

  const handleUnsuspend = () => {
    if (!unsuspendMobile) {
      alert("Please enter mobile number to un-suspend.");
      return;
    }

    const userToUnsuspend = users.find(
      (user) => user.mobileNumber === unsuspendMobile
    );
    if (!userToUnsuspend) {
      alert("User not found in suspended list.");
      return;
    }

    setUsers(users.filter((user) => user.mobileNumber !== unsuspendMobile));
    setUnsuspendMobile("");
    setUnsuspendReason("");
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
          >
            Un-Suspend User
          </button>
        </div>
      </div>

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
            <tr key={user.userId}>
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
    </div>
  );
};

export default SuspendedUsers;

