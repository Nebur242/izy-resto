export interface StaffMember {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  active: boolean;
  permissions: string[]; // Array of allowed dashboard menu item IDs
  createdAt: string;
  updatedAt: string;
}

export interface StaffFormData {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'staff';
  permissions: string[];
}
