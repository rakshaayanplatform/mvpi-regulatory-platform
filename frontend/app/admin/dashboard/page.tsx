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
}

interface AuditLog {
  id: number;
  user: string;
  action: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
}

interface SystemStats {
  total_users: number;
  active_users: number;
  pending_users: number;
  total_audit_logs: number;
  system_health: string;
  last_backup: string;
}

interface SystemHealth {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  uptime: string;
  active_connections: number;
  database_status: string;
  cache_status: string;
}

function AdminDashboardContent() {
  const [stats, setStats] = useState<SystemStats>({
    total_users: 0,
    active_users: 0,
    pending_users: 0,
    total_audit_logs: 0,
    system_health: "Loading...",
    last_backup: "Loading..."
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentAuditLogs, setRecentAuditLogs] = useState<AuditLog[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [usersResponse, auditLogsResponse, systemHealthResponse] = await Promise.all([
        api.get('/api/admin/users/'),
        api.get('/api/admin/audit-logs/'),
        api.get('/api/admin/system/health/')
      ]);

      const users = usersResponse.data;
      const auditLogs = auditLogsResponse.data;
      const health = systemHealthResponse.data;

      // Calculate stats
      const totalUsers = users.length;
      const activeUsers = users.filter((user: User) => user.is_active).length;
      const pendingUsers = totalUsers - activeUsers;
      const totalAuditLogs = auditLogs.length;

      // Get recent users (last 5)
      const recentUsersData = users
        .sort((a: User, b: User) => new Date(b.date_joined).getTime() - new Date(a.date_joined).getTime())
        .slice(0, 5);

      // Get recent audit logs (last 5)
      const recentAuditLogsData = auditLogs
        .sort((a: AuditLog, b: AuditLog) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

      setStats({
        total_users: totalUsers,
        active_users: activeUsers,
        pending_users: pendingUsers,
        total_audit_logs: totalAuditLogs,
        system_health: health.database_status === "Healthy" ? "Healthy" : "Warning",
        last_backup: "2024-01-15 14:30:00" // This would come from system config
      });

      setRecentUsers(recentUsersData);
      setRecentAuditLogs(recentAuditLogsData);
      setSystemHealth(health);

    } catch (err: any) {
      console.error('Error fetching admin data:', err);
      setError(err.response?.data?.error || 'Failed to load admin data');
      
      // Fallback to mock data if API fails
      const mockStats: SystemStats = {
        total_users: 1247,
        active_users: 1189,
        pending_users: 58,
        total_audit_logs: 15420,
        system_health: "Healthy",
        last_backup: "2024-01-15 14:30:00"
      };

      const mockRecentUsers: User[] = [
        {
          id: 1,
          username: "dr.smith",
          email: "dr.smith@hospital.com",
          user_type: "healthcare_professional",
          is_active: true,
          date_joined: "2024-01-15 10:30:00",
          last_login: "2024-01-15 14:25:00"
        },
        {
          id: 2,
          username: "nurse.jones",
          email: "nurse.jones@clinic.com",
          user_type: "healthcare_professional",
          is_active: true,
          date_joined: "2024-01-15 09:15:00",
          last_login: "2024-01-15 13:45:00"
        }
      ];

      const mockRecentAuditLogs: AuditLog[] = [
        {
          id: 1,
          user: "admin",
          action: "User created: dr.smith",
          timestamp: "2024-01-15 14:30:00",
          ip_address: "192.168.1.100",
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        },
        {
          id: 2,
          user: "dr.smith",
          action: "Logged in",
          timestamp: "2024-01-15 14:25:00",
          ip_address: "192.168.1.101",
          user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
        }
      ];

      setStats(mockStats);
      setRecentUsers(mockRecentUsers);
      setRecentAuditLogs(mockRecentAuditLogs);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminAccessToken");
    router.push("/admin/login");
  };

  const getRecentUsers = () => {
    return recentUsers.slice(0, 5);
  };

  const getRecentAuditLogs = () => {
    return recentAuditLogs.slice(0, 5);
  };

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
            <Link href="/admin/dashboard" className="flex items-center px-4 py-2 bg-blue-700 rounded-lg">
              <span className="mr-3">📊</span>
              Dashboard
            </Link>
            <Link href="/admin/users" className="flex items-center px-4 py-2 hover:bg-blue-700 rounded-lg">
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
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
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

        {/* Error Message */}
        {error && (
          <div className="ml-64 p-4 bg-red-100 border border-red-400 text-red-700">
            <p>⚠️ {error} - Showing fallback data</p>
          </div>
        )}

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active_users}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending_users}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Audit Logs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_audit_logs}</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  stats.system_health === "Healthy" 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {stats.system_health}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Last Backup</span>
                <span className="text-sm text-gray-600">{stats.last_backup}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Uptime</span>
                <span className="text-sm text-gray-600">
                  {systemHealth?.uptime || "99.9%"}
                </span>
              </div>
            </div>
            
            {/* System Metrics */}
            {systemHealth && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">CPU Usage</p>
                  <p className="text-lg font-semibold">{systemHealth.cpu_usage}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Memory Usage</p>
                  <p className="text-lg font-semibold">{systemHealth.memory_usage}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Disk Usage</p>
                  <p className="text-lg font-semibold">{systemHealth.disk_usage}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Active Connections</p>
                  <p className="text-lg font-semibold">{systemHealth.active_connections}</p>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                <Link href="/admin/users" className="text-sm text-blue-600 hover:text-blue-500">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {getRecentUsers().map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{user.username}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{user.user_type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Audit Logs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Audit Logs</h3>
                <Link href="/admin/audit-logs" className="text-sm text-blue-600 hover:text-blue-500">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {getRecentAuditLogs().map((log) => (
                  <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{log.user}</span>
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600">{log.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{log.ip_address}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/admin/users" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100">
                <span className="text-2xl mr-3">👤</span>
                <div>
                  <p className="font-medium text-gray-900">Add User</p>
                  <p className="text-sm text-gray-600">Create new user account</p>
                </div>
              </Link>
              <Link href="/admin/roles" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100">
                <span className="text-2xl mr-3">🔐</span>
                <div>
                  <p className="font-medium text-gray-900">Assign Role</p>
                  <p className="text-sm text-gray-600">Manage user permissions</p>
                </div>
              </Link>
              <Link href="/admin/audit-logs" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100">
                <span className="text-2xl mr-3">📊</span>
                <div>
                  <p className="font-medium text-gray-900">View Logs</p>
                  <p className="text-sm text-gray-600">System activity logs</p>
                </div>
              </Link>
              <Link href="/admin/system" className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100">
                <span className="text-2xl mr-3">⚙️</span>
                <div>
                  <p className="font-medium text-gray-900">Settings</p>
                  <p className="text-sm text-gray-600">System configuration</p>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminAuthGuard>
      <AdminDashboardContent />
    </AdminAuthGuard>
  );
} 