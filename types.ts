export type Property = {
  $id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  imageUrl: string;
  status: string;
  type: string;
  beds: number;
  baths: number;
  guests: number;
  landlordId: string;
  createdAt: string;
  updatedAt: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export type Tenant = {
  $id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string | null;
  status: 'Active' | 'Former';
  moveInDate?: string;
  moveOutDate?: string;
};

export type MaintenanceRequest = {
  $id: string;
  title: string;
  description: string;
  propertyId: string;
  tenantId: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  category: string;
  createdAt: string;
  updatedAt: string;
  completionDate?: string;
};

export type Payment = {
  $id: string;
  amount: number;
  propertyId: string;
  tenantId: string;
  status: 'Pending' | 'Completed';
  dueDate: string;
  paidDate?: string;
  createdAt: string;
};

export type Analytics = {
  totalProperties: number;
  occupiedProperties: number;
  totalRevenue: number;
  monthlyRevenue: Array<{
    month: string;
    amount: number;
    percentage: number;
  }>;
  occupancyRate: number;
  maintenanceRequests: number;
  averageRent: number;
  vacancyRate: number;
  propertyTypes: Array<{
    type: string;
    count: number;
  }>;
  maintenanceStats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    byCategory: Array<{
      category: string;
      count: number;
    }>;
  };
  revenueStats: {
    totalCollected: number;
    pending: number;
    overdue: number;
    byMonth: Array<{
      month: string;
      collected: number;
      pending: number;
    }>;
  };
}; 