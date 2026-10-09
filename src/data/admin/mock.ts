import {
  ServiceRequest, AdminProvider, AdminClient,
  Transaction, DashboardStats, RevenueDataPoint, ServiceDistribution, FinanceStats
} from '@/types/admin'

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalRequests: 1284,
  requestsGrowth: 12.4,
  pendingRequests: 23,
  activeRequests: 47,
  completedToday: 18,
  totalProviders: 89,
  activeProviders: 62,
  totalClients: 3421,
  newClientsToday: 14,
  revenueToday: 485000,
  revenueMonth: 8_750_000,
  revenueGrowth: 18.2,
  averageRating: 4.7,
  satisfactionRate: 94.3,
}

export const MOCK_FINANCE_STATS: FinanceStats = {
  totalRevenue: 8_750_000,
  revenueGrowth: 18.2,
  totalCommission: 1_312_500,
  commissionGrowth: 21.0,
  pendingPayouts: 340_000,
  completedTransactions: 1142,
  failedTransactions: 28,
  averageOrderValue: 43_500,
}

// ─── Revenue Chart Data (last 14 days) ───────────────────────────────────────

export const MOCK_REVENUE_DATA: RevenueDataPoint[] = [
  { date: '10 Mar', revenue: 520000, commission: 78000, requests: 12 },
  { date: '11 Mar', revenue: 380000, commission: 57000, requests: 9 },
  { date: '12 Mar', revenue: 710000, commission: 106500, requests: 17 },
  { date: '13 Mar', revenue: 450000, commission: 67500, requests: 11 },
  { date: '14 Mar', revenue: 630000, commission: 94500, requests: 15 },
  { date: '15 Mar', revenue: 290000, commission: 43500, requests: 7 },
  { date: '16 Mar', revenue: 180000, commission: 27000, requests: 5 },
  { date: '17 Mar', revenue: 820000, commission: 123000, requests: 19 },
  { date: '18 Mar', revenue: 670000, commission: 100500, requests: 16 },
  { date: '19 Mar', revenue: 540000, commission: 81000, requests: 13 },
  { date: '20 Mar', revenue: 910000, commission: 136500, requests: 22 },
  { date: '21 Mar', revenue: 750000, commission: 112500, requests: 18 },
  { date: '22 Mar', revenue: 680000, commission: 102000, requests: 16 },
  { date: '23 Mar', revenue: 485000, commission: 72750, requests: 12 },
]

// ─── Service Distribution ─────────────────────────────────────────────────────

export const MOCK_SERVICE_DIST: ServiceDistribution[] = [
  { serviceId: 'plomberie',     serviceName: 'Plomberie',     count: 287, percentage: 22.3, revenue: 2_150_000, color: '#2d7ff9' },
  { serviceId: 'electricite',   serviceName: 'Électricité',   count: 241, percentage: 18.8, revenue: 1_980_000, color: '#6366f1' },
  { serviceId: 'nettoyage',     serviceName: 'Nettoyage',     count: 198, percentage: 15.4, revenue: 1_240_000, color: '#22c55e' },
  { serviceId: 'peinture',      serviceName: 'Peinture',      count: 156, percentage: 12.1, revenue: 1_780_000, color: '#f59e0b' },
  { serviceId: 'climatisation', serviceName: 'Climatisation', count: 134, percentage: 10.4, revenue: 1_120_000, color: '#06b6d4' },
  { serviceId: 'maconnerie',    serviceName: 'Maçonnerie',    count: 98,  percentage: 7.6,  revenue: 980_000,  color: '#f97316' },
  { serviceId: 'autres',        serviceName: 'Autres',        count: 170, percentage: 13.2, revenue: 1_500_000, color: '#94a3b8' },
]

// ─── Service Requests ─────────────────────────────────────────────────────────

