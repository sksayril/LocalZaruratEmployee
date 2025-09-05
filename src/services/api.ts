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
