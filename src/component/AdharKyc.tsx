import React, { useState, useEffect } from "react";
import { adminAPI , type AdminKYCUser } from '../services/api';
import { s3API } from '../services/api';

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
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [reasonInput, setReasonInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch KYC data from API
 const fetchKYCData = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await adminAPI.getAllKYCSubmissions();

    const apiUsers: UserData[] = await Promise.all(
      response.data.map(async (item: AdminKYCUser, idx: number) => {
        const [pictureUrl, aadharFrontUrl, aadharBackUrl] = await Promise.all([
          s3API.getImageUrlByKey(item.selfieImageKey ?? ''),
          s3API.getImageUrlByKey(item.aadharFrontKey ?? ''),
          s3API.getImageUrlByKey(item.aadharBackKey ?? ''),
        ]);

        return {
          serial: idx + 1,
          userId: item.userId,
          fullName: item.fullName,
          email: item.email,
          mobileNumber: item.mobileNumber,
          pictureUrl: pictureUrl ?? '',
          aadharFrontUrl: aadharFrontUrl ?? '',
          aadharBackUrl: aadharBackUrl ?? '',
          status:
            item.kycStatus === 'Success'
              ? 'verified'
              : item.kycStatus === 'Rejected'
              ? 'not_verified'
              : 'pending',
          reason: '',
        };
      })
    );

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

  const handleVerify = async (index: number) => {
    try {
      const user = users[index];
      await adminAPI.updateKYCStatus(user.userId, 'Success');
      // Update UI
      const newUsers = [...users];
      newUsers[index].status = "verified";
      newUsers[index].reason = "";
      setUsers(newUsers);
      console.log(`User ${user.userId} verified successfully`);
    } catch (err) {
      console.error('Error verifying user:', err);
      alert('Failed to verify user. Please try again.');
    }
  };

  const handleNotVerify = (index: number) => {
    setSelectedIndex(index);
    setReasonInput("");
    setShowModal(true);
  };

  const handleSaveReason = async () => {
    if (selectedIndex === null) return;
    try {
      const user = users[selectedIndex];
      await adminAPI.updateKYCStatus(user.userId, 'Rejected', reasonInput.trim());
      const newUsers = [...users];
      newUsers[selectedIndex].status = "not_verified";
      newUsers[selectedIndex].reason = reasonInput.trim() || "No reason provided";
      setUsers(newUsers);
      setShowModal(false);
      setSelectedIndex(null);
      setReasonInput("");
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
