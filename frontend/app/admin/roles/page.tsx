"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminAuthGuard from "@/components/AdminAuthGuard";
import api from "@/utils/axiosInstance";

interface User {
  id: number;
  username: string;
  email: string;
  user_type: string;
  is_active: boolean;
  roles: Role[];
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

interface RoleAssignment {
  user_id: number;
  role_id: number;
}

interface RoleStats {
  total_roles: number;
  total_users: number;
  assigned_roles: number;
  unassigned_users: number;
}

function AdminRolesContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [stats, setStats] = useState<RoleStats>({
    total_roles: 0,
    total_users: 0,
    assigned_roles: 0,
    unassigned_users: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch users and roles in parallel
      const [usersResponse, rolesResponse] = await Promise.all([
        api.get('/api/admin/users/'),
        api.get('/api/admin/roles/')
      ]);

      const usersData = usersResponse.data;
      const rolesData = rolesResponse.data;

      // Fetch roles for each user
      const usersWithRoles = await Promise.all(
        usersData.map(async (user: any) => {
          try {
            const userRolesResponse = await api.get(`/api/admin/users/${user.id}/roles/`);
            return {
              ...user,
              roles: userRolesResponse.data
            };
          } catch (err) {
            console.error(`Error fetching roles for user ${user.id}:`, err);
            return {
              ...user,
              roles: []
            };
          }
        })
      );

      setUsers(usersWithRoles);
      setRoles(rolesData);
      calculateStats(usersWithRoles, rolesData);

    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.error || 'Failed to load data');
      
      // Fallback to mock data
      const mockUsers: User[] = [
        {
          id: 1,
          username: "admin",
          email: "admin@nimhans.gov.in",
          user_type: "admin",
          is_active: true,
          roles: [{ id: 1, name: "System Administrator", description: "Full system access", permissions: ["all"] }]
        },
        {
          id: 2,
          username: "dr.smith",
          email: "dr.smith@hospital.com",
          user_type: "healthcare_professional",
          is_active: true,
          roles: [{ id: 3, name: "Doctor", description: "Medical professional access", permissions: ["view_patients", "create_reports"] }]
        }
      ];

      const mockRoles: Role[] = [
        { id: 1, name: "System Administrator", description: "Full system access", permissions: ["all"] },
        { id: 2, name: "User Manager", description: "Manage user accounts", permissions: ["manage_users"] },
        { id: 3, name: "Doctor", description: "Medical professional access", permissions: ["view_patients", "create_reports"] },
        { id: 4, name: "Nurse", description: "Nursing staff access", permissions: ["view_patients", "update_records"] },
        { id: 5, name: "Patient", description: "Patient access", permissions: ["view_own_data"] },
        { id: 6, name: "Manufacturer", description: "Device manufacturer access", permissions: ["manage_devices"] }
      ];

      setUsers(mockUsers);
      setRoles(mockRoles);
      calculateStats(mockUsers, mockRoles);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userList: User[], roleList: Role[]) => {
    const totalRoles = roleList.length;
    const totalUsers = userList.length;
    const assignedRoles = userList.reduce((acc, user) => acc + user.roles.length, 0);
    const unassignedUsers = userList.filter(user => user.roles.length === 0).length;

    setStats({
      total_roles: totalRoles,
      total_users: totalUsers,
      assigned_roles: assignedRoles,
      unassigned_users: unassignedUsers
    });
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      setError('Please select both user and role');
      return;
    }

    try {
      setError(null);
      setSuccessMessage(null);

              await api.post(`/api/admin/users/${selectedUser}/roles/assign/`, {
          role_id: selectedRole
        });

      // Refresh data
      await fetchData();
      
      setShowAssignModal(false);
      setSelectedUser(null);
      setSelectedRole(null);
      setSuccessMessage('Role assigned successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (err: any) {
      console.error('Error assigning role:', err);
      setError(err.response?.data?.error || 'Failed to assign role');
    }
  };

  const handleRemoveRole = async (userId: number, roleId: number) => {
    if (!confirm('Are you sure you want to remove this role from the user?')) return;

    try {
      setError(null);
      setSuccessMessage(null);

              await api.delete(`/api/admin/users/${userId}/roles/${roleId}/remove/`);

      // Refresh data
      await fetchData();
      
      setSuccessMessage('Role removed successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (err: any) {
      console.error('Error removing role:', err);
      setError(err.response?.data?.error || 'Failed to remove role');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminAccessToken");
    router.push("/admin/login");
  };

  const getStats = () => [
    { label: "Total Roles", value: stats.total_roles, color: "blue" },
    { label: "Total Users", value: stats.total_users, color: "green" },
    { label: "Assigned Roles", value: stats.assigned_roles, color: "purple" },
    { label: "Unassigned Users", value: stats.unassigned_users, color: "red" }
  ];

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-blue-800 text-white">
        <div className="flex items-center justify-center h-16 bg-blue-900">
          <h1 className="text-xl font-bold">NIMHANS Admin</h1>
        </div>
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <Link href="/admin/dashboard" className="flex items-center px-4 py-2 hover:bg-blue-700 rounded-lg">
              <span className="mr-3">📊</span>
              Dashboard
            </Link>
            <Link href="/admin/users" className="flex items-center px-4 py-2 hover:bg-blue-700 rounded-lg">
              <span className="mr-3">👥</span>
              User Management
            </Link>
            <Link href="/admin/roles" className="flex items-center px-4 py-2 bg-blue-700 rounded-lg">
              <span className="mr-3">🔐</span>
              Role Management
            </Link>
            <Link href="/admin/audit-logs" className="flex items-center px-4 py-2 hover:bg-blue-700 rounded-lg">
              <span className="mr-3">📋</span>
              Audit Logs
            </Link>
            <Link href="/admin/system" className="flex items-center px-4 py-2 hover:bg-blue-700 rounded-lg">
              <span className="mr-3">⚙️</span>
              System Settings
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Administrator</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Error/Success Messages */}
        {error && (
          <div className="ml-64 p-4 bg-red-100 border border-red-400 text-red-700">
            <p>⚠️ {error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="ml-64 p-4 bg-green-100 border border-green-400 text-green-700">
            <p>✅ {successMessage}</p>
          </div>
        )}

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {getStats().map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                    <span className="text-2xl">🔐</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Assign Role
              </button>
            </div>
          </div>

          {/* Users and Roles Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Roles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.user_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <span
                                key={role.id}
                                className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                              >
                                {role.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">No roles assigned</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user.id);
                              setShowAssignModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Assign Role
                          </button>
                          {user.roles.map((role) => (
                            <button
                              key={role.id}
                              onClick={() => handleRemoveRole(user.id, role.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remove {role.name}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Available Roles */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => (
                <div key={role.id} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900">{role.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Permissions:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {role.permissions.map((permission, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Assign Role Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Role</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
                  <select
                    value={selectedUser || ""}
                    onChange={(e) => setSelectedUser(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a user...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
                  <select
                    value={selectedRole || ""}
                    onChange={(e) => setSelectedRole(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a role...</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedUser(null);
                    setSelectedRole(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignRole}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Assign Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminRolesPage() {
  return (
    <AdminAuthGuard>
      <AdminRolesContent />
    </AdminAuthGuard>
  );
} 