export const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-001', reference: 'REQ-8821',
    clientName: 'Kofi Mensah', clientPhone: '+229 97 12 34 56',
    clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face',
    serviceType: 'Plomberie', serviceId: 'plomberie',
    description: 'Fuite importante sous l\'évier de cuisine, à réparer rapidement.',
    address: '12 Rue des Jardins, Akpakpa', zone: 'Akpakpa',
    scheduledDate: '23 Mar 2025', scheduledTime: '10:00',
    status: 'pending', estimatedAmount: 25000, depositPaid: 5000, depositMethod: 'Orange Money',
    createdAt: '2025-03-23T07:30:00', updatedAt: '2025-03-23T07:30:00',
  },
  {
    id: 'req-002', reference: 'REQ-8820',
    clientName: 'Ama Koffi', clientPhone: '+229 96 78 90 12',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
    serviceType: 'Électricité', serviceId: 'electricite',
    description: 'Tableau électrique à remplacer, disjoncteurs qui sautent fréquemment.',
    address: '45 Boulevard Saint-Michel, Cotonou', zone: 'Plateau',
    scheduledDate: '23 Mar 2025', scheduledTime: '14:00',
    status: 'assigned', estimatedAmount: 85000, depositPaid: 17000, depositMethod: 'Wave',
    assignedProviderId: 'prov-001', assignedProviderName: 'Marcus Johnson',
    assignedProviderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    createdAt: '2025-03-22T14:20:00', updatedAt: '2025-03-23T08:00:00',
  },
  {
    id: 'req-003', reference: 'REQ-8819',
    clientName: 'Yao Agbessi', clientPhone: '+229 95 45 67 89',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    serviceType: 'Nettoyage', serviceId: 'nettoyage',
    description: 'Nettoyage complet appartement 4 pièces après déménagement.',
    address: '78 Rue Commerce, Cadjehoun', zone: 'Cadjehoun',
    scheduledDate: '23 Mar 2025', scheduledTime: '09:00',
    status: 'in_progress', estimatedAmount: 35000, depositPaid: 7000, depositMethod: 'Orange Money',
    assignedProviderId: 'prov-003', assignedProviderName: 'Sophie Martin',
    assignedProviderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    createdAt: '2025-03-22T10:00:00', updatedAt: '2025-03-23T09:05:00',
  },
  {
    id: 'req-004', reference: 'REQ-8818',
    clientName: 'Fatou Diallo', clientPhone: '+229 94 23 45 67',
    clientAvatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&crop=face',
    serviceType: 'Peinture', serviceId: 'peinture',
    description: 'Peinture murale salon + chambres, surface 90m². Couleur au choix du client.',
    address: '34 Avenue Steinmetz, Cotonou', zone: 'Centre-ville',
    scheduledDate: '24 Mar 2025', scheduledTime: '08:00',
    status: 'validated', estimatedAmount: 135000, depositPaid: 27000, depositMethod: 'Card',
    createdAt: '2025-03-23T06:15:00', updatedAt: '2025-03-23T08:30:00',
  },
  {
    id: 'req-005', reference: 'REQ-8817',
    clientName: 'Jean-Baptiste Koudou', clientPhone: '+229 93 11 22 33',
    clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    serviceType: 'Climatisation', serviceId: 'climatisation',
    description: 'Installation d\'un split 18000 BTU dans bureau professionnel.',
    address: '120 Rue du Lac, Fidjrossè', zone: 'Fidjrossè',
    scheduledDate: '22 Mar 2025', scheduledTime: '11:00',
    status: 'completed', estimatedAmount: 85000, finalAmount: 92000, depositPaid: 17000, depositMethod: 'Orange Money',
    assignedProviderId: 'prov-002', assignedProviderName: 'Alex Johnson',
    assignedProviderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face',
    createdAt: '2025-03-21T09:00:00', updatedAt: '2025-03-22T15:30:00',
  },
  {
    id: 'req-006', reference: 'REQ-8816',
    clientName: 'Miriam Hounkpè', clientPhone: '+229 92 55 66 77',
    clientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face',
    serviceType: 'Maçonnerie', serviceId: 'maconnerie',
    description: 'Construction d\'un mur de clôture en parpaings, 15 mètres linéaires.',
    address: '56 Quartier Zogbo, Cotonou', zone: 'Zogbo',
    scheduledDate: '25 Mar 2025', scheduledTime: '07:30',
    status: 'pending', estimatedAmount: 180000, depositPaid: 36000, depositMethod: 'Wave',
    createdAt: '2025-03-23T05:45:00', updatedAt: '2025-03-23T05:45:00',
  },
  {
    id: 'req-007', reference: 'REQ-8815',
    clientName: 'Rodrigue Hountongnon', clientPhone: '+229 91 33 44 55',
    clientAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face',
    serviceType: 'Informatique', serviceId: 'informatique',
    description: 'PC portable ne démarre plus, récupération de données urgente.',
    address: '8 Rue des Flamboyants, Calavi', zone: 'Calavi',
    scheduledDate: '23 Mar 2025', scheduledTime: '15:30',
    status: 'pending', estimatedAmount: 25000, depositPaid: 5000, depositMethod: 'Orange Money',
    createdAt: '2025-03-23T08:00:00', updatedAt: '2025-03-23T08:00:00',
  },
  {
    id: 'req-008', reference: 'REQ-8814',
    clientName: 'Akossiwa Dossou', clientPhone: '+229 90 88 99 00',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
    serviceType: 'Menuiserie', serviceId: 'menuiserie',
    description: 'Pose de 3 portes intérieures + réparation armoire endommagée.',
    address: '23 Quartier Godomey, Abomey-Calavi', zone: 'Godomey',
    scheduledDate: '26 Mar 2025', scheduledTime: '08:00',
    status: 'disputed', estimatedAmount: 65000, depositPaid: 13000, depositMethod: 'Card',
    assignedProviderId: 'prov-004', assignedProviderName: 'Pierre Kossou',
    assignedProviderAvatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=80&h=80&fit=crop&crop=face',
    createdAt: '2025-03-20T11:30:00', updatedAt: '2025-03-22T16:00:00',
    notes: 'Client insatisfait de la qualité du travail. En attente de médiation.',
  },
]

// ─── Providers ────────────────────────────────────────────────────────────────

export const MOCK_ADMIN_PROVIDERS: AdminProvider[] = [
  {
    id: 'prov-001', name: 'Marcus Johnson', phone: '+229 97 00 11 22', email: 'marcus.j@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    specialities: ['Électricité'], zone: 'Cotonou / Plateau',
    rating: 4.9, reviewCount: 128, completedJobs: 143, activeJobs: 2,
    totalEarnings: 8_500_000, pendingPayout: 210_000, status: 'active', verified: true,
    joinedAt: '2024-01-15', lastActive: '2025-03-23',
  },
  {
    id: 'prov-002', name: 'Alex Johnson', phone: '+229 96 22 33 44', email: 'alex.j@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face',
    specialities: ['Plomberie', 'Climatisation'], zone: 'Cotonou / Fidjrossè',
    rating: 4.8, reviewCount: 97, completedJobs: 112, activeJobs: 1,
    totalEarnings: 6_200_000, pendingPayout: 85_000, status: 'active', verified: true,
    joinedAt: '2024-02-20', lastActive: '2025-03-22',
  },
  {
    id: 'prov-003', name: 'Sophie Martin', phone: '+229 95 44 55 66',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    specialities: ['Nettoyage'], zone: 'Cotonou / Akpakpa',
    rating: 4.7, reviewCount: 84, completedJobs: 96, activeJobs: 1,
    totalEarnings: 2_800_000, pendingPayout: 45_000, status: 'active', verified: true,
    joinedAt: '2024-03-10', lastActive: '2025-03-23',
  },
  {
    id: 'prov-004', name: 'Pierre Kossou', phone: '+229 94 66 77 88',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=80&h=80&fit=crop&crop=face',
    specialities: ['Menuiserie', 'Maçonnerie'], zone: 'Calavi / Godomey',
    rating: 3.8, reviewCount: 42, completedJobs: 51, activeJobs: 0,
    totalEarnings: 1_900_000, pendingPayout: 0, status: 'suspended', verified: true,
    joinedAt: '2024-05-01', lastActive: '2025-03-20',
  },
  {
    id: 'prov-005', name: 'Ibrahim Sow', phone: '+229 93 88 99 00',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face',
    specialities: ['Peinture'], zone: 'Cotonou Centre',
    rating: 4.6, reviewCount: 63, completedJobs: 71, activeJobs: 1,
    totalEarnings: 3_400_000, pendingPayout: 130_000, status: 'active', verified: true,
    joinedAt: '2024-04-15', lastActive: '2025-03-23',
  },
  {
    id: 'prov-006', name: 'Céleste Adjaï', phone: '+229 92 11 22 33',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face',
    specialities: ['Informatique'], zone: 'Cotonou / Calavi',
    rating: 0, reviewCount: 0, completedJobs: 0, activeJobs: 0,
    totalEarnings: 0, pendingPayout: 0, status: 'pending_verification', verified: false,
    joinedAt: '2025-03-22', lastActive: '2025-03-22',
  },
]

// ─── Clients ──────────────────────────────────────────────────────────────────

export const MOCK_ADMIN_CLIENTS: AdminClient[] = [
  {
    id: 'cli-001', firstName: 'Kofi', lastName: 'Mensah', phone: '+229 97 12 34 56', email: 'kofi.m@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face',
    address: '12 Rue des Jardins, Akpakpa', zone: 'Akpakpa',
    totalRequests: 12, completedRequests: 10, totalSpent: 485000, isPremium: true,
    joinedAt: '2024-06-10', lastActivity: '2025-03-23', status: 'active',
  },
  {
    id: 'cli-002', firstName: 'Ama', lastName: 'Koffi', phone: '+229 96 78 90 12',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
    address: '45 Boulevard Saint-Michel, Cotonou', zone: 'Plateau',
    totalRequests: 7, completedRequests: 6, totalSpent: 320000, isPremium: false,
    joinedAt: '2024-09-15', lastActivity: '2025-03-23', status: 'active',
  },
  {
    id: 'cli-003', firstName: 'Jean-Baptiste', lastName: 'Koudou', phone: '+229 93 11 22 33',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    address: '120 Rue du Lac, Fidjrossè', zone: 'Fidjrossè',
    totalRequests: 4, completedRequests: 4, totalSpent: 210000, isPremium: false,
    joinedAt: '2025-01-08', lastActivity: '2025-03-22', status: 'active',
  },
  {
    id: 'cli-004', firstName: 'Fatou', lastName: 'Diallo', phone: '+229 94 23 45 67',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&crop=face',
    address: '34 Avenue Steinmetz, Cotonou', zone: 'Centre-ville',
    totalRequests: 3, completedRequests: 2, totalSpent: 175000, isPremium: true,
    joinedAt: '2025-02-20', lastActivity: '2025-03-23', status: 'active',
  },
]

// ─── Transactions ─────────────────────────────────────────────────────────────

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-001', reference: 'TXN-20250323-001', type: 'deposit', amount: 5000,
    method: 'orange_money', status: 'success', clientName: 'Kofi Mensah',
    serviceType: 'Plomberie', requestId: 'req-001', createdAt: '2025-03-23T07:31:00',
    description: 'Acompte REQ-8821 – Plomberie',
  },
  {
    id: 'txn-002', reference: 'TXN-20250323-002', type: 'deposit', amount: 17000,
    method: 'wave', status: 'success', clientName: 'Ama Koffi',
    serviceType: 'Électricité', requestId: 'req-002', createdAt: '2025-03-22T14:25:00',
    description: 'Acompte REQ-8820 – Électricité',
  },
  {
    id: 'txn-003', reference: 'TXN-20250322-015', type: 'payment', amount: 75000,
    method: 'orange_money', status: 'success', clientName: 'Jean-Baptiste Koudou',
    providerName: 'Alex Johnson', serviceType: 'Climatisation', requestId: 'req-005',
    createdAt: '2025-03-22T15:35:00', description: 'Solde REQ-8817 – Climatisation',
  },
  {
    id: 'txn-004', reference: 'TXN-20250322-016', type: 'payout', amount: 78200,
    method: 'orange_money', status: 'success', clientName: 'Alex Johnson',
    providerName: 'Alex Johnson', serviceType: 'Climatisation', requestId: 'req-005',
    createdAt: '2025-03-22T16:00:00', description: 'Virement prestataire – REQ-8817',
  },
  {
    id: 'txn-005', reference: 'TXN-20250322-017', type: 'commission', amount: 13800,
    method: 'orange_money', status: 'success', clientName: 'HomeFix',
    serviceType: 'Climatisation', requestId: 'req-005',
    createdAt: '2025-03-22T16:00:00', description: 'Commission 15% – REQ-8817',
  },
  {
    id: 'txn-006', reference: 'TXN-20250321-008', type: 'refund', amount: 13000,
    method: 'card', status: 'pending', clientName: 'Akossiwa Dossou',
    serviceType: 'Menuiserie', requestId: 'req-008',
    createdAt: '2025-03-22T16:10:00', description: 'Remboursement acompte – REQ-8814 (litige)',
  },
  {
    id: 'txn-007', reference: 'TXN-20250323-003', type: 'deposit', amount: 36000,
    method: 'wave', status: 'success', clientName: 'Miriam Hounkpè',
    serviceType: 'Maçonnerie', requestId: 'req-006', createdAt: '2025-03-23T05:50:00',
    description: 'Acompte REQ-8816 – Maçonnerie',
  },
  {
    id: 'txn-008', reference: 'TXN-20250323-004', type: 'deposit', amount: 27000,
    method: 'card', status: 'success', clientName: 'Fatou Diallo',
    serviceType: 'Peinture', requestId: 'req-004', createdAt: '2025-03-23T06:20:00',
    description: 'Acompte REQ-8818 – Peinture',
  },
]
