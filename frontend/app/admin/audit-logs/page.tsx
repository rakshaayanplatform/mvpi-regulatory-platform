"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminAuthGuard from "@/components/AdminAuthGuard";
import api from "@/utils/axiosInstance";

interface AuditLog {
  id: number;
  user: string;
  action: string;
  timestamp: string;
  details: string;
  ip_address?: string;
  user_agent?: string;
  status: 'success' | 'failure' | 'warning';
  category: 'authentication' | 'user_management' | 'role_management' | 'system' | 'data_access';
}

interface AuditStats {
  total_logs: number;
  success_logs: number;
  failure_logs: number;
  warning_logs: number;
  today_logs: number;
}

function AdminAuditLogsContent() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats>({
    total_logs: 0,
    success_logs: 0,
    failure_logs: 0,
    warning_logs: 0,
    today_logs: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [auditLogs, searchTerm, selectedCategory, selectedStatus, dateRange]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/api/admin/audit-logs/');
      const logsData = response.data;

      // Transform backend data to match frontend interface
      const transformedLogs: AuditLog[] = logsData.map((log: any) => ({
        id: log.id,
        user: log.user_username || log.user || 'Unknown',
        action: log.action,
        timestamp: log.created_at,
        details: log.details ? JSON.stringify(log.details) : '',
        ip_address: log.ip_address,
        user_agent: log.user_agent,
        status: 'success', // Default to success since backend doesn't have status
        category: getCategoryFromAction(log.action)
      }));

      setAuditLogs(transformedLogs);
      calculateStats(transformedLogs);

    } catch (err: any) {
      console.error('Error fetching audit logs:', err);
      setError(err.response?.data?.error || 'Failed to load audit logs');
      
      // Fallback to mock data
      const mockLogs: AuditLog[] = [
        {
          id: 1,
          user: "admin@nimhans.gov.in",
          action: "User Login",
          timestamp: "2024-01-17T10:30:00Z",
          details: "Successful login from IP 192.168.1.100",
          ip_address: "192.168.1.100",
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          status: "success",
          category: "authentication"
        },
        {
          id: 2,
          user: "admin@nimhans.gov.in",
          action: "User Updated",
          timestamp: "2024-01-17T10:35:00Z",
          details: "Updated user profile for john.doe@hospital.com",
          ip_address: "192.168.1.100",
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          status: "success",
          category: "user_management"
        }
      ];

      setAuditLogs(mockLogs);
      calculateStats(mockLogs);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromAction = (action: string): string => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login') || actionLower.includes('logout') || actionLower.includes('auth')) {
      return 'authentication';
    } else if (actionLower.includes('user') || actionLower.includes('profile')) {
      return 'user_management';
    } else if (actionLower.includes('role')) {
      return 'role_management';
    } else if (actionLower.includes('system') || actionLower.includes('config')) {
      return 'system';
    } else {
      return 'data_access';
    }
  };

  const calculateStats = (logs: AuditLog[]) => {
    const total = logs.length;
    const success = logs.filter(log => log.status === 'success').length;
    const failure = logs.filter(log => log.status === 'failure').length;
    const warning = logs.filter(log => log.status === 'warning').length;
    
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter(log => log.timestamp.startsWith(today)).length;

    setStats({
      total_logs: total,
      success_logs: success,
      failure_logs: failure,
      warning_logs: warning,
      today_logs: todayLogs
    });
  };

  const filterLogs = () => {
    let filtered = auditLogs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(log => log.status === selectedStatus);
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(log => log.timestamp >= dateRange.start);
    }
    if (dateRange.end) {
      filtered = filtered.filter(log => log.timestamp <= dateRange.end + 'T23:59:59');
    }

    setFilteredLogs(filtered);
  };

  const handleExportLogs = async () => {
    try {
      setError(null);
      
            const response = await api.get('/api/admin/audit-logs/export/', { 
        responseType: 'blob' 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'audit_logs.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (err: any) {
      console.error('Error exporting logs:', err);
      setError(err.response?.data?.error || 'Failed to export logs');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminAccessToken");
    router.push("/admin/login");
  };

  const getStats = () => [
    { label: "Total Logs", value: stats.total_logs, color: "blue" },
    { label: "Success", value: stats.success_logs, color: "green" },
    { label: "Failures", value: stats.failure_logs, color: "red" },
    { label: "Warnings", value: stats.warning_logs, color: "yellow" },
    { label: "Today", value: stats.today_logs, color: "purple" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failure': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'authentication': return 'bg-blue-100 text-blue-800';
      case 'user_management': return 'bg-purple-100 text-purple-800';
      case 'role_management': return 'bg-indigo-100 text-indigo-800';
      case 'system': return 'bg-orange-100 text-orange-800';
      case 'data_access': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
            <Link href="/admin/dashboard" className="flex items-center px-4 py-2 hover:bg-blue-700 rounded-lg">
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
            <Link href="/admin/audit-logs" className="flex items-center px-4 py-2 bg-blue-700 rounded-lg">
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
            <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
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
            <p>⚠️ {error}</p>
          </div>
        )}

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {getStats().map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                    <span className="text-2xl">📋</span>
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
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  {showFilters ? 'Hide' : 'Show'} Filters
                </button>
              </div>
              <button
                onClick={handleExportLogs}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Export CSV
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="authentication">Authentication</option>
                  <option value="user_management">User Management</option>
                  <option value="role_management">Role Management</option>
                  <option value="system">System</option>
                  <option value="data_access">Data Access</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="failure">Failure</option>
                  <option value="warning">Warning</option>
                </select>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="End Date"
                />
              </div>
            )}
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{log.user}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.action}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(log.category)}`}>
                          {log.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ip_address || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={log.details}>
                          {log.details}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* No Results */}
          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No audit logs found</div>
              <div className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminAuditLogsPage() {
  return (
    <AdminAuthGuard>
      <AdminAuditLogsContent />
    </AdminAuthGuard>
  );
} 