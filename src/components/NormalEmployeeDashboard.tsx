import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Clock, 
  CheckSquare, 
  User, 
  Bell, 
  BarChart3,
  FileText,
  Settings,
  Hash,
  Copy
} from 'lucide-react';

const NormalEmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const mockTasks = [
    { id: 1, title: 'Complete monthly report', priority: 'High', dueDate: '2025-01-20', status: 'In Progress' },
    { id: 2, title: 'Team meeting preparation', priority: 'Medium', dueDate: '2025-01-18', status: 'Pending' },
    { id: 3, title: 'Client presentation review', priority: 'High', dueDate: '2025-01-22', status: 'Pending' },
  ];

  const mockAttendance = {
    thisMonth: { present: 18, absent: 2, late: 1 },
    thisWeek: { present: 4, absent: 1, late: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mb-3">
              {user?.department} Department
            </p>
            
            {/* Unique Employee ID Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Hash className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Your Unique Employee ID</p>
                    <p className="text-lg font-bold text-blue-900 font-mono tracking-wider">
                      {user?.employeeId}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(user?.employeeId || '')}
                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Copy ID to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 mt-2 font-medium">✓ Copied to clipboard!</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
            { id: 'attendance', label: 'Attendance', icon: Calendar },
            { id: 'profile', label: 'Profile', icon: User }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 transition-all ${
                activeTab === id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Pending Tasks</p>
                      <p className="text-2xl font-bold text-blue-900">3</p>
                    </div>
                    <CheckSquare className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Attendance Rate</p>
                      <p className="text-2xl font-bold text-green-900">95%</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-medium">Hours This Week</p>
                      <p className="text-2xl font-bold text-orange-900">38</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Clock, label: 'Clock In/Out', color: 'blue' },
                    { icon: FileText, label: 'Submit Report', color: 'emerald' },
                    { icon: Bell, label: 'View Notifications', color: 'orange' },
                    { icon: Settings, label: 'Settings', color: 'gray' }
                  ].map(({ icon: Icon, label, color }) => (
                    <button
                      key={label}
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

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
              <div className="space-y-4">
                {mockTasks.map((task) => (
                  <div key={task.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                        <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Attendance Record</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">This Month</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Present Days:</span>
                      <span className="font-semibold text-blue-900">{mockAttendance.thisMonth.present}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Absent Days:</span>
                      <span className="font-semibold text-blue-900">{mockAttendance.thisMonth.absent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Late Arrivals:</span>
                      <span className="font-semibold text-blue-900">{mockAttendance.thisMonth.late}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-4">This Week</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Present Days:</span>
                      <span className="font-semibold text-emerald-900">{mockAttendance.thisWeek.present}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Absent Days:</span>
                      <span className="font-semibold text-emerald-900">{mockAttendance.thisWeek.absent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Late Arrivals:</span>
                      <span className="font-semibold text-emerald-900">{mockAttendance.thisWeek.late}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <p className="text-gray-900 font-medium">{user?.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <p className="text-gray-900 font-medium">{user?.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900 font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <p className="text-gray-900 font-medium">{user?.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                    <p className="text-gray-900 font-medium">{user?.employeeId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <p className="text-gray-900 font-medium capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NormalEmployeeDashboard;