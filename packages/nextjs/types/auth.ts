// Auth context types
export type UserRole = 'user' | 'kurator' | 'admin' | 'agen';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  walletAddress?: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

// Route permissions
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/': ['user', 'kurator', 'admin', 'agen'],
  '/lending': ['user', 'kurator', 'admin', 'agen'],
  '/profile': ['user', 'kurator', 'admin', 'agen'],
  '/pengrajin': ['user', 'kurator', 'admin', 'agen'],
  '/kurator': ['kurator', 'admin'],
  '/agen': ['agen', 'admin'],
  '/admin': ['admin'],
  '/debug': ['admin'],
};

export const hasAccess = (userRole: UserRole | null, route: string): boolean => {
  if (!userRole) return route === '/';
  
  const allowedRoles = ROUTE_PERMISSIONS[route];
  if (!allowedRoles) return true; // Allow access to undefined routes
  
  return allowedRoles.includes(userRole);
};
