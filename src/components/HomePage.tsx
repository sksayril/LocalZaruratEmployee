import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, ArrowRight, CheckCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">EmployeeHub</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          A comprehensive employee management system designed for modern workplaces. 
          Choose your access level to get started.
        </p>
      </div>

      {/* Access Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Normal Employee Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Employee Access</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Access your personal dashboard, view your profile, track attendance, and manage your tasks.
          </p>
          
          <div className="space-y-3 mb-8">
            {['Personal Dashboard', 'Attendance Tracking', 'Task Management', 'Profile Settings'].map((feature) => (
              <div key={feature} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Link
              to="/employee/login"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center group"
            >
              Employee Login
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/employee/signup"
              className="w-full border border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center block"
            >
              Create Employee Account
            </Link>
          </div>
        </div>

        {/* Super Employee Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-xl mb-6">
            <Shield className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Super Employee Access</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Advanced dashboard with administrative privileges, employee management, and analytics.
          </p>
          
          <div className="space-y-3 mb-8">
            {['Administrative Dashboard', 'Employee Management', 'Analytics & Reports', 'System Controls'].map((feature) => (
              <div key={feature} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Link
              to="/super-employee/login"
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center group"
            >
              Super Employee Login
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/super-employee/signup"
              className="w-full border border-emerald-600 text-emerald-600 py-3 px-6 rounded-lg hover:bg-emerald-50 transition-colors font-medium text-center block"
            >
              Create Super Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;