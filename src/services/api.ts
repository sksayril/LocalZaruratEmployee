import { User, UserRole, SignupData } from '../contexts/AuthContext';

const BASE_URL = 'http://localhost:3110';

// A helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// API call for user login
export const apiLogin = async (email: string, password: string, role: UserRole): Promise<User> => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, role }),
  });
  return handleResponse(response);
};

// API call for user signup
export const apiSignup = async (userData: SignupData, role: UserRole): Promise<User> => {
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...userData, role }),
  });
  return handleResponse(response);
};

// API call for super employee signup
export interface SuperEmployeeSignupData {
  name: string;
  email: string;
  password: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

// API response interface for super employee signup
export interface SuperEmployeeSignupResponse {
  success: boolean;
  message: string;
  data: {
    superEmployee: {
      _id: string;
      name: string;
      email: string;
      phone: string;
      address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
      };
      role: string;
      isActive: boolean;
      superEmployeeDetails: {
        employeeId: string;
        department: string;
        designation: string;
        approvalStatus: string;
        isActive: boolean;
      };
      createdAt: string;
    };
    token: string;
  };
}

export const apiSuperEmployeeSignup = async (userData: SuperEmployeeSignupData): Promise<SuperEmployeeSignupResponse> => {
  console.log('Making API call to:', `${BASE_URL}/api/auth/super-employee-signup`);
  console.log('Request payload:', userData);
  
  const response = await fetch(`${BASE_URL}/api/auth/super-employee-signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  console.log('API Response status:', response.status);
  
  return handleResponse(response);
};

// API call for super employee login
export interface SuperEmployeeLoginData {
  email: string;
  password: string;
}

export interface SuperEmployeeLoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      phone: string;
      address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
      };
      role: string;
      isActive: boolean;
      superEmployeeDetails?: {
        employeeId: string;
        department: string;
        designation: string;
        approvalStatus: string;
        isActive: boolean;
        areaPermissions: {
          canAssignAreas: boolean;
          canViewAllAreas: boolean;
          canManageAreaVendors: boolean;
          canManageAreaCustomers: boolean;
        };
        permissions: string[];
        accessLevel: string;
        lastLogin: string;
        assignedAreas: any[];
        approvedAt: string;
        approvedBy: string;
      };
      employeeDetails?: {
        areaPermissions: {
          canAssignAreas: boolean;
          canViewAllAreas: boolean;
          canManageAreaVendors: boolean;
          canManageAreaCustomers: boolean;
        };
        permissions: string[];
        accessLevel: string;
        approvalStatus: string;
        isActive: boolean;
        lastLogin: string;
        assignedAreas: any[];
      };
      adminDetails?: {
        permissions: string[];
        isSuperAdmin: boolean;
        accessLevel: string;
        lastLogin: string;
      };
      vendorDetails?: any;
      customerDetails?: any;
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
      profileImage: string | null;
      loginAttempts: number;
      lastLogin: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
      lockUntil: string | null;
    };
    token: string;
  };
}

export const apiSuperEmployeeLogin = async (loginData: SuperEmployeeLoginData): Promise<SuperEmployeeLoginResponse> => {
  console.log('Making API call to:', `${BASE_URL}/api/auth/login`);
  console.log('Request payload:', loginData);
  
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });
  
  console.log('API Response status:', response.status);
  
  const result = await handleResponse(response);
  console.log('API Response result:', result);
  
  return result;
};

// API call for creating employee by super employee
export interface CreateEmployeeData {
  name: string;
  email: string;
  password: string;
}

export interface CreateEmployeeResponse {
  success: boolean;
  message: string;
  data?: {
    employee: {
      _id: string;
      name: string;
      email: string;
      phone: string;
      employeeId: string;
      department: string;
      designation: string;
      employeeRole: string;
      reportingManager?: string;
      permissions: string[];
      accessLevel: string;
      isActive: boolean;
      createdAt: string;
    };
  };
}

export const apiCreateEmployee = async (employeeData: CreateEmployeeData, token: string): Promise<CreateEmployeeResponse> => {
  console.log('Making API call to:', `${BASE_URL}/api/auth/super-employee/create-employee`);
  console.log('Request payload:', employeeData);
  
  const response = await fetch(`${BASE_URL}/api/auth/super-employee/create-employee`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(employeeData),
  });
  
  console.log('API Response status:', response.status);
  
  const result = await handleResponse(response);
  console.log('API Response result:', result);
  
  return result;
};

// API call for fetching employees with pagination and filters
export interface Employee {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  profileImage?: string | null;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country: string;
  };
  employeeDetails?: {
    areaPermissions?: {
      canAssignAreas: boolean;
      canViewAllAreas: boolean;
      canManageAreaVendors: boolean;
      canManageAreaCustomers: boolean;
    };
    employeeId: string;
    department: string;
    designation: string;
    employeeRole?: string;
    reportingManager: {
      _id: string;
      email: string;
      role: string;
      name: string;
    };
    createdBy: {
      _id: string;
      email: string;
      name: string;
    };
    approvedBy?: {
      _id: string;
      email: string;
      name: string;
    };
    approvedAt?: string;
    permissions: string[];
    accessLevel: string;
    approvalStatus: string;
    assignedAreas: Array<{
      areaId: string;
      areaName: string;
      areaType: string;
      areaCode: string;
      assignedBy: {
        _id: string;
        name: string;
        email: string;
      };
      assignedAt: string;
      isActive: boolean;
    }>;
    lastLogin?: string;
    isActive?: boolean;
  };
  superEmployeeDetails?: {
    areaPermissions?: {
      canAssignAreas: boolean;
      canViewAllAreas: boolean;
      canManageAreaVendors: boolean;
      canManageAreaCustomers: boolean;
    };
    permissions: string[];
    accessLevel: string;
    approvalStatus: string;
    isActive: boolean;
    lastLogin: string;
    assignedAreas: any[];
  };
  adminDetails?: {
    permissions: string[];
    isSuperAdmin: boolean;
    accessLevel: string;
    lastLogin: string;
  };
  vendorDetails?: any;
  customerDetails?: any;
}

export interface GetEmployeesResponse {
  success: boolean;
  data: Employee[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  statistics: {
    statusDistribution: Array<{
      _id: string;
      count: number;
    }>;
    departmentDistribution: Array<{
      _id: string;
      count: number;
    }>;
  };
}

export interface GetEmployeesParams {
  page?: number;
  limit?: number;
  status?: 'all' | 'active' | 'inactive';
  department?: 'all' | string;
}

export const apiGetEmployees = async (params: GetEmployeesParams, token: string): Promise<GetEmployeesResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', (params.page || 1).toString());
  queryParams.append('limit', (params.limit || 10).toString());
  queryParams.append('status', params.status || 'all');
  queryParams.append('department', params.department || 'all');

  const url = `${BASE_URL}/api/auth/super-employee/my-employees?${queryParams.toString()}`;
  
  console.log('Making API call to:', url);
  console.log('Request params:', params);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  console.log('API Response status:', response.status);
  
  const result = await handleResponse(response);
  console.log('API Response result:', result);
  
  return result;
};

// API call for fetching employees by area
export interface GetEmployeesByAreaParams {
  areaType?: 'city' | 'state' | 'country';
  areaCode?: string;
  page?: number;
  limit?: number;
}

export interface GetEmployeesByAreaResponse {
  success: boolean;
  data: Employee[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  areaInfo: {
    areaType: string;
    areaCode: string;
    areaName: string;
  };
  statistics: {
    statusDistribution: Array<{
      _id: string;
      count: number;
    }>;
    departmentDistribution: Array<{
      _id: string;
      count: number;
    }>;
  };
}

export const apiGetEmployeesByArea = async (params: GetEmployeesByAreaParams, token: string): Promise<GetEmployeesByAreaResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('areaType', params.areaType || 'city');
  queryParams.append('areaCode', params.areaCode || '');
  queryParams.append('page', (params.page || 1).toString());
  queryParams.append('limit', (params.limit || 10).toString());

  const url = `${BASE_URL}/api/admin/super-employee/employees-by-area?${queryParams.toString()}`;
  
  console.log('Making API call to:', url);
  console.log('Request params:', params);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  console.log('API Response status:', response.status);
  
  const result = await handleResponse(response);
  console.log('API Response result:', result);
  
  return result;
};

// API call for assigning area to employee
export interface AssignAreaToEmployeeData {
  employeeId: string;
  areaId: string;
  areaName: string;
  areaType: 'city' | 'state' | 'country';
  areaCode: string[];
  notes: string;
}

export interface AssignAreaToEmployeeResponse {
  success: boolean;
  message: string;
  data?: {
    assignment: {
      _id: string;
      employeeId: string;
      areaId: string;
      areaName: string;
      areaType: string;
      areaCode: string[];
      notes: string;
      assignedAt: string;
      assignedBy: string;
    };
  };
}

export const apiAssignAreaToEmployee = async (data: AssignAreaToEmployeeData, token: string): Promise<AssignAreaToEmployeeResponse> => {
  const url = `${BASE_URL}/api/admin/super-employee/assign-area-to-employee`;
  
  console.log('Making API call to:', url);
  console.log('Request data:', data);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  console.log('API Response status:', response.status);
  
  const result = await handleResponse(response);
  console.log('API Response result:', result);
  
  return result;
};

// API call for removing area from employee
export interface RemoveAreaFromEmployeeData {
  employeeId: string;
  areaId: string;
}

export interface RemoveAreaFromEmployeeResponse {
  success: boolean;
  message: string;
  data?: {
    removedArea: {
      _id: string;
      employeeId: string;
      areaId: string;
      removedAt: string;
      removedBy: string;
    };
  };
}

export const apiRemoveAreaFromEmployee = async (data: RemoveAreaFromEmployeeData, token: string): Promise<RemoveAreaFromEmployeeResponse> => {
  const url = `${BASE_URL}/api/admin/super-employee/remove-area-from-employee`;
  
  console.log('Making API call to:', url);
  console.log('Request data:', data);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  console.log('API Response status:', response.status);
  
  const result = await handleResponse(response);
  console.log('API Response result:', result);
  
  return result;
};

// API call for getting employees by area with specific parameters
export interface GetEmployeesByAreaModalParams {
  areaType: string;
  areaCode: string;
  page: number;
  limit: number;
}

export interface GetEmployeesByAreaModalResponse {
  success: boolean;
  data: {
    employees: Employee[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalEmployees: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    areaInfo: {
      areaType: string;
      areaCode: string;
      areaName: string;
    };
  };
  message?: string;
}

export const apiGetEmployeesByAreaModal = async (params: GetEmployeesByAreaModalParams, token: string): Promise<GetEmployeesByAreaModalResponse> => {
  const queryParams = new URLSearchParams({
    areaType: params.areaType,
    areaCode: params.areaCode,
    page: params.page.toString(),
    limit: params.limit.toString()
  });
  
  const url = `${BASE_URL}/api/admin/super-employee/employees-by-area?${queryParams}`;
  
  console.log('Making API call to:', url);
  console.log('Request params:', params);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  console.log('API Response status:', response.status);
  
  const result = await handleResponse(response);
  console.log('API Response result:', result);
  
  return result;
};

// API call for approving employee
export interface ApproveEmployeeData {
  employeeId: string;
  action: 'approve' | 'reject';
  adminNotes: string;
  rejectionReason?: string;
}

export interface ApproveEmployeeResponse {
  success: boolean;
  message: string;
  data?: {
    employee: Employee;
  };
}

export const apiApproveEmployee = async (data: ApproveEmployeeData, token: string): Promise<ApproveEmployeeResponse> => {
  const url = `${BASE_URL}/api/admin/super-employee/approve-employee`;
  
  console.log('Making API call to:', url);
  console.log('Request data:', data);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  console.log('API Response status:', response.status);
  
  const result = await handleResponse(response);
  console.log('API Response result:', result);
  
  return result;
};

// API call for rejecting employee
export interface RejectEmployeeData {
  employeeId: string;
  action: 'approve' | 'reject';
  adminNotes: string;
  rejectionReason?: string;
}

export interface RejectEmployeeResponse {
  success: boolean;
  message: string;
  data?: {
    employee: Employee;
  };
}

export const apiRejectEmployee = async (data: RejectEmployeeData, token: string): Promise<RejectEmployeeResponse> => {
  const url = `${BASE_URL}/api/admin/super-employee/approve-employee`;
  
  console.log('Making API call to:', url);
  console.log('Request data:', data);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  console.log('API Response status:', response.status);
  
  const result = await handleResponse(response);
  console.log('API Response result:', result);
  
  return result;
};

// API call for fetching pending employees
export interface GetPendingEmployeesParams {
  page?: number;
  limit?: number;
  department?: 'all' | string;
}

export interface GetPendingEmployeesResponse {
  success: boolean;
  data: Employee[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  statistics: {
    statusDistribution: Array<{
      _id: string;
      count: number;
    }>;
    departmentDistribution: Array<{
      _id: string;
      count: number;
    }>;
  };
}

export const apiGetPendingEmployees = async (params: GetPendingEmployeesParams, token: string): Promise<GetPendingEmployeesResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', (params.page || 1).toString());
  queryParams.append('limit', (params.limit || 10).toString());
  queryParams.append('department', params.department || 'all');

  const url = `${BASE_URL}/api/admin/super-employee/pending-employees?${queryParams.toString()}`;
  
  console.log('Making API call to:', url);
  console.log('Request params:', params);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  console.log('API Response status:', response.status);
  
  const result = await handleResponse(response);
  console.log('API Response result:', result);
  
  return result;
};

// API call for fetching all employees (admin endpoint)
export interface GetAllEmployeesParams {
  page?: number;
  limit?: number;
  status?: 'all' | 'active' | 'inactive';
  department?: 'all' | string;
}

export interface GetAllEmployeesResponse {
  success: boolean;
  data: Employee[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  statistics: {
    statusDistribution: Array<{
      _id: string;
      count: number;
    }>;
    departmentDistribution: Array<{
      _id: string;
      count: number;
    }>;
  };
}

export const apiGetAllEmployees = async (params: GetAllEmployeesParams, token: string): Promise<GetAllEmployeesResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', (params.page || 1).toString());
  queryParams.append('limit', (params.limit || 10).toString());
  queryParams.append('status', params.status || 'all');
  queryParams.append('department', params.department || 'all');

  const url = `${BASE_URL}/api/admin/super-employee/employees?${queryParams.toString()}`;
  
  console.log('Making API call to:', url);
  console.log('Request params:', params);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  console.log('API Response status:', response.status);
  
  const result = await handleResponse(response);
  console.log('API Response result:', result);
  
  return result;
};

// API call for fetching individual employee details
export interface GetEmployeeDetailsResponse {
  success: boolean;
  data: Employee;
  message?: string;
}

export const apiGetEmployeeDetails = async (employeeId: string, token: string): Promise<GetEmployeeDetailsResponse> => {
  const url = `${BASE_URL}/api/admin/super-employee/employee/${employeeId}`;
  
  console.log('Making API call to:', url);
  console.log('Employee ID:', employeeId);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  console.log('API Response status:', response.status);
  
  const result = await handleResponse(response);
  console.log('API Response result:', result);
  
  return result;
};

// API call for fetching employee statistics
export interface EmployeeStatistics {
  totalEmployees: number;
  pendingEmployees: number;
  approvedEmployees: number;
  rejectedEmployees: number;
  departmentDistribution: Array<{
    _id: string;
    count: number;
  }>;
  approvalDistribution: Array<{
    _id: string;
    count: number;
  }>;
}

export interface GetEmployeeStatisticsResponse {
  success: boolean;
  data: EmployeeStatistics;
  message?: string;
}

export const apiGetEmployeeStatistics = async (token: string): Promise<GetEmployeeStatisticsResponse> => {
  const url = `${BASE_URL}/api/admin/super-employee/employee-statistics`;
  
  console.log('Making API call to:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  console.log('API Response status:', response.status);
  
  const result = await handleResponse(response);
  console.log('API Response result:', result);
  
  return result;
};
