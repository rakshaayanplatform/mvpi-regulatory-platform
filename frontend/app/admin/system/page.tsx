"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminAuthGuard from "@/components/AdminAuthGuard";
import api from "@/utils/axiosInstance";

interface SystemConfig {
  site_name: string;
  maintenance_mode: boolean;
  registration_enabled: boolean;
  email_notifications: boolean;
  backup_frequency: string;
  session_timeout: number;
  max_login_attempts: number;
  password_policy: {
    min_length: number;
    require_uppercase: boolean;
    require_numbers: boolean;
    require_special: boolean;
  };
}

interface SystemStatus {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  uptime: string;
  active_connections: number;
  database_status: string;
  cache_status: string;
}

function AdminSystemContent() {
  const [config, setConfig] = useState<SystemConfig>({
    site_name: "NIMHANS Medical Device Monitoring",
    maintenance_mode: false,
    registration_enabled: true,
    email_notifications: true,
    backup_frequency: "daily",
    session_timeout: 30,
    max_login_attempts: 5,
    password_policy: {
      min_length: 8,
      require_uppercase: true,
      require_numbers: true,
      require_special: true
    }
  });

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    cpu_usage: 45,
    memory_usage: 62,
    disk_usage: 78,
    uptime: "15 days, 8 hours, 32 minutes",
    active_connections: 127,
    database_status: "Healthy",
    cache_status: "Connected"
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch system config and health in parallel
      const [configResponse, healthResponse] = await Promise.all([
        api.get('/api/admin/system/config/'),
        api.get('/api/admin/system/health/')
      ]);

      setConfig(configResponse.data);
      setSystemStatus(healthResponse.data);

    } catch (err: any) {
      console.error('Error fetching system data:', err);
      setError(err.response?.data?.error || 'Failed to load system data');
      
      // Keep default values if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleConfigUpdate = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      await api.put('/api/admin/system/config/update/', config);
      
      setSuccessMessage('System configuration updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (err: any) {
      console.error('Error updating system config:', err);
      setError(err.response?.data?.error || 'Failed to update system configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleMaintenanceToggle = async () => {
    try {
      setError(null);
      setSuccessMessage(null);

      const newMaintenanceMode = !config.maintenance_mode;
      const updatedConfig = { ...config, maintenance_mode: newMaintenanceMode };

              await api.put('/api/admin/system/config/update/', updatedConfig);
      
      setConfig(updatedConfig);
      setSuccessMessage(`Maintenance mode ${newMaintenanceMode ? 'enabled' : 'disabled'} successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (err: any) {
      console.error('Error toggling maintenance mode:', err);
      setError(err.response?.data?.error || 'Failed to toggle maintenance mode');
    }
  };

  const handleSystemBackup = async () => {
    try {
      setError(null);
      setSuccessMessage(null);

              await api.post('/api/admin/system/backup/', {});
      
      setSuccessMessage('Manual backup initiated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (err: any) {
      console.error('Error initiating backup:', err);
      setError(err.response?.data?.error || 'Failed to initiate backup');
    }
  };

  const handleSystemRestart = async () => {
    if (!confirm('Are you sure you want to restart the system? This will cause temporary downtime.')) {
      return;
    }

    try {
      setError(null);
      setSuccessMessage(null);

              await api.post('/api/admin/system/restart/', {});
      
      setSuccessMessage('System restart initiated! The system will be back online shortly.');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (err: any) {
      console.error('Error restarting system:', err);
      setError(err.response?.data?.error || 'Failed to restart system');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminAccessToken");
    router.push("/admin/login");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage < 50) return 'text-green-600';
    if (usage < 80) return 'text-yellow-600';
    return 'text-red-600';
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
            <Link href="/admin/audit-logs" className="flex items-center px-4 py-2 hover:bg-blue-700 rounded-lg">
              <span className="mr-3">📋</span>
              Audit Logs
            </Link>
            <Link href="/admin/system" className="flex items-center px-4 py-2 bg-blue-700 rounded-lg">
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
            <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* System Configuration */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">System Configuration</h3>
              
              <div className="space-y-6">
                {/* Site Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={config.site_name}
                    onChange={(e) => setConfig({...config, site_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Maintenance Mode */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                    <p className="text-sm text-gray-500">Temporarily disable user access</p>
                  </div>
                  <button
                    onClick={handleMaintenanceToggle}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      config.maintenance_mode
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {config.maintenance_mode ? 'Disable' : 'Enable'}
                  </button>
                </div>

                {/* Registration */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">User Registration</label>
                    <p className="text-sm text-gray-500">Allow new user registrations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.registration_enabled}
                      onChange={(e) => setConfig({...config, registration_enabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                    <p className="text-sm text-gray-500">Send email notifications to users</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.email_notifications}
                      onChange={(e) => setConfig({...config, email_notifications: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Backup Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                  <select
                    value={config.backup_frequency}
                    onChange={(e) => setConfig({...config, backup_frequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {/* Session Timeout */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="1440"
                    value={config.session_timeout}
                    onChange={(e) => setConfig({...config, session_timeout: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Max Login Attempts */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={config.max_login_attempts}
                    onChange={(e) => setConfig({...config, max_login_attempts: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Save Button */}
                <button
                  onClick={handleConfigUpdate}
                  disabled={saving}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="space-y-6">
              {/* System Health */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">System Health</h3>
                
                <div className="space-y-4">
                  {/* CPU Usage */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                      <span className={`text-sm font-semibold ${getUsageColor(systemStatus.cpu_usage)}`}>
                        {systemStatus.cpu_usage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getUsageColor(systemStatus.cpu_usage).replace('text-', 'bg-')}`}
                        style={{ width: `${systemStatus.cpu_usage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Memory Usage */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                      <span className={`text-sm font-semibold ${getUsageColor(systemStatus.memory_usage)}`}>
                        {systemStatus.memory_usage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getUsageColor(systemStatus.memory_usage).replace('text-', 'bg-')}`}
                        style={{ width: `${systemStatus.memory_usage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Disk Usage */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Disk Usage</span>
                      <span className={`text-sm font-semibold ${getUsageColor(systemStatus.disk_usage)}`}>
                        {systemStatus.disk_usage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getUsageColor(systemStatus.disk_usage).replace('text-', 'bg-')}`}
                        style={{ width: `${systemStatus.disk_usage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Database</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(systemStatus.database_status)}`}>
                          {systemStatus.database_status}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Cache</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(systemStatus.cache_status)}`}>
                          {systemStatus.cache_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Uptime</span>
                      <span className="text-sm font-medium text-gray-900">{systemStatus.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Connections</span>
                      <span className="text-sm font-medium text-gray-900">{systemStatus.active_connections}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">System Actions</h3>
                
                <div className="space-y-4">
                  <button
                    onClick={handleSystemBackup}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Initiate Manual Backup
                  </button>
                  
                  <button
                    onClick={handleSystemRestart}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Restart System
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminSystemPage() {
  return (
    <AdminAuthGuard>
      <AdminSystemContent />
    </AdminAuthGuard>
  );
} 