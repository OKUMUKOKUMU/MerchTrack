export type Task = {
  id: string;
  title: string;
  description?: string;
  storeId: string;
  storeName: string;
  status: 'To Do' | 'In Progress' | 'Complete';
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
};

export type Activity = {
  id: string;
  storeId: string;
  store: string;
  reason: string;
  checkIn: string;
  checkOut?: string;
  notes: string;
  location: {
    lat: number;
    lng: number;
  };
  locationVerified: boolean;
  photoUrl?: string;
};

export type EmbeddedSalesReport = {
  productId: string;
  productName: string;
  quantitySold: number;
  stockLevel: number;
};

export type ActivityLog = {
  id: string;
  merchandiserId: string;
  storeId: string;
  storeName: string;
  activityType: string;
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
  notes: string;
  locationVerified: boolean;
  photoUrl: string;
  status: 'completed' | 'partial' | 'missed';
  salesReports?: EmbeddedSalesReport[];
};

export type ReportChartData = {
  name: string;
  value: number;
}[];

export type Store = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  description?: string;
};

export type SalesPerformance = {
    storeName: string;
    target: number;
    actual: number;
};

export type UserRole = 'merchandiser' | 'supervisor' | 'manager' | 'director' | 'admin';

export type Merchandiser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  employeeNumber: string;
  idNumber: string;
  role: UserRole;
};

export type AssignedStore = {
  id: string; // This is the storeId (document ID)
  expectedVisitFrequency?: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
};

export type ProductTarget = {
  id: string;
  productId: string;
  targetQuantity: number;
  period: 'daily' | 'weekly' | 'monthly';
};

export type SalesReport = {
  id: string;
  productId: string;
  quantitySold: number;
  stockLevel: number;
};

export type MarketEvent = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
};
