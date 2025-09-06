import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiCreateEmployee, CreateEmployeeData, apiGetEmployees, Employee, GetEmployeesParams, apiGetEmployeesByArea, GetEmployeesByAreaParams, apiAssignAreaToEmployee, AssignAreaToEmployeeData, apiRemoveAreaFromEmployee, RemoveAreaFromEmployeeData, apiApproveEmployee, apiRejectEmployee, ApproveEmployeeData, apiGetPendingEmployees, GetPendingEmployeesParams, apiGetAllEmployees, GetAllEmployeesParams, apiGetEmployeeDetails, apiGetEmployeeStatistics, EmployeeStatistics, apiGetEmployeesByAreaModal, GetEmployeesByAreaModalResponse, GetEmployeesByAreaModalParams } from '../services/api';
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
  
  
  // State for employees management
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [filters, setFilters] = useState<GetEmployeesParams>({
    page: 1,
    limit: 10,
    status: 'all',
    department: 'all'
  });
  
  // State for area management
  const [areaEmployees, setAreaEmployees] = useState<Employee[]>([]);
  const [isLoadingAreaEmployees, setIsLoadingAreaEmployees] = useState(false);
  const [areaEmployeesError, setAreaEmployeesError] = useState<string | null>(null);
  const [areaPagination, setAreaPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [areaFilters, setAreaFilters] = useState<GetEmployeesByAreaParams>({
    areaType: 'city',
    areaCode: 'NDL_003',
    page: 1,
    limit: 10
  });
  const [areaInfo, setAreaInfo] = useState<{
    areaType: string;
    areaCode: string;
    areaName: string;
  } | null>(null);
  
  // State for area assignment
  const [showAssignAreaModal, setShowAssignAreaModal] = useState(false);
  const [isAssigningArea, setIsAssigningArea] = useState(false);
  const [assignAreaMessage, setAssignAreaMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [assignAreaForm, setAssignAreaForm] = useState<AssignAreaToEmployeeData>({
    employeeId: '',
    areaId: '',
    areaName: '',
    areaType: 'city',
    areaCode: [],
    notes: ''
  });
  
  // State for area removal
  const [isRemovingArea, setIsRemovingArea] = useState(false);
  const [areaAction, setAreaAction] = useState<'assign' | 'remove'>('assign');
  const [removeAreaForm, setRemoveAreaForm] = useState<RemoveAreaFromEmployeeData>({
    employeeId: '',
    areaId: ''
  });
  
  // State for employees by area modal
  const [showEmployeesByAreaModal, setShowEmployeesByAreaModal] = useState(false);
  const [employeesByAreaData, setEmployeesByAreaData] = useState<GetEmployeesByAreaModalResponse | null>(null);
  const [isLoadingEmployeesByArea, setIsLoadingEmployeesByArea] = useState(false);
  const [employeesByAreaError, setEmployeesByAreaError] = useState<string | null>(null);
  
  // State for dropdowns
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedArea, setSelectedArea] = useState<{ areaId: string; areaName: string; areaType: string; areaCode: string[] } | null>(null);

  // State for approval actions
  const [approvalMessage, setApprovalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State for approval modal
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedEmployeeForApproval, setSelectedEmployeeForApproval] = useState<Employee | null>(null);
  const [approvalType, setApprovalType] = useState<'approve' | 'reject'>('approve');
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  
  // State for pending employees
  const [pendingEmployees, setPendingEmployees] = useState<Employee[]>([]);
  const [isLoadingPendingEmployees, setIsLoadingPendingEmployees] = useState(false);
  const [pendingEmployeesError, setPendingEmployeesError] = useState<string | null>(null);
  const [pendingPagination, setPendingPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [pendingFilters, setPendingFilters] = useState<GetPendingEmployeesParams>({
    page: 1,
    limit: 10,
    department: 'all'
  });
  
  // State for all employees
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [isLoadingAllEmployees, setIsLoadingAllEmployees] = useState(false);
  const [allEmployeesError, setAllEmployeesError] = useState<string | null>(null);
  const [allEmployeesPagination, setAllEmployeesPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [allEmployeesFilters, setAllEmployeesFilters] = useState<GetAllEmployeesParams>({
    page: 1,
    limit: 10,
    status: 'all',
    department: 'all'
  });
  
  // State for employee details modal
  const [showEmployeeDetailsModal, setShowEmployeeDetailsModal] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState<Employee | null>(null);
  const [isLoadingEmployeeDetails, setIsLoadingEmployeeDetails] = useState(false);
  const [employeeDetailsError, setEmployeeDetailsError] = useState<string | null>(null);
  
  // State for employee statistics
  const [employeeStatistics, setEmployeeStatistics] = useState<EmployeeStatistics | null>(null);
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(false);
  const [statisticsError, setStatisticsError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateEmployeeData>({
    name: '',
    email: '',
    password: ''
  });

  const handleLogout = () => {
    logout();
  };

  // Function to get authentication token
  const getAuthToken = (): string | null => {
    let token = user?.token || null;
    
    if (!token) {
      const storedUser = localStorage.getItem('employee_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          token = parsedUser.token || null;
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
    
    return token;
  };

  // Function to fetch employees
  const fetchEmployees = async (params: GetEmployeesParams) => {
    const token = getAuthToken();
    if (!token) {
      setEmployeesError('Authentication token not found. Please login again.');
      return;
    }

    setIsLoadingEmployees(true);
    setEmployeesError(null);

    try {
      console.log('Fetching employees with params:', params);
      const response = await apiGetEmployees(params, token);
      
      if (response.success) {
        setEmployees(response.data || []);
        setPagination({
          currentPage: response.pagination?.currentPage || 1,
          totalPages: response.pagination?.totalPages || 1,
          totalItems: response.pagination?.totalItems || 0,
          itemsPerPage: response.pagination?.itemsPerPage || 10,
          hasNextPage: (response.pagination?.currentPage || 1) < (response.pagination?.totalPages || 1),
          hasPrevPage: (response.pagination?.currentPage || 1) > 1
        });
        console.log('Employees fetched successfully:', response);
      } else {
        setEmployeesError('Failed to fetch employees');
      }
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      setEmployeesError(error.message || 'Failed to fetch employees. Please try again.');
      setEmployees([]); // Ensure employees is always an array
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  // Function to fetch employees by area
  const fetchEmployeesByArea = async (params: GetEmployeesByAreaParams) => {
    const token = getAuthToken();
    if (!token) {
      setAreaEmployeesError('Authentication token not found. Please login again.');
      return;
    }

    setIsLoadingAreaEmployees(true);
    setAreaEmployeesError(null);

    try {
      console.log('Fetching employees by area with params:', params);
      const response = await apiGetEmployeesByArea(params, token);
      
      if (response.success) {
        setAreaEmployees(response.data || []);
        setAreaPagination({
          currentPage: response.pagination?.currentPage || 1,
          totalPages: response.pagination?.totalPages || 1,
          totalItems: response.pagination?.totalItems || 0,
          itemsPerPage: response.pagination?.itemsPerPage || 10,
          hasNextPage: (response.pagination?.currentPage || 1) < (response.pagination?.totalPages || 1),
          hasPrevPage: (response.pagination?.currentPage || 1) > 1
        });
        setAreaInfo(response.areaInfo || null);
        console.log('Employees by area fetched successfully:', response);
      } else {
        setAreaEmployeesError('Failed to fetch employees by area');
      }
    } catch (error: any) {
      console.error('Error fetching employees by area:', error);
      setAreaEmployeesError(error.message || 'Failed to fetch employees by area. Please try again.');
      setAreaEmployees([]); // Ensure employees is always an array
    } finally {
      setIsLoadingAreaEmployees(false);
    }
  };

  // Effect to fetch employees when employees tab is active
  useEffect(() => {
    if (activeTab === 'employees') {
      fetchEmployees(filters);
    }
  }, [activeTab, filters]);

  // Effect to fetch employees by area when area tab is active
  useEffect(() => {
    if (activeTab === 'overview') {
      fetchEmployeesByArea(areaFilters);
    }
  }, [activeTab, areaFilters]);

  // Effect to fetch pending employees when pending tab is active
  useEffect(() => {
    if (activeTab === 'settings') {
      fetchPendingEmployees(pendingFilters);
    }
  }, [activeTab, pendingFilters]);

  // Effect to fetch all employees when reports tab is active
  useEffect(() => {
    if (activeTab === 'reports') {
      fetchAllEmployees(allEmployeesFilters);
    }
  }, [activeTab, allEmployeesFilters]);

  // Effect to fetch employee statistics when statistics tab is active
  useEffect(() => {
    if (activeTab === 'statistics') {
      fetchEmployeeStatistics();
    }
  }, [activeTab]);

  // Effect to fetch employees when assign area modal opens
  useEffect(() => {
    if (showAssignAreaModal) {
      console.log('Assign area modal opened. Current employees:', employees);
      if (!employees || employees.length === 0) {
        console.log('No employees found, fetching employees...');
        fetchEmployees(filters);
      }
    }
  }, [showAssignAreaModal]);

  // Function to handle filter changes
  const handleFilterChange = (newFilters: Partial<GetEmployeesParams>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Function to refresh employees list
  const refreshEmployees = () => {
    fetchEmployees(filters);
  };

  // Function to handle area filter changes
  const handleAreaFilterChange = (newFilters: Partial<GetEmployeesByAreaParams>) => {
    setAreaFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Function to handle area page changes
  const handleAreaPageChange = (newPage: number) => {
    setAreaFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Function to refresh area employees list
  const refreshAreaEmployees = () => {
    fetchEmployeesByArea(areaFilters);
  };

  // Function to fetch pending employees
  const fetchPendingEmployees = async (params: GetPendingEmployeesParams) => {
    const token = getAuthToken();
    if (!token) {
      setPendingEmployeesError('Authentication token not found. Please login again.');
      return;
    }

    setIsLoadingPendingEmployees(true);
    setPendingEmployeesError(null);

    try {
      console.log('Fetching pending employees with params:', params);
      const response = await apiGetPendingEmployees(params, token);
      
      if (response.success) {
        setPendingEmployees(response.data || []);
        setPendingPagination({
          currentPage: response.pagination?.currentPage || 1,
          totalPages: response.pagination?.totalPages || 1,
          totalItems: response.pagination?.totalItems || 0,
          itemsPerPage: response.pagination?.itemsPerPage || 10,
          hasNextPage: (response.pagination?.currentPage || 1) < (response.pagination?.totalPages || 1),
          hasPrevPage: (response.pagination?.currentPage || 1) > 1
        });
        console.log('Pending employees fetched successfully:', response);
      } else {
        setPendingEmployeesError('Failed to fetch pending employees');
      }
    } catch (error: any) {
      console.error('Error fetching pending employees:', error);
      setPendingEmployeesError(error.message || 'Failed to fetch pending employees. Please try again.');
      setPendingEmployees([]); // Ensure employees is always an array
    } finally {
      setIsLoadingPendingEmployees(false);
    }
  };

  // Function to handle area assignment form input changes
  const handleAssignAreaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'areaCode') {
      // Handle areaCode as array (comma-separated values)
      const codes = value.split(',').map(code => code.trim()).filter(code => code.length > 0);
      setAssignAreaForm(prev => ({
        ...prev,
        [name]: codes
      }));
    } else {
      setAssignAreaForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Function to handle area assignment
  const handleAssignArea = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = getAuthToken();
    if (!token) {
      setAssignAreaMessage({ type: 'error', text: 'Authentication token not found. Please login again.' });
      return;
    }

    // Validate form data
    if (!assignAreaForm.employeeId.trim() || !assignAreaForm.areaId.trim() || !assignAreaForm.areaName.trim()) {
      setAssignAreaMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    if (assignAreaForm.areaCode.length === 0) {
      setAssignAreaMessage({ type: 'error', text: 'Please provide at least one area code.' });
      return;
    }

    setIsAssigningArea(true);
    setAssignAreaMessage(null);

    try {
      console.log('Assigning area with data:', assignAreaForm);
      
      const response = await apiAssignAreaToEmployee(assignAreaForm, token);
      
      console.log('API Response:', response);
      
      if (response.success) {
        setAssignAreaMessage({ type: 'success', text: 'Area assigned successfully!' });
        setAssignAreaForm({
          employeeId: '',
          areaId: '',
          areaName: '',
          areaType: 'city',
          areaCode: [],
          notes: ''
        });
        // Refresh area employees list
        refreshAreaEmployees();
        setTimeout(() => {
          setShowAssignAreaModal(false);
          setAssignAreaMessage(null);
        }, 2000);
      } else {
        setAssignAreaMessage({ type: 'error', text: response.message || 'Failed to assign area' });
      }
    } catch (error: any) {
      console.error('Error assigning area:', error);
      setAssignAreaMessage({ 
        type: 'error', 
        text: error.message || 'Failed to assign area. Please check your connection and try again.' 
      });
    } finally {
      setIsAssigningArea(false);
    }
  };

  // Function to handle area removal
  const handleRemoveArea = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = getAuthToken();
    if (!token) {
      setAssignAreaMessage({ type: 'error', text: 'Authentication token not found. Please login again.' });
      return;
    }

    // Validate form data
    if (!removeAreaForm.employeeId.trim() || !removeAreaForm.areaId.trim()) {
      setAssignAreaMessage({ type: 'error', text: 'Please select an employee and area to remove.' });
      return;
    }

    setIsRemovingArea(true);
    setAssignAreaMessage(null);

    try {
      console.log('Removing area with data:', removeAreaForm);
      
      const response = await apiRemoveAreaFromEmployee(removeAreaForm, token);
      
      console.log('API Response:', response);
      
      if (response.success) {
        setAssignAreaMessage({ type: 'success', text: 'Area removed successfully!' });
        setRemoveAreaForm({
          employeeId: '',
          areaId: ''
        });
        // Refresh area employees list
        refreshAreaEmployees();
        setTimeout(() => {
          setShowAssignAreaModal(false);
          setAssignAreaMessage(null);
        }, 2000);
      } else {
        setAssignAreaMessage({ type: 'error', text: response.message || 'Failed to remove area' });
      }
    } catch (error: any) {
      console.error('Error removing area:', error);
      setAssignAreaMessage({ 
        type: 'error', 
        text: error.message || 'Failed to remove area. Please check your connection and try again.' 
      });
    } finally {
      setIsRemovingArea(false);
    }
  };

  // Function to reset assign area form
  const resetAssignAreaForm = () => {
    setAssignAreaForm({
      employeeId: '',
      areaId: '',
      areaName: '',
      areaType: 'city',
      areaCode: [],
      notes: ''
    });
    setRemoveAreaForm({
      employeeId: '',
      areaId: ''
    });
    setAreaAction('assign');
    setSelectedEmployee(null);
    setSelectedArea(null);
    setAssignAreaMessage(null);
  };

  // Function to fetch employees by area for modal
  const fetchEmployeesByAreaForModal = async () => {
    const token = getAuthToken();
    if (!token) {
      setEmployeesByAreaError('Authentication token not found. Please login again.');
      return;
    }

    setIsLoadingEmployeesByArea(true);
    setEmployeesByAreaError(null);

    try {
      const params: GetEmployeesByAreaModalParams = {
        areaType: 'city',
        areaCode: 'NDL_003',
        page: 1,
        limit: 10
      };

      console.log('Fetching employees by area with params:', params);
      
      const response = await apiGetEmployeesByAreaModal(params, token);
      
      console.log('API Response:', response);
      
      if (response.success) {
        setEmployeesByAreaData(response);
        setShowEmployeesByAreaModal(true);
      } else {
        setEmployeesByAreaError(response.message || 'Failed to fetch employees by area');
      }
    } catch (error: any) {
      console.error('Error fetching employees by area:', error);
      setEmployeesByAreaError(error.message || 'Failed to fetch employees by area. Please try again.');
    } finally {
      setIsLoadingEmployeesByArea(false);
    }
  };

  // Function to close employees by area modal
  const closeEmployeesByAreaModal = () => {
    setShowEmployeesByAreaModal(false);
    setEmployeesByAreaData(null);
    setEmployeesByAreaError(null);
  };

  // Function to handle employee selection from dropdown
  const handleEmployeeSelection = (employee: Employee) => {
    setSelectedEmployee(employee);
    setAssignAreaForm(prev => ({
      ...prev,
      employeeId: employee._id
    }));
    // Also update remove area form
    setRemoveAreaForm(prev => ({
      ...prev,
      employeeId: employee._id
    }));
  };

  // Function to handle area selection from dropdown
  const handleAreaSelection = (area: { areaId: string; areaName: string; areaType: string; areaCode: string[] }) => {
    setSelectedArea(area);
    setAssignAreaForm(prev => ({
      ...prev,
      areaId: area.areaId,
      areaName: area.areaName,
      areaType: area.areaType as 'city' | 'state' | 'country',
      areaCode: area.areaCode
    }));
  };

  // Function to open approval modal
  const handleOpenApprovalModal = (employee: Employee, type: 'approve' | 'reject') => {
    setSelectedEmployeeForApproval(employee);
    setApprovalType(type);
    setAdminNotes('');
    setRejectionReason('');
    setShowApprovalModal(true);
  };

  // Function to handle approval submission
  const handleSubmitApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployeeForApproval) return;
    
    const token = getAuthToken();
    if (!token) {
      setApprovalMessage({ type: 'error', text: 'Authentication token not found. Please login again.' });
      return;
    }

    if (!adminNotes.trim()) {
      setApprovalMessage({ type: 'error', text: 'Please provide admin notes for the approval decision.' });
      return;
    }

    if (approvalType === 'reject' && !rejectionReason.trim()) {
      setApprovalMessage({ type: 'error', text: 'Please provide a rejection reason when rejecting an employee.' });
      return;
    }

    setIsSubmittingApproval(true);
    setApprovalMessage(null);

    try {
      const requestData: ApproveEmployeeData = {
        employeeId: selectedEmployeeForApproval._id,
        action: approvalType,
        adminNotes: adminNotes.trim(),
        ...(approvalType === 'reject' && { rejectionReason: rejectionReason.trim() })
      };

      console.log('Submitting approval:', requestData);
      
      const response = approvalType === 'approve' 
        ? await apiApproveEmployee(requestData, token)
        : await apiRejectEmployee(requestData, token);
      
      if (response.success) {
        setApprovalMessage({ 
          type: 'success', 
          text: `Employee ${approvalType === 'approve' ? 'approved' : 'rejected'} successfully!` 
        });
        // Refresh employees list
        refreshEmployees();
        // Refresh pending employees list if we're on the pending tab
        if (activeTab === 'settings') {
          refreshPendingEmployees();
        }
        // Close modal and clear form
        setShowApprovalModal(false);
        setSelectedEmployeeForApproval(null);
        setAdminNotes('');
        // Clear message after 3 seconds
        setTimeout(() => setApprovalMessage(null), 3000);
      } else {
        setApprovalMessage({ type: 'error', text: response.message || `Failed to ${approvalType} employee` });
      }
    } catch (error: any) {
      console.error(`Error ${approvalType}ing employee:`, error);
      setApprovalMessage({ 
        type: 'error', 
        text: error.message || `Failed to ${approvalType} employee. Please try again.` 
      });
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  // Function to close approval modal
  const handleCloseApprovalModal = () => {
    setShowApprovalModal(false);
    setSelectedEmployeeForApproval(null);
    setAdminNotes('');
    setRejectionReason('');
    setApprovalMessage(null);
  };

  // Function to handle pending filter changes
  const handlePendingFilterChange = (newFilters: Partial<GetPendingEmployeesParams>) => {
    setPendingFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Function to handle pending page changes
  const handlePendingPageChange = (newPage: number) => {
    setPendingFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Function to refresh pending employees list
  const refreshPendingEmployees = () => {
    fetchPendingEmployees(pendingFilters);
  };

  // Function to fetch all employees
  const fetchAllEmployees = async (filters: GetAllEmployeesParams) => {
    const token = getAuthToken();
    if (!token) {
      setAllEmployeesError('No authentication token found');
      return;
    }

    setIsLoadingAllEmployees(true);
    setAllEmployeesError(null);

    try {
      const response = await apiGetAllEmployees(filters, token);
      
      if (response.success) {
        setAllEmployees(response.data);
        setAllEmployeesPagination({
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          totalItems: response.pagination.totalItems,
          itemsPerPage: response.pagination.itemsPerPage,
          hasNextPage: response.pagination.currentPage < response.pagination.totalPages,
          hasPrevPage: response.pagination.currentPage > 1
        });
      } else {
        setAllEmployeesError('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching all employees:', error);
      setAllEmployeesError(error instanceof Error ? error.message : 'Failed to fetch employees');
    } finally {
      setIsLoadingAllEmployees(false);
    }
  };

  // Function to refresh all employees list
  const refreshAllEmployees = () => {
    fetchAllEmployees(allEmployeesFilters);
  };

  // Function to fetch employee details
  const fetchEmployeeDetails = async (employeeId: string) => {
    const token = getAuthToken();
    if (!token) {
      setEmployeeDetailsError('No authentication token found');
      return;
    }

    setIsLoadingEmployeeDetails(true);
    setEmployeeDetailsError(null);

    try {
      const response = await apiGetEmployeeDetails(employeeId, token);
      
      if (response.success) {
        setSelectedEmployeeDetails(response.data);
        setShowEmployeeDetailsModal(true);
      } else {
        setEmployeeDetailsError('Failed to fetch employee details');
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setEmployeeDetailsError(error instanceof Error ? error.message : 'Failed to fetch employee details');
    } finally {
      setIsLoadingEmployeeDetails(false);
    }
  };

  // Function to handle employee row click
  const handleEmployeeClick = (employee: Employee) => {
    fetchEmployeeDetails(employee._id);
  };

  // Function to close employee details modal
  const closeEmployeeDetailsModal = () => {
    setShowEmployeeDetailsModal(false);
    setSelectedEmployeeDetails(null);
    setEmployeeDetailsError(null);
  };

  // Function to fetch employee statistics
  const fetchEmployeeStatistics = async () => {
    const token = getAuthToken();
    if (!token) {
      setStatisticsError('No authentication token found');
      return;
    }

    setIsLoadingStatistics(true);
    setStatisticsError(null);

    try {
      const response = await apiGetEmployeeStatistics(token);
      
      if (response.success) {
        setEmployeeStatistics(response.data);
      } else {
        setStatisticsError('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching employee statistics:', error);
      setStatisticsError(error instanceof Error ? error.message : 'Failed to fetch statistics');
    } finally {
      setIsLoadingStatistics(false);
    }
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
        // Refresh employees list if we're on the employees tab
        if (activeTab === 'employees') {
          refreshEmployees();
        }
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
            { id: 'overview', label: 'Area', icon: BarChart3 },
            { id: 'employees', label: 'Employee Management', icon: Users },
            { id: 'reports', label: 'All Employees', icon: FileText },
            { id: 'statistics', label: 'Statistics', icon: TrendingUp },
            { id: 'settings', label: 'Pending', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 transition-all ${activeTab === id
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
            <div className="space-y-8">
              {/* Area Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Area Management</h2>
                    <p className="text-blue-100 mb-4">
                      {areaInfo ? `Viewing employees in ${areaInfo.areaName} (${areaInfo.areaCode})` : 'Select an area to view employees'}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Area Filters */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Area Filters</h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedEmployee(null);
                        setAssignAreaForm(prev => ({
                          ...prev,
                          employeeId: ''
                        }));
                        setShowAssignAreaModal(true);
                      }}
                      className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                    >
                      <Users className="h-4 w-4" />
                      <span>Assign Area</span>
                    </button>
                    <button
                      onClick={refreshAreaEmployees}
                      disabled={isLoadingAreaEmployees}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Refresh</span>
                    </button>
                    <button
                      onClick={fetchEmployeesByAreaForModal}
                      disabled={isLoadingEmployeesByArea}
                      className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {isLoadingEmployeesByArea ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4" />
                          <span>Get All Employees by Area</span>
                        </>
                      )}
                    </button>
                  </div>
                          </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area Type
                    </label>
                    <select
                      value={areaFilters.areaType}
                      onChange={(e) => handleAreaFilterChange({ areaType: e.target.value as 'city' | 'state' | 'country' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="city">City</option>
                      <option value="state">State</option>
                      <option value="country">Country</option>
                    </select>
                        </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area Code
                    </label>
                    <input
                      type="text"
                      value={areaFilters.areaCode}
                      onChange={(e) => handleAreaFilterChange({ areaCode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter area code (e.g., NDL_003)"
                    />
                      </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Items per page
                    </label>
                    <select
                      value={areaFilters.limit}
                      onChange={(e) => handleAreaFilterChange({ limit: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                    </select>
                  </div>
                </div>
                {/* Loading State */}
                {isLoadingAreaEmployees && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading employees by area...</p>
                  </div>
                )}

                {/* Error State */}
                {areaEmployeesError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>{areaEmployeesError}</span>
                    </div>
                  </div>
                )}

                {/* Approval Message */}
                {approvalMessage && (
                  <div className={`p-4 rounded-lg mb-4 ${approvalMessage.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>{approvalMessage.text}</span>
                    </div>
                  </div>
                )}

                {/* Area Employees List */}
                {!isLoadingAreaEmployees && !areaEmployeesError && (
                  <>
                    {!areaEmployees || areaEmployees.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No employees found in this area. Try a different area code or type.</p>
                      </div>
                    ) : (
                      <>
                        {/* Area Employees Table */}
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Employee
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
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
                              {areaEmployees && areaEmployees.map((employee) => (
                                <tr key={employee._id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                          <User className="h-6 w-6 text-blue-600" />
                                        </div>
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                          {employee.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {employee.email}
                                        </div>
                                        <div className="text-xs text-gray-400 font-mono">
                                          ID: {employee.employeeDetails?.employeeId || 'N/A'}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{employee.employeeDetails?.department || 'N/A'}</div>
                                    <div className="text-sm text-gray-500">{employee.employeeDetails?.designation || 'N/A'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 capitalize">{employee.role || 'N/A'}</div>
                                    <div className="text-sm text-gray-500 capitalize">{employee.employeeDetails?.employeeRole || 'N/A'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-1">
                                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${employee.isActive
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {employee.isActive ? 'Active' : 'Inactive'}
                                      </span>
                                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${employee.employeeDetails?.approvalStatus === 'approved'
                                          ? 'bg-blue-100 text-blue-800'
                                          : employee.employeeDetails?.approvalStatus === 'pending'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {employee.employeeDetails?.approvalStatus || 'Unknown'}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {employee.lastLogin 
                                      ? new Date(employee.lastLogin).toLocaleDateString()
                                      : 'Never'
                                    }
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex flex-wrap gap-2">
                                     
                                      <button className="text-emerald-600 hover:text-emerald-900 transition-colors">
                                        Edit
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setSelectedEmployee(employee);
                                          setAssignAreaForm(prev => ({
                                            ...prev,
                                            employeeId: employee._id
                                          }));
                                          setShowAssignAreaModal(true);
                                        }}
                                        className="text-purple-600 hover:text-purple-900 transition-colors flex items-center space-x-1"
                                      >
                                        <Users className="h-4 w-4" />
                                        <span>Assign Area</span>
                                      </button>

                                      {/* Approval Actions - Only show for pending employees */}
                                      {employee.employeeDetails?.approvalStatus === 'pending' && (
                                        <>
                                          <button
                                            onClick={() => handleOpenApprovalModal(employee, 'approve')}
                                            disabled={isSubmittingApproval}
                                            className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                                          >
                                            <UserCheck className="h-3 w-3" />
                                            <span>Approve</span>
                                          </button>
                                          <button
                                            onClick={() => handleOpenApprovalModal(employee, 'reject')}
                                            disabled={isSubmittingApproval}
                                            className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                                          >
                                            <X className="h-3 w-3" />
                                            <span>Reject</span>
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                  </div>

                        {/* Area Pagination */}
                        {areaPagination && areaPagination.totalPages > 1 && (
                          <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Showing {((areaPagination?.currentPage || 1) - 1) * (areaFilters.limit || 10) + 1} to{' '}
                              {Math.min((areaPagination?.currentPage || 1) * (areaFilters.limit || 10), areaPagination?.totalItems || 0)} of{' '}
                              {areaPagination?.totalItems || 0} employees in this area
                </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAreaPageChange((areaPagination?.currentPage || 1) - 1)}
                                disabled={!areaPagination?.hasPrevPage}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Previous
                              </button>
                              
                              {/* Page Numbers */}
                              {Array.from({ length: Math.min(5, areaPagination?.totalPages || 1) }, (_, i) => {
                                const pageNum = i + 1;
                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => handleAreaPageChange(pageNum)}
                                    className={`px-3 py-2 text-sm font-medium rounded-md ${(areaPagination?.currentPage || 1) === pageNum
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              })}
                              
                              <button
                                onClick={() => handleAreaPageChange((areaPagination?.currentPage || 1) + 1)}
                                disabled={!areaPagination?.hasNextPage}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
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


              {/* Employee List Section */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">All Employees</h3>
                  <button
                    onClick={refreshEmployees}
                    disabled={isLoadingEmployees}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                  </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={filters.department}
                      onChange={(e) => handleFilterChange({ department: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    >
                      <option value="all">All Departments</option>
                      <option value="operations">Operations</option>
                      <option value="marketing">Marketing</option>
                      <option value="sales">Sales</option>
                      <option value="hr">Human Resources</option>
                      <option value="it">Information Technology</option>
                      <option value="finance">Finance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange({ status: e.target.value as 'all' | 'active' | 'inactive' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Items per page
                    </label>
                    <select
                      value={filters.limit}
                      onChange={(e) => handleFilterChange({ limit: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                    </select>
                  </div>
                </div>

                {/* Loading State */}
                {isLoadingEmployees && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading employees...</p>
                  </div>
                )}

                {/* Error State */}
                {employeesError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>{employeesError}</span>
                    </div>
                  </div>
                )}

                {/* Approval Message */}
                {approvalMessage && (
                  <div className={`p-4 rounded-lg mb-4 ${approvalMessage.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>{approvalMessage.text}</span>
                    </div>
                  </div>
                )}

                {/* Employees List */}
                {!isLoadingEmployees && !employeesError && (
                  <>
                    {!employees || employees.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No employees found. Create your first employee to get started!</p>
                      </div>
                      ) : (
                        <>
                        {/* Employees Table */}
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Employee
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
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
                              {employees && employees.map((employee) => (
                                <tr key={employee._id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                          <User className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                          {employee.name}
                          </div>
                                        <div className="text-sm text-gray-500">
                                          {employee.email}
                                        </div>
                                        <div className="text-xs text-gray-400 font-mono">
                                          ID: {employee.employeeDetails?.employeeId || 'N/A'}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{employee.employeeDetails?.department || 'N/A'}</div>
                                    <div className="text-sm text-gray-500">{employee.employeeDetails?.designation || 'N/A'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 capitalize">{employee.role || 'N/A'}</div>
                                    <div className="text-sm text-gray-500 capitalize">{employee.employeeDetails?.employeeRole || 'N/A'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-1">
                                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${employee.isActive
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {employee.isActive ? 'Active' : 'Inactive'}
                            </span>
                                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${employee.employeeDetails?.approvalStatus === 'approved'
                                          ? 'bg-blue-100 text-blue-800'
                                          : employee.employeeDetails?.approvalStatus === 'pending'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {employee.employeeDetails?.approvalStatus || 'Unknown'}
                          </div>
                        </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {employee.lastLogin 
                                      ? new Date(employee.lastLogin).toLocaleDateString()
                                      : 'Never'
                                    }
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex flex-wrap gap-2">
                                      <button className="text-emerald-600 hover:text-emerald-900 transition-colors">
                                        View
                                      </button>
                                      <button className="text-blue-600 hover:text-blue-900 transition-colors">
                                        Edit
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setSelectedEmployee(employee);
                                          setAssignAreaForm(prev => ({
                                            ...prev,
                                            employeeId: employee._id
                                          }));
                                          setShowAssignAreaModal(true);
                                        }}
                                        className="text-purple-600 hover:text-purple-900 transition-colors flex items-center space-x-1"
                                      >
                                        <Users className="h-4 w-4" />
                                        <span>Assign Area</span>
                                      </button>

                                      {/* Approval Actions - Only show for pending employees */}
                                      {employee.employeeDetails?.approvalStatus === 'pending' && (
                                        <>
                                          <button
                                            onClick={() => handleOpenApprovalModal(employee, 'approve')}
                                            disabled={isSubmittingApproval}
                                            className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                                          >
                                            <UserCheck className="h-3 w-3" />
                                            <span>Approve</span>
                                          </button>
                                          <button
                                            onClick={() => handleOpenApprovalModal(employee, 'reject')}
                                            disabled={isSubmittingApproval}
                                            className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                                          >
                                            <X className="h-3 w-3" />
                                            <span>Reject</span>
                                          </button>
                                        </>
                                      )}
                      </div>
                                  </td>
                                </tr>
                    ))}
                            </tbody>
                          </table>
                  </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                          <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Showing {((pagination?.currentPage || 1) - 1) * (filters.limit || 10) + 1} to{' '}
                              {Math.min((pagination?.currentPage || 1) * (filters.limit || 10), pagination?.totalItems || 0)} of{' '}
                              {pagination?.totalItems || 0} employees
                </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handlePageChange((pagination?.currentPage || 1) - 1)}
                                disabled={!pagination?.hasPrevPage}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Previous
                              </button>
                              
                              {/* Page Numbers */}
                              {Array.from({ length: Math.min(5, pagination?.totalPages || 1) }, (_, i) => {
                                const pageNum = i + 1;
                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-3 py-2 text-sm font-medium rounded-md ${(pagination?.currentPage || 1) === pageNum
                                        ? 'bg-emerald-600 text-white'
                                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              })}
                              
                              <button
                                onClick={() => handlePageChange((pagination?.currentPage || 1) + 1)}
                                disabled={!pagination?.hasNextPage}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next
                              </button>
                </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}


          {activeTab === 'reports' && (
            <div className="space-y-8">
              {/* All Employees Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">All Employees</h2>
                    <p className="text-blue-100 mb-4">
                      View and manage all employees across the organization
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              {/* All Employees List Section */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Employee Directory</h3>
                  <button
                    onClick={refreshAllEmployees}
                    disabled={isLoadingAllEmployees}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Refresh</span>
                    </button>
                  </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={allEmployeesFilters.status}
                      onChange={(e) => setAllEmployeesFilters(prev => ({
                        ...prev,
                        status: e.target.value as 'all' | 'active' | 'inactive',
                        page: 1
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      value={allEmployeesFilters.department}
                      onChange={(e) => setAllEmployeesFilters(prev => ({
                        ...prev,
                        department: e.target.value,
                        page: 1
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Departments</option>
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                </div>

                {/* Loading State */}
                {isLoadingAllEmployees && (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading employees...</span>
                  </div>
                )}

                {/* Error State */}
                {allEmployeesError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                      <span className="text-red-700">{allEmployeesError}</span>
                    </div>
                  </div>
                )}

                {/* Employees Table */}
                {!isLoadingAllEmployees && !allEmployeesError && (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {allEmployees.map((employee) => (
                            <tr 
                              key={employee._id} 
                              className="hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => handleEmployeeClick(employee)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <span className="text-sm font-medium text-blue-600">
                                        {employee.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                    <div className="text-sm text-gray-500">
                                      ID: {employee.employeeDetails?.employeeId || 'N/A'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{employee.email}</div>
                                <div className="text-sm text-gray-500">
                                  {employee.isEmailVerified ? (
                                    <span className="text-green-600 flex items-center">
                                      <UserCheck className="h-3 w-3 mr-1" />
                                      Verified
                                    </span>
                                  ) : (
                                    <span className="text-red-600 flex items-center">
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      Unverified
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {employee.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {employee.employeeDetails?.department || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  employee.isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {employee.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {employee.lastLogin ? new Date(employee.lastLogin).toLocaleDateString() : 'Never'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
              </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-gray-700">
                        Showing {((allEmployeesPagination.currentPage - 1) * allEmployeesPagination.itemsPerPage) + 1} to{' '}
                        {Math.min(allEmployeesPagination.currentPage * allEmployeesPagination.itemsPerPage, allEmployeesPagination.totalItems)} of{' '}
                        {allEmployeesPagination.totalItems} results
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setAllEmployeesFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                          disabled={!allEmployeesPagination.hasPrevPage}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md">
                          {allEmployeesPagination.currentPage} of {allEmployeesPagination.totalPages}
                        </span>
                        <button
                          onClick={() => setAllEmployeesFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                          disabled={!allEmployeesPagination.hasNextPage}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Empty State */}
                {!isLoadingAllEmployees && !allEmployeesError && allEmployees.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                    <p className="text-gray-500">Try adjusting your filters or check back later.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="space-y-8">
              {/* Statistics Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Employee Statistics</h2>
                    <p className="text-purple-100 mb-4">
                      Comprehensive analytics and insights about your workforce
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {isLoadingStatistics && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <span className="ml-3 text-gray-600 text-lg">Loading statistics...</span>
                </div>
              )}

              {/* Error State */}
              {statisticsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
                    <span className="text-red-700 text-lg">{statisticsError}</span>
                  </div>
                </div>
              )}

              {/* Statistics Content */}
              {employeeStatistics && !isLoadingStatistics && !statisticsError && (
                <div className="space-y-8">
                  {/* Key Metrics Cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Employees</p>
                          <p className="text-3xl font-bold text-gray-900">{employeeStatistics.totalEmployees}</p>
                        </div>
                        <div className="bg-blue-100 rounded-full p-3">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Approved Employees</p>
                          <p className="text-3xl font-bold text-green-600">{employeeStatistics.approvedEmployees}</p>
                        </div>
                        <div className="bg-green-100 rounded-full p-3">
                          <UserCheck className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Pending Employees</p>
                          <p className="text-3xl font-bold text-orange-600">{employeeStatistics.pendingEmployees}</p>
                        </div>
                        <div className="bg-orange-100 rounded-full p-3">
                          <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Rejected Employees</p>
                          <p className="text-3xl font-bold text-red-600">{employeeStatistics.rejectedEmployees}</p>
                        </div>
                        <div className="bg-red-100 rounded-full p-3">
                          <X className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Department Distribution */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                      Department Distribution
                    </h3>
                    <div className="space-y-4">
                      {employeeStatistics.departmentDistribution?.length > 0 ? (
                        employeeStatistics.departmentDistribution.map((dept, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                              <span className="font-medium text-gray-900 capitalize">{dept._id}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-500 h-2 rounded-full" 
                                  style={{ width: `${(dept.count / employeeStatistics.totalEmployees) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold text-gray-600 w-8 text-right">{dept.count}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No department data available</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Approval Distribution */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-purple-600" />
                      Approval Distribution
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {employeeStatistics.approvalDistribution?.length > 0 ? (
                        employeeStatistics.approvalDistribution.map((status, index) => (
                          <div key={index} className="text-center">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                              status._id === 'approved' ? 'bg-green-100' : 
                              status._id === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
                            }`}>
                              <span className={`text-2xl font-bold ${
                                status._id === 'approved' ? 'text-green-600' : 
                                status._id === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                              }`}>
                                {status.count}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-600 capitalize">{status._id}</p>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8">
                          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No approval data available</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              {/* Pending Employees Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Pending Employees</h2>
                    <p className="text-orange-100 mb-4">
                      Review and approve/reject employee applications
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Pending Employees List Section */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
                  <button
                    onClick={refreshPendingEmployees}
                    disabled={isLoadingPendingEmployees}
                    className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                  </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={pendingFilters.department}
                      onChange={(e) => handlePendingFilterChange({ department: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    >
                      <option value="all">All Departments</option>
                      <option value="operations">Operations</option>
                      <option value="marketing">Marketing</option>
                      <option value="sales">Sales</option>
                      <option value="hr">Human Resources</option>
                      <option value="it">Information Technology</option>
                      <option value="finance">Finance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Items per page
                    </label>
                    <select
                      value={pendingFilters.limit}
                      onChange={(e) => handlePendingFilterChange({ limit: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium">
                      Total Pending: {pendingPagination.totalItems}
                    </div>
                  </div>
                </div>

                {/* Loading State */}
                {isLoadingPendingEmployees && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading pending employees...</p>
                  </div>
                )}

                {/* Error State */}
                {pendingEmployeesError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>{pendingEmployeesError}</span>
                    </div>
                  </div>
                )}

                {/* Approval Message */}
                {approvalMessage && (
                  <div className={`p-4 rounded-lg mb-4 ${
                    approvalMessage.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>{approvalMessage.text}</span>
                    </div>
                  </div>
                )}

                {/* Pending Employees List */}
                {!isLoadingPendingEmployees && !pendingEmployeesError && (
                  <>
                    {!pendingEmployees || pendingEmployees.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No pending employees found. All employees have been reviewed!</p>
                      </div>
                    ) : (
                      <>
                        {/* Pending Employees Table */}
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Employee
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Applied Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {pendingEmployees && pendingEmployees.map((employee) => (
                                <tr key={employee._id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                          <User className="h-6 w-6 text-orange-600" />
                                        </div>
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                          {employee.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {employee.email}
                                        </div>
                                        <div className="text-xs text-gray-400 font-mono">
                                          ID: {employee.employeeDetails?.employeeId || 'N/A'}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{employee.employeeDetails?.department || 'N/A'}</div>
                                    <div className="text-sm text-gray-500">{employee.employeeDetails?.designation || 'N/A'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 capitalize">{employee.role || 'N/A'}</div>
                                    <div className="text-sm text-gray-500 capitalize">{employee.employeeDetails?.employeeRole || 'N/A'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-1">
                                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        employee.isActive 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {employee.isActive ? 'Active' : 'Inactive'}
                                      </span>
                                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        employee.employeeDetails?.approvalStatus === 'pending' 
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {employee.employeeDetails?.approvalStatus || 'Unknown'}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {employee.createdAt 
                                      ? new Date(employee.createdAt).toLocaleDateString()
                                      : 'Unknown'
                                    }
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex flex-wrap gap-2">
                                      <button className="text-blue-600 hover:text-blue-900 transition-colors">
                                        View
                                      </button>
                                      <button className="text-emerald-600 hover:text-emerald-900 transition-colors">
                                        Edit
                                      </button>
                                      
                                      {/* Approval Actions */}
                                      <button
                                        onClick={() => handleOpenApprovalModal(employee, 'approve')}
                                        disabled={isSubmittingApproval}
                                        className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                                      >
                                        <UserCheck className="h-3 w-3" />
                                        <span>Approve</span>
                                      </button>
                                      <button
                                        onClick={() => handleOpenApprovalModal(employee, 'reject')}
                                        disabled={isSubmittingApproval}
                                        className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                                      >
                                        <X className="h-3 w-3" />
                                        <span>Reject</span>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination */}
                        {pendingPagination && pendingPagination.totalPages > 1 && (
                          <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Showing {((pendingPagination?.currentPage || 1) - 1) * (pendingFilters.limit || 10) + 1} to{' '}
                              {Math.min((pendingPagination?.currentPage || 1) * (pendingFilters.limit || 10), pendingPagination?.totalItems || 0)} of{' '}
                              {pendingPagination?.totalItems || 0} pending employees
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handlePendingPageChange((pendingPagination?.currentPage || 1) - 1)}
                                disabled={!pendingPagination?.hasPrevPage}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Previous
                              </button>
                              
                              {/* Page Numbers */}
                              {Array.from({ length: Math.min(5, pendingPagination?.totalPages || 1) }, (_, i) => {
                                const pageNum = i + 1;
                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => handlePendingPageChange(pageNum)}
                                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                                      (pendingPagination?.currentPage || 1) === pageNum
                                        ? 'bg-orange-600 text-white'
                                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              })}
                              
                              <button
                                onClick={() => handlePendingPageChange((pendingPagination?.currentPage || 1) + 1)}
                                disabled={!pendingPagination?.hasNextPage}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
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
                <div className={`p-4 rounded-lg ${createMessage.type === 'success'
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

      {/* Assign Area Modal */}
      {showAssignAreaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Users className="h-6 w-6 mr-2 text-emerald-600" />
                Assign Area to Employee
              </h2>
              <button
                onClick={() => {
                  setShowAssignAreaModal(false);
                  resetAssignAreaForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={areaAction === 'assign' ? handleAssignArea : handleRemoveArea} className="p-6 space-y-6">
              {/* Message Display */}
              {assignAreaMessage && (
                <div className={`p-4 rounded-lg ${assignAreaMessage.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {assignAreaMessage.text}
                </div>
              )}

              {/* Loading Indicator */}
              {isAssigningArea && (
                <div className="p-4 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span>Assigning area...</span>
                  </div>
                </div>
              )}

              {/* Assignment Form */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Area Assignment Details
                </h3>
                
                {/* Action Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Action</label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="areaAction"
                        value="assign"
                        checked={areaAction === 'assign'}
                        onChange={(e) => setAreaAction(e.target.value as 'assign' | 'remove')}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Assign Area</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="areaAction"
                        value="remove"
                        checked={areaAction === 'remove'}
                        onChange={(e) => setAreaAction(e.target.value as 'assign' | 'remove')}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Remove Area</span>
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {selectedEmployee ? 'Selected Employee' : 'Select Employee *'}
                    </label>
                    {selectedEmployee ? (
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-emerald-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-emerald-900">
                              {selectedEmployee.name} ({selectedEmployee.employeeDetails?.employeeId || 'N/A'})
                            </p>
                            <p className="text-xs text-emerald-700">
                              {selectedEmployee.email} - {selectedEmployee.employeeDetails?.department || 'N/A'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEmployee(null);
                              setAssignAreaForm(prev => ({
                                ...prev,
                                employeeId: ''
                              }));
                            }}
                            className="text-emerald-600 hover:text-emerald-800 transition-colors"
                            title="Change employee"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <select
                        value=""
                        onChange={(e) => {
                          const employeeId = e.target.value;
                          const employee = employees.find(emp => emp._id === employeeId);
                          if (employee) {
                            handleEmployeeSelection(employee);
                          }
                        }}
                        required
                        disabled={isLoadingEmployees}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {isLoadingEmployees ? 'Loading employees...' : 'Choose an employee'}
                        </option>
                        {employees && employees.length > 0 ? (
                          employees.map((employee) => {
                            console.log('Rendering employee option:', employee);
                            return (
                              <option key={employee._id} value={employee._id}>
                                {employee.name} ({employee.employeeDetails?.employeeId || 'N/A'}) - {employee.employeeDetails?.department || 'N/A'}
                              </option>
                            );
                          })
                        ) : (
                          !isLoadingEmployees && <option value="" disabled>No employees available</option>
                        )}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Area *
                    </label>
                    <select
                      value={selectedArea?.areaId || ''}
                      onChange={(e) => {
                        // For now, we'll use a simple area selection
                        // In a real app, you'd fetch areas from an API
                        const areaOptions = [
                          { areaId: 'DL_ND_003', areaName: 'New Delhi East', areaType: 'city', areaCode: ['MUM_001', '723145'] },
                          { areaId: 'DL_ND_001', areaName: 'New Delhi North', areaType: 'city', areaCode: ['MUM_002', '723146'] },
                          { areaId: 'DL_ND_002', areaName: 'New Delhi South', areaType: 'city', areaCode: ['MUM_003', '723147'] },
                          { areaId: 'DL_ND_004', areaName: 'New Delhi West', areaType: 'city', areaCode: ['MUM_004', '723148'] },
                          { areaId: 'DL_ND_005', areaName: 'New Delhi Central', areaType: 'city', areaCode: ['MUM_005', '723149'] }
                        ];
                        const area = areaOptions.find(ar => ar.areaId === e.target.value);
                        if (area) {
                          handleAreaSelection(area);
                          // Also update remove area form
                          setRemoveAreaForm(prev => ({
                            ...prev,
                            areaId: area.areaId
                          }));
                        }
                      }}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none bg-white"
                    >
                      <option value="">Choose an area</option>
                      <option value="DL_ND_003">New Delhi East (DL_ND_003)</option>
                      <option value="DL_ND_001">New Delhi North (DL_ND_001)</option>
                      <option value="DL_ND_002">New Delhi South (DL_ND_002)</option>
                      <option value="DL_ND_004">New Delhi West (DL_ND_004)</option>
                      <option value="DL_ND_005">New Delhi Central (DL_ND_005)</option>
                    </select>
                    {selectedArea && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Selected:</strong> {selectedArea.areaName} ({selectedArea.areaId})
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Type: {selectedArea.areaType} | Codes: {selectedArea.areaCode.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detailed fields only shown for assign action */}
                {areaAction === 'assign' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area Name *
                      </label>
                      <input
                        type="text"
                        name="areaName"
                        value={assignAreaForm.areaName}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                        placeholder="Area name will be auto-filled when you select an area"
                      />
                      <p className="text-xs text-gray-500 mt-1">This field is automatically filled when you select an area</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Area Type *
                        </label>
                        <input
                          type="text"
                          name="areaType"
                          value={assignAreaForm.areaType}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                          placeholder="Area type will be auto-filled when you select an area"
                        />
                        <p className="text-xs text-gray-500 mt-1">This field is automatically filled when you select an area</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Area Codes *
                        </label>
                        <input
                          type="text"
                          name="areaCode"
                          value={assignAreaForm.areaCode.join(', ')}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                          placeholder="Area codes will be auto-filled when you select an area"
                        />
                        <p className="text-xs text-gray-500 mt-1">This field is automatically filled when you select an area</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={assignAreaForm.notes}
                        onChange={handleAssignAreaInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                        placeholder="Enter additional notes about the area assignment (e.g., Covers East Delhi zone including Laxmi Nagar and Preet Vihar)"
                      />
                    </div>
                  </>
                )}

                {/* Remove area confirmation message */}
                {areaAction === 'remove' && selectedEmployee && selectedArea && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <X className="h-5 w-5 text-red-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Confirm Area Removal
                        </p>
                        <p className="text-sm text-red-600 mt-1">
                          Are you sure you want to remove area <strong>{selectedArea.areaName}</strong> from employee <strong>{selectedEmployee.name}</strong>?
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignAreaModal(false);
                    resetAssignAreaForm();
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={areaAction === 'assign' ? isAssigningArea : isRemovingArea}
                  className={`px-6 py-3 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 ${
                    areaAction === 'assign' 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {areaAction === 'assign' ? (
                    isAssigningArea ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Assigning...</span>
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4" />
                        <span>Assign Area</span>
                      </>
                    )
                  ) : (
                    isRemovingArea ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Removing...</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4" />
                        <span>Remove Area</span>
                      </>
                    )
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employees by Area Modal */}
      {showEmployeesByAreaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Users className="h-6 w-6 mr-2 text-purple-600" />
                Employees by Area
              </h2>
              <button
                onClick={closeEmployeesByAreaModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {isLoadingEmployeesByArea ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="text-lg text-gray-600">Loading employees...</span>
                  </div>
                </div>
              ) : employeesByAreaError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <X className="h-8 w-8 text-red-400" />
                  </div>
                  <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
                  <p className="text-red-600">{employeesByAreaError}</p>
                </div>
              ) : employeesByAreaData ? (
                <div className="space-y-6">
                  {/* Pagination Info */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Total Employees:</span>
                        <span className="ml-2 text-lg font-semibold text-gray-800">
                          {employeesByAreaData.data.pagination?.totalEmployees || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Page:</span>
                        <span className="ml-2 text-lg font-semibold text-gray-800">
                          {employeesByAreaData.data.pagination?.currentPage || 1} of {employeesByAreaData.data.pagination?.totalPages || 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Employees Table */}
                  {employeesByAreaData.data.employees && employeesByAreaData.data.employees.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Employee
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Department
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {employeesByAreaData.data.employees?.map((employee) => (
                              <tr key={employee._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                      <span className="text-sm font-medium text-purple-600">
                                        {employee.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                      <div className="text-sm text-gray-500">ID: {employee.employeeDetails?.employeeId || 'N/A'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{employee.email}</div>
                                  {employee.isEmailVerified && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                      Verified
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                    {employee.role}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                  {employee.employeeDetails?.department || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    employee.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {employee.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        No employees are assigned to this area.
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
              <button
                onClick={closeEmployeesByAreaModal}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Shield className="h-6 w-6 mr-2 text-emerald-600" />
                Employee Action
              </h2>
              <button
                onClick={handleCloseApprovalModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitApproval} className="p-6 space-y-6">
              {/* Message Display */}
              {approvalMessage && (
                <div className={`p-4 rounded-lg ${
                  approvalMessage.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>{approvalMessage.text}</span>
                  </div>
                </div>
              )}

              {/* Loading Indicator */}
              {isSubmittingApproval && (
                <div className="p-4 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span>{approvalType === 'approve' ? 'Approving employee...' : 'Rejecting employee...'}</span>
                  </div>
                </div>
              )}

              {/* Employee Information */}
              {selectedEmployeeForApproval && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Employee Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <p className="text-gray-900 font-medium">{selectedEmployeeForApproval.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900 font-medium">{selectedEmployeeForApproval.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                      <p className="text-gray-900 font-medium font-mono">{selectedEmployeeForApproval.employeeDetails?.employeeId || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <p className="text-gray-900 font-medium">{selectedEmployeeForApproval.employeeDetails?.department || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Action *
                </label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="approve-action"
                      name="approvalAction"
                      value="approve"
                      checked={approvalType === 'approve'}
                      onChange={(e) => setApprovalType(e.target.value as 'approve' | 'reject')}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label htmlFor="approve-action" className="ml-3 flex items-center">
                      <UserCheck className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Approve Employee</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="reject-action"
                      name="approvalAction"
                      value="reject"
                      checked={approvalType === 'reject'}
                      onChange={(e) => setApprovalType(e.target.value as 'approve' | 'reject')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <label htmlFor="reject-action" className="ml-3 flex items-center">
                      <X className="h-4 w-4 text-red-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Reject Employee</span>
                    </label>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select whether you want to approve or reject this employee.
                </p>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes *
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                  placeholder={`Enter your notes for ${approvalType === 'approve' ? 'approving' : 'rejecting'} this employee...`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Please provide detailed notes explaining your decision for {approvalType === 'approve' ? 'approving' : 'rejecting'} this employee.
                </p>
              </div>

              {/* Rejection Reason - Only show when reject is selected */}
              {approvalType === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                    placeholder="Enter the specific reason for rejecting this employee (e.g., Missing required documents and references)..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Please provide a specific reason for rejecting this employee. This will be included in the rejection notification.
                  </p>
                </div>
              )}

              {/* Request Body Preview */}
              <div className="bg-gray-100 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Request Body Preview:</h4>
                <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto">
{JSON.stringify({
  employeeId: selectedEmployeeForApproval?._id || '',
  action: approvalType,
  adminNotes: adminNotes || 'Your notes will appear here...',
  ...(approvalType === 'reject' && { rejectionReason: rejectionReason || 'Your rejection reason will appear here...' })
}, null, 2)}
                </pre>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseApprovalModal}
                  disabled={isSubmittingApproval}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingApproval || !adminNotes.trim() || (approvalType === 'reject' && !rejectionReason.trim())}
                  className={`px-6 py-3 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 ${
                    approvalType === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isSubmittingApproval ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{approvalType === 'approve' ? 'Approving...' : 'Rejecting...'}</span>
                    </>
                  ) : (
                    <>
                      {approvalType === 'approve' ? (
                        <>
                          <UserCheck className="h-4 w-4" />
                          <span>Approve Employee</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4" />
                          <span>Reject Employee</span>
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Details Modal */}
      {showEmployeeDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <User className="h-6 w-6 mr-2 text-blue-600" />
                Employee Details
              </h2>
              <button
                onClick={closeEmployeeDetailsModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Loading State */}
              {isLoadingEmployeeDetails && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading employee details...</span>
                </div>
              )}

              {/* Error State */}
              {employeeDetailsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <span className="text-red-700">{employeeDetailsError}</span>
                  </div>
                </div>
              )}

              {/* Employee Details */}
              {selectedEmployeeDetails && !isLoadingEmployeeDetails && !employeeDetailsError && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      Basic Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedEmployeeDetails.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedEmployeeDetails.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Employee ID</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedEmployeeDetails.employeeDetails?.employeeId || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Role</label>
                        <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                          {selectedEmployeeDetails.role}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          selectedEmployeeDetails.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedEmployeeDetails.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email Verification</label>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          selectedEmployeeDetails.isEmailVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedEmployeeDetails.isEmailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-blue-600" />
                      Professional Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Department</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedEmployeeDetails.employeeDetails?.department || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Designation</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedEmployeeDetails.employeeDetails?.designation || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Employee Role</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedEmployeeDetails.employeeDetails?.employeeRole || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Access Level</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedEmployeeDetails.employeeDetails?.accessLevel || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Approval Status</label>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          selectedEmployeeDetails.employeeDetails?.approvalStatus === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : selectedEmployeeDetails.employeeDetails?.approvalStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedEmployeeDetails.employeeDetails?.approvalStatus || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Reporting Manager</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedEmployeeDetails.employeeDetails?.reportingManager?.name || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-blue-600" />
                      Contact Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone Number</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedEmployeeDetails.phone || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone Verification</label>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          selectedEmployeeDetails.isPhoneVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedEmployeeDetails.isPhoneVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedEmployeeDetails.address ? 
                            `${selectedEmployeeDetails.address.street || ''}, ${selectedEmployeeDetails.address.city || ''}, ${selectedEmployeeDetails.address.state || ''}, ${selectedEmployeeDetails.address.pincode || ''}, ${selectedEmployeeDetails.address.country || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '') || 'N/A'
                            : 'N/A'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Activity Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      Activity Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Last Login</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedEmployeeDetails.lastLogin ? 
                            new Date(selectedEmployeeDetails.lastLogin).toLocaleString() : 'Never'
                          }
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Created At</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedEmployeeDetails.createdAt ? 
                            new Date(selectedEmployeeDetails.createdAt).toLocaleString() : 'N/A'
                          }
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Updated At</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedEmployeeDetails.updatedAt ? 
                            new Date(selectedEmployeeDetails.updatedAt).toLocaleString() : 'N/A'
                          }
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Login Attempts</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {(selectedEmployeeDetails as any).loginAttempts || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Approval Information */}
                  {selectedEmployeeDetails.employeeDetails?.approvedBy && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
                        Approval Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Approved By</label>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedEmployeeDetails.employeeDetails.approvedBy.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedEmployeeDetails.employeeDetails.approvedBy.email}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Approved At</label>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedEmployeeDetails.employeeDetails.approvedAt ? 
                              new Date(selectedEmployeeDetails.employeeDetails.approvedAt).toLocaleString() : 'N/A'
                            }
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Created By</label>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedEmployeeDetails.employeeDetails.createdBy.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedEmployeeDetails.employeeDetails.createdBy.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Assigned Areas */}
                  {selectedEmployeeDetails.employeeDetails?.assignedAreas && selectedEmployeeDetails.employeeDetails.assignedAreas.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                        Assigned Areas
                      </h3>
                      <div className="space-y-4">
                        {selectedEmployeeDetails.employeeDetails.assignedAreas.map((area, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{area.areaName}</h4>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                area.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {area.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Area ID:</span>
                                <span className="ml-2 font-medium">{area.areaId}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Area Code:</span>
                                <span className="ml-2 font-medium">{area.areaCode}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Type:</span>
                                <span className="ml-2 font-medium capitalize">{area.areaType}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Assigned At:</span>
                                <span className="ml-2 font-medium">
                                  {new Date(area.assignedAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="md:col-span-2">
                                <span className="text-gray-500">Assigned By:</span>
                                <span className="ml-2 font-medium">{area.assignedBy.name}</span>
                                <span className="ml-2 text-gray-600">({area.assignedBy.email})</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Permissions */}
                  {selectedEmployeeDetails.employeeDetails?.permissions && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-blue-600" />
                        Permissions
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmployeeDetails.employeeDetails.permissions.map((permission, index) => (
                          <span
                            key={index}
                            className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
              <button
                onClick={closeEmployeeDetailsModal}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperEmployeeDashboard;