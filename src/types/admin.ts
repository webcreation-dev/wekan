export type AdminView =
  | 'dashboard'
  | 'requests'
  | 'providers'
  | 'clients'
  | 'finance'
  | 'services'
  | 'admins'
  | 'settings'

export type RequestStatus = 'pending' | 'validated' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
export type ProviderStatus = 'active' | 'pending_verification' | 'suspended' | 'inactive'
export type TransactionType = 'deposit' | 'payment' | 'payout' | 'refund' | 'commission'
export type TransactionStatus = 'success' | 'pending' | 'failed' | 'refunded'
export type PaymentMethod = 'orange_money' | 'wave' | 'card' | 'cash'

export interface ServiceRequest {
  id: string; reference: string; clientName: string; clientPhone: string; clientAvatar: string;
  serviceType: string; serviceId: string; description: string; address: string; zone: string;
  scheduledDate: string; scheduledTime: string; status: RequestStatus;
  estimatedAmount: number; finalAmount?: number; depositPaid: number; depositMethod: string;
  assignedProviderId?: string; assignedProviderName?: string; assignedProviderAvatar?: string;
  createdAt: string; updatedAt: string; notes?: string;
}

export interface AdminProvider {
  id: string; name: string; phone: string; email?: string; avatar: string;
  specialities: string[]; zone: string; rating: number; reviewCount: number;
  completedJobs: number; activeJobs: number; totalEarnings: number; pendingPayout: number;
  status: ProviderStatus; verified: boolean; joinedAt: string; lastActive: string;
}

export interface AdminClient {
  id: string; firstName: string; lastName: string; phone: string; email?: string; avatar: string;
  address: string; zone: string; totalRequests: number; completedRequests: number;
  totalSpent: number; isPremium: boolean; joinedAt: string; lastActivity: string;
  status: 'active' | 'blocked';
}

export interface Transaction {
  id: string; reference: string; type: TransactionType; amount: number; method: PaymentMethod;
  status: TransactionStatus; clientName: string; providerName?: string;
  serviceType: string; requestId: string; createdAt: string; description: string;
}

export interface FinanceStats {
  totalRevenue: number; revenueGrowth: number; totalCommission: number; commissionGrowth: number;
  pendingPayouts: number; completedTransactions: number; failedTransactions: number; averageOrderValue: number;
}

export interface DashboardStats {
  totalRequests: number; requestsGrowth: number; pendingRequests: number; activeRequests: number;
  completedToday: number; totalProviders: number; activeProviders: number;
  totalClients: number; newClientsToday: number; revenueToday: number; revenueMonth: number;
  revenueGrowth: number; averageRating: number; satisfactionRate: number;
}

export interface RevenueDataPoint { date: string; revenue: number; commission: number; requests: number }
export interface ServiceDistribution {
  serviceId: string; serviceName: string; count: number; percentage: number; revenue: number; color: string;
}
