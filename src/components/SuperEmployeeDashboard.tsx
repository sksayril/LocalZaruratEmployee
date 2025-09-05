import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiCreateEmployee, CreateEmployeeData } from '../services/api';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Shield, 
  TrendingUp,
  UserCheck,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Hash,
  Copy,
  LogOut,
  User,
  Mail,
  Plus,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

const SuperEmployeeDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [showCreateEmployeeModal, setShowCreateEmployeeModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // State for area assignment
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [isAssigningArea, setIsAssigningArea] = useState(false);
  const [areaMessage, setAreaMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState<CreateEmployeeData>({
    name: '',
    email: '',
    password: ''
  });

  const handleLogout = () => {
    logout();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get token from user context or localStorage as fallback
    let token = user?.token;
    let tokenSource = 'user context';
    
    if (!token) {
      // First try to get from employee_user object
      const storedUser = localStorage.getItem('employee_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          token = parsedUser.token;
          tokenSource = 'employee_user object';
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      }
      
      // If still no token, try to get from authtoken directly
      if (!token) {
        const authToken = localStorage.getItem('authtoken');
        if (authToken) {
          token = authToken;
          tokenSource = 'authtoken key';
        }
      }
    }

    // Debug: Log all localStorage keys to help identify token storage
    console.log('Available localStorage keys:', Object.keys(localStorage));
    console.log('Token found:', !!token);
    console.log('Token source:', tokenSource);

    if (!token) {
      setCreateMessage({ type: 'error', text: 'Authentication token not found. Please login again.' });
      return;
    }

    // Validate form data
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setCreateMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setIsCreating(true);
    setCreateMessage(null);

    try {
      console.log('Creating employee with data:', formData);
      console.log('Using token:', token ? `Token found (${token.substring(0, 20)}...)` : 'No token');
      console.log('Token source:', tokenSource);
      
      const response = await apiCreateEmployee(formData, token);
      
      console.log('API Response:', response);
      
      if (response.success) {
        setCreateMessage({ type: 'success', text: 'Employee created successfully!' });
        setFormData({
          name: '',
          email: '',
          password: ''
        });
        setTimeout(() => {
          setShowCreateEmployeeModal(false);
          setCreateMessage(null);
        }, 2000);
      } else {
        setCreateMessage({ type: 'error', text: response.message || 'Failed to create employee' });
      }
    } catch (error: any) {
      console.error('Error creating employee:', error);
      setCreateMessage({ 
        type: 'error', 
        text: error.message || 'Failed to create employee. Please check your connection and try again.' 
      });
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: ''
    });
    setCreateMessage(null);
    setShowPassword(false);
  };

  const handleAreaAssignment = async () => {
    if (!selectedEmployee || !selectedArea) {
      setAreaMessage({ type: 'error', text: 'Please select both employee and area.' });
      return;
    }

    setIsAssigningArea(true);
    setAreaMessage(null);

    try {
      // Get token for API call
      let token = user?.token;
      if (!token) {
        const storedUser = localStorage.getItem('employee_user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            token = parsedUser.token;
          } catch (error) {
            console.error('Error parsing stored user data:', error);
          }
        }
        
        if (!token) {
          const authToken = localStorage.getItem('authtoken');
          if (authToken) {
            token = authToken;
          }
        }
      }

      if (!token) {
        setAreaMessage({ type: 'error', text: 'Authentication token not found. Please login again.' });
        return;
      }

      // TODO: Replace with actual API call
      // const response = await apiAssignAreaToEmployee(selectedEmployee, selectedArea, token);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAreaMessage({ type: 'success', text: 'Area assigned successfully!' });
      setSelectedEmployee('');
      setSelectedArea('');
      
      setTimeout(() => {
        setAreaMessage(null);
      }, 3000);
      
    } catch (error: any) {
      setAreaMessage({ type: 'error', text: error.message || 'Failed to assign area. Please try again.' });
    } finally {
      setIsAssigningArea(false);
    }
  };


  // Mock data for areas and employees (replace with real API data)
  const availableAreas = [
    { id: 'area1', name: 'North Delhi', code: 'ND', status: 'active' },
    { id: 'area2', name: 'South Delhi', code: 'SD', status: 'active' },
    { id: 'area3', name: 'East Delhi', code: 'ED', status: 'active' },
    { id: 'area4', name: 'West Delhi', code: 'WD', status: 'active' },
    { id: 'area5', name: 'Central Delhi', code: 'CD', status: 'active' },
  ];

  const availableEmployees = [
    { id: 'emp1', name: 'Alice Johnson', employeeId: 'EMP001', department: 'Operations', status: 'Active' },
    { id: 'emp2', name: 'Bob Wilson', employeeId: 'EMP002', department: 'Sales', status: 'Active' },
    { id: 'emp3', name: 'Carol Davis', employeeId: 'EMP003', department: 'IT', status: 'Active' },
    { id: 'emp4', name: 'David Brown', employeeId: 'EMP004', department: 'HR', status: 'Active' },
  ];

  const companyStats = {
    totalEmployees: 156,
    activeToday: 142,
    pendingTasks: 89,
    completionRate: 87
  };

  // Show loading state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              Super Employee Dashboard
            </h1>
            <p className="text-emerald-100 mb-4">
              Welcome, {user.firstName} {user.lastName} • {user.department} Department
            </p>
            
            {/* Unique Super Employee ID Display */}
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-4 max-w-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Hash className="h-5 w-5 text-white" />
                  <div>
                    <p className="text-sm font-medium text-emerald-100">Your Super Employee ID</p>
                    <p className="text-lg font-bold text-white font-mono tracking-wider">
                      {user.employeeId}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(user.employeeId || '')}
                  className="p-2 text-white hover:text-emerald-100 hover:bg-white/20 rounded-lg transition-colors"
                  title="Copy ID to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-emerald-200 mt-2 font-medium">✓ Copied to clipboard!</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-xl p-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'Total Employees', value: companyStats.totalEmployees, color: 'blue' },
          { icon: UserCheck, label: 'Active Today', value: companyStats.activeToday, color: 'emerald' },
          { icon: Clock, label: 'Pending Tasks', value: companyStats.pendingTasks, color: 'orange' },
          { icon: TrendingUp, label: 'Completion Rate', value: `${companyStats.completionRate}%`, color: 'purple' }
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${color}-600 text-sm font-medium`}>{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
              <div className={`bg-${color}-100 rounded-lg p-3`}>
                <Icon className={`h-6 w-6 text-${color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Analytics', icon: BarChart3 },
            { id: 'employees', label: 'Employee Management', icon: Users },
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'reports', label: 'Reports', icon: FileText },
            { id: 'settings', label: 'System Settings', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 transition-all ${
                activeTab === id
                  ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Company Analytics</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Department Distribution</h3>
                  <div className="space-y-3">
                    {[
                      { dept: 'Operations', count: 45, percentage: 29 },
                      { dept: 'Marketing', count: 32, percentage: 21 },
                      { dept: 'Sales', count: 28, percentage: 18 },
                      { dept: 'IT', count: 25, percentage: 16 },
                      { dept: 'HR', count: 15, percentage: 10 },
                      { dept: 'Finance', count: 11, percentage: 7 }
                    ].map(({ dept, count, percentage }) => (
                      <div key={dept} className="flex items-center justify-between">
                        <span className="text-blue-800 font-medium">{dept}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-900 font-semibold">{count}</span>
                          <div className="w-16 bg-blue-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'New employee registered', time: '2 hours ago', type: 'success' },
                      { action: 'Task completion rate increased', time: '4 hours ago', type: 'info' },
                      { action: 'Monthly report generated', time: '1 day ago', type: 'success' },
                      { action: 'System maintenance scheduled', time: '2 days ago', type: 'warning' }
                    ].map(({ action, time, type }, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          type === 'success' ? 'bg-emerald-500' :
                          type === 'warning' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-emerald-800 font-medium text-sm">{action}</p>
                          <p className="text-emerald-600 text-xs">{time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'employees' && (
            <div className="space-y-8">
              {/* Header with Create Employee Button */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
                <button 
                  onClick={() => setShowCreateEmployeeModal(true)}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add New Employee</span>
                </button>
              </div>

              {/* Area Assignment Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-blue-600 rounded-lg p-2">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900">Area Assignment</h3>
                    <p className="text-blue-700">Assign areas to employees for better management</p>
                  </div>
                </div>

                {/* Message Display */}
                {areaMessage && (
                  <div className={`mb-4 p-4 rounded-lg ${
                    areaMessage.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {areaMessage.text}
                  </div>
                )}

                {/* Assignment Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Select Employee *
                    </label>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="">Choose an employee</option>
                      {availableEmployees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} ({employee.employeeId}) - {employee.department}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Select Area *
                    </label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="">Choose an area</option>
                      {availableAreas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.name} ({area.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleAreaAssignment}
                      disabled={isAssigningArea || !selectedEmployee || !selectedArea}
                      className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      {isAssigningArea ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Assigning...</span>
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4" />
                          <span>Assign Area</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Current Assignments Preview */}
                <div className="mt-6 pt-6 border-t border-blue-200">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">Current Area Assignments</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableEmployees.slice(0, 4).map((employee) => (
                      <div key={employee.id} className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{employee.name}</p>
                            <p className="text-sm text-gray-600">{employee.employeeId}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {availableAreas[Math.floor(Math.random() * availableAreas.length)].name}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Employee List Section */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Employees</h3>
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No employees found. Create your first employee to get started!</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-1">Full Name</label>
                      <p className="text-emerald-900 font-medium">{user.firstName} {user.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-1">Email</label>
                      <p className="text-emerald-900 font-medium flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-1">Employee ID</label>
                      <p className="text-emerald-900 font-medium font-mono">{user.employeeId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-1">Department</label>
                      <p className="text-emerald-900 font-medium capitalize">{user.department}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-1">Role</label>
                      <p className="text-emerald-900 font-medium capitalize">{user.role.replace('-', ' ')}</p>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Account Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">Account Status</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">Login Status</span>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                        Online
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">Last Login</span>
                      <span className="text-blue-900 font-medium">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">Access Level</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        Super Employee
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Settings, label: 'Update Profile', color: 'blue' },
                    { icon: Shield, label: 'Change Password', color: 'emerald' },
                    { icon: FileText, label: 'Download Data', color: 'purple' },
                    { icon: LogOut, label: 'Logout', color: 'red', action: handleLogout }
                  ].map(({ icon: Icon, label, color, action }) => (
                    <button
                      key={label}
                      onClick={action}
                      className={`p-4 rounded-xl border-2 border-dashed border-${color}-200 hover:border-${color}-400 hover:bg-${color}-50 transition-all group`}
                    >
                      <Icon className={`h-6 w-6 text-${color}-600 mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                      <p className={`text-sm font-medium text-${color}-700`}>{label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: 'Monthly Attendance Report', description: 'Comprehensive attendance analysis', icon: Calendar },
                  { title: 'Performance Analytics', description: 'Employee performance metrics', icon: TrendingUp },
                  { title: 'Department Overview', description: 'Department-wise statistics', icon: BarChart3 }
                ].map(({ title, description, icon: Icon }) => (
                  <div key={title} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                    <Icon className="h-8 w-8 text-emerald-600 mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{description}</p>
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors">
                      Generate Report →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: 'User Management', description: 'Manage user roles and permissions', icon: Users },
                  { title: 'System Configuration', description: 'Configure system-wide settings', icon: Settings },
                  { title: 'Security Settings', description: 'Manage security policies', icon: Shield },
                  { title: 'Backup & Recovery', description: 'Data backup and recovery options', icon: AlertCircle }
                ].map(({ title, description, icon: Icon }) => (
                  <div key={title} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                    <Icon className="h-8 w-8 text-emerald-600 mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Employee Modal */}
      {showCreateEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <User className="h-6 w-6 mr-2 text-emerald-600" />
                Create New Employee
              </h2>
              <button
                onClick={() => {
                  setShowCreateEmployeeModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateEmployee} className="p-6 space-y-6">
              {/* Message Display */}
              {createMessage && (
                <div className={`p-4 rounded-lg ${
                  createMessage.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {createMessage.text}
                </div>
              )}

              {/* Loading Indicator */}
              {isCreating && (
                <div className="p-4 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span>Creating employee...</span>
                  </div>
                </div>
              )}

              {/* Employee Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Employee Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Enter full name (e.g., Jane Smith)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Enter email address (e.g., jane.smith@company.com)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        placeholder="Enter password (e.g., SecurePass123!)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateEmployeeModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Create Employee</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperEmployeeDashboard;