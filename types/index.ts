export interface Property {
  $id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  image: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  dimensions?: {
    width: number;
    length: number;
    height: number;
  };
  features?: string[];
  status?: 'available' | 'occupied' | 'maintenance';
  createdAt?: string;
  updatedAt?: string;
}

export type Tenant = {
  $id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'Active' | 'Pending' | 'Former';
  propertyId?: string;
  rentAmount: number;
  moveInDate?: string;
  leaseStartDate?: string;
  leaseEndDate?: string;
  documents?: string[];
  createdAt: string;
  updatedAt: string;
};

export type MaintenanceRequest = {
  $id: string;
  tenantId: string;
  tenantName: string;
  tenantAvatar: string;
  propertyId: string;
  propertyName: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  category: 'Plumbing' | 'Electrical' | 'HVAC' | 'Appliance' | 'Other';
  images?: string[];
  estimatedCost?: number;
  actualCost?: number;
  assignedTo?: string;
  dateSubmitted: string;
  dateUpdated?: string;
  completionDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Payment = {
  $id: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  type: 'Rent' | 'Deposit' | 'Maintenance' | 'Other';
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Analytics = {
  totalProperties: number;
  occupiedProperties: number;
  totalRevenue: number;
  monthlyRevenue: {
    month: string;
    amount: number;
    percentage: number;
  }[];
  occupancyRate: number;
  maintenanceRequests: number;
  averageRent: number;
  vacancyRate: number;
  propertyTypes: {
    type: string;
    count: number;
  }[];
  maintenanceStats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    byCategory: {
      category: string;
      count: number;
    }[];
  };
  revenueStats: {
    totalCollected: number;
    pending: number;
    overdue: number;
    byMonth: {
      month: string;
      collected: number;
      pending: number;
    }[];
  };
}; 