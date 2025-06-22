import { RoomFeature } from '../utils/roomPlanningUtils';
import React from 'react';

export interface Property {
  $id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  imageUrl: string;
  status: 'Available' | 'Occupied' | 'Maintenance';
  type: string;
  beds: number;
  baths: number;
  guests: number;
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
  features: RoomFeature[];
  landlordId: string;
  createdAt: string;
  updatedAt: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Tenant {
  $id: string;
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  status: 'Active' | 'Former' | 'Pending';
  moveInDate?: string;
  moveOutDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequest {
  $id: string;
  propertyId: string;
  tenantId: string;
  category: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dateSubmitted: string;
  dateUpdated: string;
  completionDate?: string;
}

export interface Payment {
  $id: string;
  propertyId: string;
  tenantId: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  type: 'Rent' | 'Deposit' | 'Maintenance';
  dueDate: string;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
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
}

// Default export to fix expo-router warning
export default function Types() {
  return null;
} 