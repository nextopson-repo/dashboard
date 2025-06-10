import React, { useState } from "react";

type UserData = {
  serial: number;
  userId: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  pictureUrl: string;
  aadharFrontUrl: string;
  aadharBackUrl: string;
  status: "pending" | "verified" | "not_verified";
  reason?: string;
};


const initialUsers: UserData[] = [
  {
    serial: 1,
    userId: "U001",
    fullName: "Ramesh Kumar",
    email: "ramesh.k@example.com",
    mobileNumber: "9876543210",
    pictureUrl: "",
    aadharFrontUrl: "",
    aadharBackUrl: "",
    status: "pending",
  },
  {
    serial: 2,
    userId: "U002",
    fullName: "Sunita Sharma",
    email: "sunita.s@example.com",
    mobileNumber: "9123456789",
    pictureUrl: "",
    aadharFrontUrl: "",
    aadharBackUrl: "",
    status: "pending",
  },
];

const getStatusBadge = (status: UserData["status"]) => {
  switch (status) {
    case "verified":
      return (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
          Verified
        </span>
      );
    case "not_verified":
      return (
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
          Not Verified
        </span>
      );
    default:
      return (
        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
          Pending
        </span>
      );
  }
};

const AadharVerificationTable = () => {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [reasonInput, setReasonInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleVerify = (index: number) => {
    const newUsers = [...users];
    newUsers[index].status = "verified";
    newUsers[index].reason = "";
    setUsers(newUsers);
  };

  const handleNotVerify = (index: number) => {
    setSelectedIndex(index);
    setReasonInput("");
    setShowModal(true);
  };

  const handleSaveReason = () => {
    if (selectedIndex === null) return;
    const newUsers = [...users];
    newUsers[selectedIndex].status = "not_verified";
    newUsers[selectedIndex].reason = reasonInput.trim() || "No reason provided";
    setUsers(newUsers);
    setShowModal(false);
    setSelectedIndex(null);
    setReasonInput("");
  };

  return (
    <div className="p-6 bg-white min-h-screen">
     
        <h2 className="text-2xl font-bold mb-4 text-center">Aadhar Document Verification</h2>
        <div className="flex justify-end  mb-4">
        <input
          type="text"
          placeholder="Search by Mobile Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-auto">
        <table className="w-full border border-gray-300 rounded text-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "S.No.",
                "User ID",
                "Full Name",
                "Email",
                "Mobile Number",
                "Picture",
                "Aadhar Front",
                "Aadhar Back",
                "Actions",
                "Status",
                "Reason",
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
            {users
              .filter((user) =>
                user.mobileNumber.includes(searchQuery.trim())
              )
              .map((user, idx) => (
                <tr key={user.userId} className="hover:bg-gray-50 align-middle">
                  <td className="py-2 px-3 border-b border-gray-300">{user.serial}</td>
                  <td className="py-2 px-3 border-b border-gray-300">{user.userId}</td>
                  <td className="py-2 px-3 border-b border-gray-300">{user.fullName}</td>
                  <td className="py-2 px-3 border-b border-gray-300">{user.email}</td>
                  <td className="py-2 px-3 border-b border-gray-300">{user.mobileNumber}</td>
                  <td className="py-2 px-3 border-b border-gray-300">
                    <img
                      src={user.pictureUrl}
                      alt="User"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-2 px-3 border-b border-gray-300">
                    <img
                      src={user.aadharFrontUrl}
                      alt="Aadhar Front"
                      className="h-12 w-auto object-contain border rounded"
                    />
                  </td>
                  <td className="py-2 px-3 border-b border-gray-300">
                    <img
                      src={user.aadharBackUrl}
                      alt="Aadhar Back"
                      className="h-12 w-auto object-contain border rounded"
                    />
                  </td>
                  <td className="py-2 px-3 border-b border-gray-300 space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleVerify(idx)}
                      className={`px-3 py-1 rounded text-white ${
                        user.status === "verified"
                          ? "bg-green-600"
                          : "bg-green-400 hover:bg-green-500"
                      }`}
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => handleNotVerify(idx)}
                      className={`px-3 py-1 rounded text-white ${
                        user.status === "not_verified"
                          ? "bg-red-600"
                          : "bg-red-400 hover:bg-red-500"
                      }`}
                    >
                      Not Verify
                    </button>
                  </td>
                  <td className="py-2 px-3 border-b border-gray-300">
                    {getStatusBadge(user.status)}
                  </td>
                  <td
                    className="py-2 px-3 border-b border-gray-300 max-w-xs truncate text-red-600"
                    title={user.reason || "-"}
                  >
                    {user.reason || "-"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Not Verify Reason */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Enter Reason for Not Verification
            </h3>
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
                onClick={handleSaveReason}
                disabled={!reasonInput.trim()}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
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

export default AadharVerificationTable;
