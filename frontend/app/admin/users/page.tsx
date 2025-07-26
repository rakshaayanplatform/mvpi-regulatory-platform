"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminAuthGuard from "@/components/AdminAuthGuard";
import api from "@/utils/axiosInstance";

interface User {
  id: number;
  username: string;
  email: string;
  user_type: string;
  is_active: boolean;
  date_joined: string;
  last_login: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  organization?: string;
}

interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  healthcare_professionals: number;
  patients: number;
  vendors: number;
  admins: number;
}

function AdminUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total_users: 0,
    active_users: 0,
    inactive_users: 0,
    healthcare_professionals: 0,
    patients: 0,
    vendors: 0,
    admins: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    user_type: "patient",
    first_name: "",
    last_name: "",
    phone: "",
    organization: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterType, filterStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/admin/users/');
      const usersData = response.data;
      
      setUsers(usersData);
      calculateStats(usersData);
      
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.error || 'Failed to load users');
      
      // Fallback to mock data
      const mockUsers: User[] = [
        {
          id: 1,
          username: "admin",
          email: "admin@nimhans.gov.in",
          user_type: "admin",
          is_active: true,
          date_joined: "2024-01-01 00:00:00",
          last_login: "2024-01-15 14:30:00",
          first_name: "System",
          last_name: "Administrator",
          phone: "+91-9876543210",
          organization: "NIMHANS"
        },
        {
          id: 2,
          username: "dr.smith",
          email: "dr.smith@hospital.com",
          user_type: "healthcare_professional",
          is_active: true,
          date_joined: "2024-01-15 10:30:00",
          last_login: "2024-01-15 14:25:00",
          first_name: "Dr. John",
          last_name: "Smith",
          phone: "+91-9876543211",
          organization: "City General Hospital"
        }
      ];
      
      setUsers(mockUsers);
      calculateStats(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userList: User[]) => {
    const total = userList.length;
    const active = userList.filter(user => user.is_active).length;
    const inactive = total - active;
    const healthcare = userList.filter(user => user.user_type === 'healthcare_professional').length;
    const patients = userList.filter(user => user.user_type === 'patient').length;
    const vendors = userList.filter(user => user.user_type === 'vendor').length;
    const admins = userList.filter(user => user.user_type === 'admin').length;

    setStats({
      total_users: total,
      active_users: active,
      inactive_users: inactive,
      healthcare_professionals: healthcare,
      patients: patients,
      vendors: vendors,
      admins: admins
    });
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter(user => user.user_type === filterType);
    }

    // Status filter
    if (filterStatus !== "all") {
      const isActive = filterStatus === "active";
      filtered = filtered.filter(user => user.is_active === isActive);
    }

    setFilteredUsers(filtered);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      setError(null);
      setSuccessMessage(null);
      
              await api.patch(`/api/admin/users/${updatedUser.id}/`, {
          email: updatedUser.email,
          user_type: updatedUser.user_type,
          is_active: updatedUser.is_active
        });
      
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      setEditingUser(null);
      setSuccessMessage('User updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.error || 'Failed to update user');
    }
  };

  const handleDeactivateUser = async (userId: number) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;
    
    try {
      setError(null);
      setSuccessMessage(null);
      
              await api.delete(`/api/admin/users/${userId}/deactivate/`);
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: false } : user
      ));
      
      setSuccessMessage('User deactivated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err: any) {
      console.error('Error deactivating user:', err);
      setError(err.response?.data?.error || 'Failed to deactivate user');
    }
  };

  const handleActivateUser = async (userId: number) => {
    try {
      setError(null);
      setSuccessMessage(null);
      
              await api.post(`/api/admin/users/${userId}/activate/`, {});
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: true } : user
      ));
      
      setSuccessMessage('User activated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err: any) {
      console.error('Error activating user:', err);
      setError(err.response?.data?.error || 'Failed to activate user');
    }
  };

  const handleAddUser = async () => {
    try {
      setError(null);
      setSuccessMessage(null);
      
      const userData = {
        username: newUser.username,
        email: newUser.email,
        password: "TemporaryPass123!", // This should be generated or user should set it
        user_type: newUser.user_type,
        organization_name: newUser.organization,
        designation: `${newUser.first_name} ${newUser.last_name}`.trim(),
        address: ""
      };
      
              await api.post('/api/admin/users/create/', userData);
      
      // Refresh users list
      await fetchUsers();
      
      setShowAddModal(false);
      setNewUser({
        username: "",
        email: "",
        user_type: "patient",
        first_name: "",
        last_name: "",
        phone: "",
        organization: ""
      });
      
      setSuccessMessage('User created successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.response?.data?.error || 'Failed to create user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminAccessToken");
    router.push("/admin/login");
  };

  const getStats = () => [
    { label: "Total Users", value: stats.total_users, color: "blue" },
    { label: "Active Users", value: stats.active_users, color: "green" },
    { label: "Inactive Users", value: stats.inactive_users, color: "red" },
    { label: "Healthcare Professionals", value: stats.healthcare_professionals, color: "purple" },
    { label: "Patients", value: stats.patients, color: "indigo" },
    { label: "Vendors", value: stats.vendors, color: "yellow" },
    { label: "Admins", value: stats.admins, color: "gray" }
  ];

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
            <Link href="/admin/users" className="flex items-center px-4 py-2 bg-blue-700 rounded-lg">
              <span className="mr-3">👥</span>
              User Management
            </Link>
            <Link href="/admin/roles" className="flex items-center px-4 py-2 hover:bg-blue-700 rounded-lg">
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
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
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
                    <span className="text-2xl">👥</span>
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
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="admin">Admin</option>
                  <option value="healthcare_professional">Healthcare Professional</option>
                  <option value="patient">Patient</option>
                  <option value="vendor">Vendor</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add User
              </button>
            </div>
          </div>

          {/* Users Table */}
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
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.date_joined).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          {user.is_active ? (
                            <button
                              onClick={() => handleDeactivateUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateUser(user.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newUser.user_type}
                  onChange={(e) => setNewUser({...newUser, user_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="patient">Patient</option>
                  <option value="healthcare_professional">Healthcare Professional</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="text"
                  placeholder="First Name"
                  value={newUser.first_name}
                  onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={newUser.last_name}
                  onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Organization"
                  value={newUser.organization}
                  onChange={(e) => setNewUser({...newUser, organization: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit User</h3>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={editingUser.user_type}
                  onChange={(e) => setEditingUser({...editingUser, user_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="patient">Patient</option>
                  <option value="healthcare_professional">Healthcare Professional</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingUser.is_active}
                    onChange={(e) => setEditingUser({...editingUser, is_active: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Active</label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateUser(editingUser)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminAuthGuard>
      <AdminUsersContent />
    </AdminAuthGuard>
  );
} 