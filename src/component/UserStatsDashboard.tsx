import React, { useEffect, useState } from "react";
import api from "../services/api";

interface User {
  id: string;
  name?: string;
  username?: string;
}

interface StatsResponse {
  count: number;
}

interface ComprehensiveStats {
  [key: string]: any;
}

// Updated state type for stat cards
interface StatValue {
  value: number;
  error: boolean;
}

const UserStatsDashboard: React.FC = () => {
  const [counts, setCounts] = useState<{
    total: StatValue;
    active: StatValue;
    inactive: StatValue;
    online: StatValue;
  }>({
    total: { value: 0, error: false },
    active: { value: 0, error: false },
    inactive: { value: 0, error: false },
    online: { value: 0, error: false },
  });

  const [comprehensive, setComprehensive] = useState<ComprehensiveStats | null>(null);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [inactiveUsers, setInactiveUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Use Promise.allSettled to handle individual errors
      const [totalRes, activeRes, inactiveRes, onlineRes, statsRes, activeList, inactiveList] =
        await Promise.allSettled([
          api.get<StatsResponse>("/user-statistics/total"),
          api.get<StatsResponse>("/user-statistics/active"),
          api.get<StatsResponse>("/user-statistics/inactive"),
          api.get<StatsResponse>("/user-statistics/online"),
          api.get("/user-statistics/statistics"),
          api.get("/user-statistics/active/list?page=1&limit=10"),
          api.get("/user-statistics/inactive/list?page=1&limit=10"),
        ]);

      setCounts({
        total:
          totalRes.status === "fulfilled"
            ? { value: totalRes.value.data.count, error: false }
            : { value: 0, error: true },
        active:
          activeRes.status === "fulfilled"
            ? { value: activeRes.value.data.count, error: false }
            : { value: 0, error: true },
        inactive:
          inactiveRes.status === "fulfilled"
            ? { value: inactiveRes.value.data.count, error: false }
            : { value: 0, error: true },
        online:
          onlineRes.status === "fulfilled"
            ? { value: onlineRes.value.data.count, error: false }
            : { value: 0, error: true },
      });

      if (statsRes.status === "fulfilled") {
        setComprehensive(statsRes.value.data);
      } else {
        setComprehensive(null);
      }
      if (activeList.status === "fulfilled") {
        setActiveUsers(activeList.value.data.users || []);
      } else {
        setActiveUsers([]);
      }
      if (inactiveList.status === "fulfilled") {
        setInactiveUsers(inactiveList.value.data.users || []);
      } else {
        setInactiveUsers([]);
      }
    } catch (err) {
      console.error("Dashboard load error", err);
      setError("Failed to load dashboard data.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center">User Statistics Dashboard</h1>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={counts.total.value} error={counts.total.error} color="blue" />
        <StatCard title="Active Users" value={counts.active.value} error={counts.active.error} color="green" />
        <StatCard title="Inactive Users" value={counts.inactive.value} error={counts.inactive.error} color="red" />
        <StatCard title="Online Users" value={counts.online.value} error={counts.online.error} color="yellow" />
      </div>

      {/* Comprehensive Stats */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Comprehensive Statistics</h2>
        <pre className="bg-white border border-gray-300 p-4 rounded-xl overflow-auto">
  {comprehensive ? JSON.stringify(comprehensive.data, null, 2) : "Loading..."}
</pre>

      </div>

      {/* Active Users List */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Active Users List (paginated)</h2>
        <UserList users={activeUsers} />
      </div>

      {/* Inactive Users List */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Inactive Users List (paginated)</h2>
        <UserList users={inactiveUsers} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-red-600 text-center mt-6 text-lg font-medium">{error}</div>
      )}
    </div>
  );
};

// Updated StatCard to show 'Not found' if error is true
const StatCard = ({
  title,
  value,
  error,
  color,
}: {
  title: string;
  value: number;
  error: boolean;
  color: "blue" | "green" | "red" | "yellow";
}) => {
  const colorClasses: Record<string, string> = {
    blue: "border-blue-500 text-blue-600",
    green: "border-green-500 text-green-600",
    red: "border-red-500 text-red-600",
    yellow: "border-yellow-500 text-yellow-600",
  };

  return (
    <div className={`bg-white border rounded-2xl shadow p-5 text-center ${colorClasses[color]}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold mt-2">
        {error ? "Not found" : value}
      </p>
    </div>
  );
};

const UserList = ({ users }: { users: User[] }) => {
  return (
    <div>
      <div className="mb-1 text-sm text-gray-600">
        Total: <strong>{users.length}</strong> user{users.length !== 1 ? "s" : ""}
      </div>
      <ul className="bg-white border border-gray-300 rounded-xl divide-y divide-gray-200">
        {users.length === 0 ? (
          <li className="p-3 text-gray-500 text-sm text-center italic">No users found</li>
        ) : (
          users.map((user) => (
            <li key={user.id} className="p-3 text-sm text-gray-700">
              {user.name || user.username || "Unnamed User"} (ID: {user.id})
            </li>
          ))
        )}
      </ul>
    </div>
  );
};


export default UserStatsDashboard;
