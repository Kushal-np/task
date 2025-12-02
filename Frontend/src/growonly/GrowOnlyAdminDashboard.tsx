import React, { useState, useMemo, useEffect } from 'react';

// --- Type Definitions for Data Structures ---

interface User {
  id: string;
  name: string;
  role: 'Affiliate' | 'Client';
  package: string;
  balance: number;
  status: string;
  joinDate: string;
}

interface TaskDetail {
  total: number;
  completed: number;
  status: 'Approved' | 'In Review' | 'Pending' | 'N/A';
  link: string;
}

interface PlatformTasks {
  follow: TaskDetail;
  video: TaskDetail;
  post: TaskDetail;
}

interface TaskMonitoringEntry {
  userId: string;
  platforms: {
    facebook: PlatformTasks;
    youtube: PlatformTasks;
    instagram: PlatformTasks;
    twitter: PlatformTasks;
    tiktok: PlatformTasks;
  };
}

interface PrivateTaskPerformance {
  userId: string;
  totalClicks: number;
  facebookClicks: number;
  youtubeClicks: number;
  instagramClicks: number;
  twitterClicks: number;
  tiktokClicks: number;
  link: string;
}

interface QueueItem {
  id: string;
  userId: string;
  amount: number;
  date: string;
  package?: string;
  status: string;
}

interface TrendItem {
  month: string;
  revenue: number;
  users: number;
}

interface AdminData {
  totalRevenue: number;
  totalPayouts: number;
  totalLiability: number;
  affiliateCount: number;
}

interface DashboardData extends AdminData {
  allUsers: User[];
  privateTaskPerformance: PrivateTaskPerformance[];
  taskMonitoringData: TaskMonitoringEntry[];
  trends: TrendItem[];
}

interface UserWithTasks extends User {
  completionPercentage: number;
  taskData: TaskMonitoringEntry;
}

// --- Configuration & Data ---
const COLORS = {
  BG_DEEP_BLACK: '#121212',
  CARD_DARK: 'rgba(30, 30, 30, 0.85)',
  TEXT_WHITE: '#F3F4F6',
  GOLD_ACCENT_LIGHT: '#FFD700', // Royal Gold
  GOLD_ACCENT_DARK: '#B8860B', // Dark Goldenrod
  GREEN_SUCCESS: '#10B981',
  RED_ALERT: '#EF4444',
  BLUE_INFO: '#3B82F6',
  ORANGE_WARN: '#F59E0B',
};

// --- Mock Data ---
const ALL_USERS_DATA: User[] = [
  { id: 'AC32R7L', name: 'Alex Chen', role: 'Affiliate', package: 'SRK Prime', balance: 5200.50, status: 'Active', joinDate: '2025-01-15' },
  { id: 'DM18Y9P', name: 'David Martinez', role: 'Affiliate', package: 'SRK Gold', balance: 1200.00, status: 'Active', joinDate: '2025-03-22' },
  { id: 'EP40Q2K', name: 'Emily Peterson', role: 'Client', package: 'SRK Prime', balance: 0.00, status: 'Inactive', joinDate: '2024-11-01' },
  { id: 'SR11Z0G', name: 'Sara Ramirez', role: 'Affiliate', package: 'SRK Basic', balance: 450.75, status: 'Pending Verification', joinDate: '2025-10-29' },
  { id: 'JK55T6A', name: 'John Kim', role: 'Client', package: 'SRK Gold', balance: 0.00, status: 'Active', joinDate: '2025-05-10' },
  { id: 'LT66B8C', name: 'Lisa Taylor', role: 'Affiliate', package: 'SRK Elite', balance: 10500.20, status: 'Active', joinDate: '2024-12-05' },
];

const PRIVATE_TASK_PERFORMANCE_DATA: PrivateTaskPerformance[] = [
  { userId: 'AC32R7L', totalClicks: 2125, facebookClicks: 850, youtubeClicks: 400, instagramClicks: 500, twitterClicks: 200, tiktokClicks: 175, link: 'https://srk.link/alex_prime' },
  { userId: 'LT66B8C', totalClicks: 3560, facebookClicks: 1200, youtubeClicks: 900, instagramClicks: 800, twitterClicks: 400, tiktokClicks: 260, link: 'https://srk.link/lisa_elite' },
  { userId: 'DM18Y9P', totalClicks: 980, facebookClicks: 300, youtubeClicks: 250, instagramClicks: 150, twitterClicks: 180, tiktokClicks: 100, link: 'https://srk.link/david_gold' },
  { userId: 'SR11Z0G', totalClicks: 150, facebookClicks: 50, youtubeClicks: 30, instagramClicks: 20, twitterClicks: 40, tiktokClicks: 10, link: 'https://srk.link/sara_basic' },
];

const TASK_MONITORING_DATA: TaskMonitoringEntry[] = [
  {
    userId: 'AC32R7L',
    platforms: {
      facebook: { follow: { total: 1, completed: 1, status: 'Approved', link: 'facebook.com/alex-page' }, video: { total: 5, completed: 3, status: 'In Review', link: 'youtube.com/c/alex-channel' }, post: { total: 10, completed: 5, status: 'Pending', link: 'instagram.com/alex-gram' } },
      youtube: { follow: { total: 1, completed: 0, status: 'Pending', link: 'youtube.com/c/alex-channel' }, video: { total: 10, completed: 8, status: 'Approved', link: 'youtube.com/c/alex-channel' }, post: { total: 0, completed: 0, status: 'N/A', link: '' } },
      instagram: { follow: { total: 1, completed: 1, status: 'Approved', link: 'instagram.com/alex-gram' }, video: { total: 0, completed: 0, status: 'N/A', link: '' }, post: { total: 20, completed: 20, status: 'Approved', link: 'instagram.com/alex-gram' } },
      twitter: { follow: { total: 1, completed: 1, status: 'Approved', link: 'twitter.com/alex-tweet' }, video: { total: 0, completed: 0, status: 'N/A', link: '' }, post: { total: 15, completed: 15, status: 'Approved', link: 'twitter.com/alex-tweet' } },
      tiktok: { follow: { total: 1, completed: 0, status: 'Pending', link: 'tiktok.com/@alex-tok' }, video: { total: 15, completed: 12, status: 'In Review', link: 'tiktok.com/@alex-tok' }, post: { total: 0, completed: 0, status: 'N/A', link: '' } },
    },
  },
  {
    userId: 'DM18Y9P',
    platforms: {
      facebook: { follow: { total: 1, completed: 1, status: 'Approved', link: 'facebook.com/david-martinez' }, video: { total: 0, completed: 0, status: 'N/A', link: '' }, post: { total: 0, completed: 0, status: 'N/A', link: '' } },
      youtube: { follow: { total: 1, completed: 0, status: 'Pending', link: 'youtube.com/david-channel' }, video: { total: 0, completed: 0, status: 'N/A', link: '' }, post: { total: 0, completed: 0, status: 'N/A', link: '' } },
      instagram: { follow: { total: 1, completed: 0, status: 'Pending', link: 'instagram.com/david-gram' }, video: { total: 0, completed: 0, status: 'N/A', link: '' }, post: { total: 0, completed: 0, status: 'N/A', link: '' } },
      twitter: { follow: { total: 1, completed: 0, status: 'Pending', link: 'twitter.com/david-tweet' }, video: { total: 0, completed: 0, status: 'N/A', link: '' }, post: { total: 0, completed: 0, status: 'N/A', link: '' } },
      tiktok: { follow: { total: 1, completed: 0, status: 'Pending', link: 'tiktok.com/@david-tok' }, video: { total: 0, completed: 0, status: 'N/A', link: '' }, post: { total: 0, completed: 0, status: 'N/A', link: '' } },
    },
  },
];

const mockQueueData: {
  payoutQueue: QueueItem[];
  paymentVerificationQueue: QueueItem[];
  trends: TrendItem[];
} = {
  payoutQueue: [
    { id: 'P001', userId: 'LT66B8C', amount: 1500.00, date: '2025-10-28', status: 'Pending' },
    { id: 'P002', userId: 'AC32R7L', amount: 800.00, date: '2025-10-27', status: 'In Review' },
    { id: 'P003', userId: 'DM18Y9P', amount: 350.00, date: '2025-10-29', status: 'Pending' },
  ],
  paymentVerificationQueue: [
    { id: 'V001', userId: 'SR11Z0G', amount: 99.00, date: '2025-10-29', package: 'Basic', status: 'Pending' },
    { id: 'V002', userId: 'EP40Q2K', amount: 199.00, date: '2025-10-28', package: 'Prime', status: 'Pending' },
  ],
  trends: [
    { month: 'Jan', revenue: 100, users: 50 },
    { month: 'Feb', revenue: 120, users: 65 },
    { month: 'Mar', revenue: 150, users: 80 },
    { month: 'Apr', revenue: 180, users: 95 },
    { month: 'May', revenue: 210, users: 110 },
    { month: 'Jun', revenue: 250, users: 130 },
  ]
};

const mockAdminData: AdminData = {
  totalRevenue: 250000.00,
  totalPayouts: 185000.00,
  totalLiability: 65000.00,
  affiliateCount: ALL_USERS_DATA.filter(u => u.role === 'Affiliate').length,
};

// --- Helper Components & Icons ---
interface IconProps {
  d: string;
  className?: string;
  strokeWidth?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ d, className = 'w-5 h-5', strokeWidth = '2', style = { color: COLORS.GOLD_ACCENT_LIGHT } }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={style}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d={d} />
  </svg>
);

const icons = {
  dashboard: "M3 12L12 3l9 9H3zM12 5.69l-7 7V20h14v-7l-7-7z",
  global: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.9-7-7.93 0-.35.03-.68.08-1.01l4.06-4.06 1.01 1.01 4-4 1.01 1.01-4.06 4.06c.33.05.66.08 1.01.08 4.03 0 7.44 3.05 7.93 7h-7.93v7.93z",
  monitor: "M10 14l2-2-6-6-2 2 6 6zM15 15l-1 1 3 3 1-1-3-3zM3 17V3a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  users: "M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M12 14c-2.76 0-5 2.24-5 5v1h10v-1c0-2.76-2.24-5-5-5zM12 12a4 4 0 100-8 4 4 0 000 8z",
  create: "M12 4v16m8-8H4",
  queue: "M14 10h-4v4h4v-4zM21 3h-3V1h-2v2H8V1H6v2H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2zM21 19H3V9h18v10z",
  verify: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  trend: "M13 7h-2v8h2V7zm4-2h-2v10h2V5zM9 9H7v6h2V9zM20 18H4v2h16v-2z",
  link: "M10 6a2 2 0 012-2h5a2 2 0 012 2v5a2 2 0 01-2 2h-2M7 14v5a2 2 0 002 2h5a2 2 0 002-2v-2M9 9l5 5",
  clicks: "M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-16c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm-.5 6h-2v2h3v-2.5h-1v-1.5z",
  search: "M19 19l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  facebook: "M20 12c0-4.418-3.582-8-8-8S4 7.582 4 12c0 3.987 2.91 7.288 6.745 7.854V15h-2.5V12h2.5V9.5c0-2.215 1.343-3.41 3.313-3.41 0.944 0 1.763 0.07 1.996 0.1v2.32H15.8c-1.077 0-1.285 0.51-1.285 1.26V12h2.5L16 15h-2.5v4.854C17.09 19.288 20 15.987 20 12z",
  youtube: "M10 9l5 3-5 3V9zM20 5H4c-1.104 0-2 0.896-2 2v10c0 1.104 0.896 2 2 2h16c1.104 0 2-0.896-2-2V7c0-1.104-0.896-2-2-2z",
  instagram: "M12 7a5 5 0 100 10 5 5 0 000-10zM19 4H5c-1.1 0-2 0.9-2 2v12c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9-2-2V6c0-1.1-0.9-2-2-2zM17.5 8.5a1 1 0 11-2 0 1 1 0 012 0z",
  twitter: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5v-1a4.84 4.84 0 001.3-3.32z",
  tiktok: "M20 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V2M15 12a3 3 0 11-6 0 3 3 0 016 0zM11 7v14a1 1 0 01-1 1H7a1 1 0 01-1-1V7a1 1 0 011-1h3.75a.25.25 0 00.25-.25V3a1 1 0 011-1h3a1 1 0 011 1v.25a.25.25 0 00.25.25H18a1 1 0 011 1v4a1 1 0 01-1 1h-2v4z",
};

const navItems = [
  { id: 'global', label: 'Global Overview', icon: icons.global },
  { id: 'taskmonitoring', label: 'Task Monitoring', icon: icons.monitor },
  { id: 'privatetasks', label: 'Private Task Clicks', icon: icons.clicks },
  { id: 'userlist', label: 'All Users List', icon: icons.users },
  { id: 'affiliatelist', label: 'Affiliates Only', icon: icons.users },
  { id: 'createuser', label: 'Create User', icon: icons.create },
  { id: 'payoutqueue', label: 'Payout Queue', icon: icons.queue },
  { id: 'paymentverify', label: 'Payment Verification', icon: icons.verify },
  { id: 'trend', label: 'Performance Trends', icon: icons.trend },
];

const PLATFORMS: { id: keyof TaskMonitoringEntry['platforms']; label: string; icon: string; color: string }[] = [
  { id: 'facebook', label: 'Facebook', icon: icons.facebook, color: '#1877F2' },
  { id: 'youtube', label: 'YouTube', icon: icons.youtube, color: '#FF0000' },
  { id: 'instagram', label: 'Instagram', icon: icons.instagram, color: '#C13584' },
  { id: 'twitter', label: 'Twitter', icon: icons.twitter, color: '#1DA1F2' },
  { id: 'tiktok', label: 'TikTok', icon: icons.tiktok, color: '#69C9D0' },
];

const TASK_CATEGORIES: { id: keyof PlatformTasks; label: string; icon: string }[] = [
  { id: 'follow', label: 'Follow Task', icon: icons.users },
  { id: 'video', label: 'Video View', icon: icons.youtube },
  { id: 'post', label: 'Post/Content Share', icon: icons.instagram },
];

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div
    className={`bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 transition-shadow duration-300 hover:shadow-2xl ${className}`}
    style={{ background: COLORS.CARD_DARK, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)', color: COLORS.TEXT_WHITE }}
  >
    {children}
  </div>
);

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let colorClass;
  switch (status) {
    case 'Active':
    case 'Approved':
      colorClass = 'bg-green-600/20 text-green-400';
      break;
    case 'Inactive':
    case 'Rejected':
      colorClass = 'bg-red-600/20 text-red-400';
      break;
    case 'Pending':
    case 'In Review':
    case 'Pending Verification':
      colorClass = 'bg-yellow-600/20 text-yellow-400';
      break;
    case 'Package Timed Out':
      colorClass = 'bg-red-900/40 text-red-300 border border-red-600/50';
      break;
    default:
      colorClass = 'bg-zinc-600/20 text-zinc-400';
  }
  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
};

// --- View Components ---

interface GlobalOverviewViewProps {
  data: DashboardData;
}

const GlobalOverviewView: React.FC<GlobalOverviewViewProps> = ({ data }) => {
    // FIX: Safely determine the latest trend to avoid index access errors if data.trends is empty
    const latestTrend: TrendItem | undefined = data.trends.length > 0 ? data.trends[data.trends.length - 1] : undefined;

    // Helper to safely format the trend value
    const getTrendValue = (key: keyof TrendItem): string => {
        // Fallback if no trend data exists
        if (!latestTrend) return 'N/A';
        
        // Use optional chaining for safety if latestTrend was defined but the key was missing (though types prevent this)
        const value = latestTrend[key];

        if (typeof value === 'number') {
            // Simple logic for demonstration (assuming positive means up, otherwise flat/down)
            const symbol = value >= 0 ? '↑' : '↓';
            return `${Math.abs(value).toFixed(0)}% ${symbol}`;
        }
        return 'Stable'; // Default for non-numeric or unexpected values
    };

    const stats = [
        { label: 'Total Revenue', value: data.totalRevenue, icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m4-4h6m-6 0a1 1 0 100 2 1 1 0 000-2zm-2-7h6a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h4", color: COLORS.GREEN_SUCCESS, trend: getTrendValue('revenue') },
        { label: 'Total Liability', value: data.totalLiability, icon: "M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2a3 3 0 01-3-2c0-1.105 1.343-2 3-2zm0 0V3m0 3v2", color: COLORS.RED_ALERT, trend: 'Stable' },
        { label: 'Total Affiliates', value: data.affiliateCount, icon: "M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2", color: COLORS.BLUE_INFO, trend: getTrendValue('users') },
        { label: 'Payout Queue', value: mockQueueData.payoutQueue.length, icon: "M14 10h-4v4h4v-4zM21 3h-3V1h-2v2H8V1H6v2H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2z", color: COLORS.ORANGE_WARN, trend: '3 New' },
    ];

    return (
        <div className="p-4 sm:p-8 space-y-8">
            <h1 className="text-4xl font-extrabold text-white tracking-tight sm:tracking-widest border-b border-gold-600/30 pb-4">
                SRK Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold text-zinc-300">{stat.label}</p>
                            <Icon d={stat.icon} className="w-8 h-8" style={{ color: stat.color }} strokeWidth="1.5" />
                        </div>
                        <div className="mt-4">
                            <p className="text-4xl font-extrabold" style={{ color: COLORS.GOLD_ACCENT_LIGHT }}>
                                {stat.label.includes('Total') ? `$${stat.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : stat.value}
                            </p>
                            <div className="mt-2 text-sm font-medium flex items-center gap-1" style={{ color: stat.color }}>
                                {stat.trend} Last Month
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <PerformanceTrendView data={data} className="lg:col-span-full" />
        </div>
    );
};

// --- Task Monitoring View (Enhanced with Search) ---
interface TaskMonitoringViewProps {
    data: DashboardData;
}

const TaskMonitoringView: React.FC<TaskMonitoringViewProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  // FIX: Ensure safe initialization by checking for array presence
  const initialUserId = data.taskMonitoringData.length > 0 ? data.taskMonitoringData[0].userId : null;
  const [selectedUserId, setSelectedUserId] = useState<string | null>(initialUserId);
  const [activePlatform, setActivePlatform] = useState<keyof TaskMonitoringEntry['platforms']>(PLATFORMS[0].id);
  const [userStatuses, setUserStatuses] = useState<Record<string, string>>({});

  const usersWithTasks: UserWithTasks[] = useMemo(() => {
    return data.allUsers
      .filter(u => data.taskMonitoringData.some(t => t.userId === u.id))
      .map(user => {
        // Safe access to taskData is ensured by the filter above and casting
        const taskData = data.taskMonitoringData.find(t => t.userId === user.id) as TaskMonitoringEntry;
        
        const platforms = Object.values(taskData.platforms);
        
        let totalRequired = 0;
        let totalCompleted = 0;
        
        // Calculate totals dynamically using the keys of PlatformTasks
        platforms.forEach(p => {
            (Object.keys(p) as Array<keyof PlatformTasks>).forEach(taskKey => {
                totalRequired += p[taskKey].total;
                totalCompleted += p[taskKey].completed;
            });
        });

        const completionPercentage = totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;

        return {
          ...user,
          status: userStatuses[user.id] || user.status,
          completionPercentage,
          taskData,
        } as UserWithTasks;
      })
      .filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.completionPercentage - a.completionPercentage);
  }, [data.allUsers, data.taskMonitoringData, userStatuses, searchQuery]);

  // Set the first item in the filtered list as selected if the current one is filtered out
  useEffect(() => {
      if (!usersWithTasks.find(u => u.id === selectedUserId) && usersWithTasks.length > 0) {
          setSelectedUserId(usersWithTasks[0].id);
      } else if (usersWithTasks.length === 0) {
          setSelectedUserId(null);
      }
  }, [usersWithTasks, selectedUserId]);


  const currentUser = usersWithTasks.find(u => u.id === selectedUserId);
  // Optional chaining ensures safe access even if currentUser or taskData is null/undefined
  const platformTasks: PlatformTasks | undefined = currentUser?.taskData?.platforms[activePlatform];

  const handleTimeoutPackage = (): void => {
    if (!currentUser) return;

    // Custom modal/console log replacement for alert()
    // Using window.confirm as a temporary solution as requested in the instructions
    const isConfirmed = window.confirm(
      `Confirm TIMEOUT for ${currentUser.name} (${currentUser.id})? This will suspend earnings for 7 days.`
    );

    if (isConfirmed) {
      setUserStatuses(prev => ({
        ...prev,
        [currentUser.id]: 'Package Timed Out'
      }));
      console.log(`Package for ${currentUser.name} has been TIMED OUT.`);
    }
  };

  interface TaskDetailCardProps {
    categoryId: keyof PlatformTasks;
    categoryLabel: string;
    categoryIcon: string;
    tasks: TaskDetail;
  }

  const TaskDetailCard: React.FC<TaskDetailCardProps> = ({ categoryId, categoryLabel, categoryIcon, tasks }) => {
    const { total, completed, status, link } = tasks;
    const completePercent = total > 0 ? Math.round((completed / total) * 100) : (total === 0 ? 100 : 0);
    const platformConfig = PLATFORMS.find(p => p.id === activePlatform);
    const color = platformConfig?.color || COLORS.GOLD_ACCENT_LIGHT;
    const isNA = status === 'N/A';

    if (isNA) return null;

    const statusColor =
      status === 'Approved' ? COLORS.GREEN_SUCCESS :
      status === 'Pending' ? COLORS.RED_ALERT :
      status === 'In Review' ? COLORS.BLUE_INFO : COLORS.TEXT_WHITE;

    return (
      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon d={categoryIcon} className="w-6 h-6" style={{ color }} strokeWidth="2.5" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">{categoryLabel}</h3>
          </div>
          <span className="text-xl font-extrabold" style={{ color: COLORS.GOLD_ACCENT_LIGHT }}>{completePercent}%</span>
        </div>
        <div className="w-full bg-zinc-700 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completePercent}%`, backgroundColor: color }}
          />
        </div>
        <div className="flex justify-between items-center text-sm text-zinc-400">
          <span>{completed} / {total} Required Actions</span>
          <span className="font-semibold" style={{ color: statusColor }}>Status: {status}</span>
        </div>
        {link && (
          <div className="flex flex-col gap-2 mt-2 p-3 bg-white/5 rounded-lg border border-white/5">
            <div className="text-xs text-zinc-300 font-medium mb-1">Affiliate Proof Link:</div>
            <a
              href={`https://${link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 truncate hover:text-blue-300 transition-colors"
            >
              <Icon d={icons.link} className="w-4 h-4 inline mr-1" style={{ color: COLORS.BLUE_INFO }} />
              {link}
            </a>
            {(status === 'Pending' || status === 'In Review') && (
              <div className="flex gap-3 justify-end mt-3 border-t border-white/5 pt-3">
                <button
                  onClick={() => console.log(`Approved task: ${currentUser?.id} - ${activePlatform} - ${categoryId}`)}
                  className="px-3 py-1.5 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/40 transition-colors text-xs font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => console.log(`Rejected task: ${currentUser?.id} - ${activePlatform} - ${categoryId}`)}
                  className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-colors text-xs font-medium"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-white tracking-widest border-b border-gold-600/30 pb-4">
        Task Monitoring Console
      </h1>

      <Card className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Affiliate Selection</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-3 mb-4">
                <label htmlFor="search" className="block text-sm font-medium mb-1 text-zinc-300">Search by Name or ID</label>
                <div className="relative">
                    <input
                        id="search"
                        type="text"
                        placeholder="e.g., Alex Chen or AC32R7L"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2.5 pl-10 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-gold-500 focus:border-gold-500"
                    />
                    <Icon d={icons.search} className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" style={{color: COLORS.GOLD_ACCENT_DARK}}/>
                </div>
                {searchQuery && usersWithTasks.length === 0 && (
                    <p className="text-sm text-red-400 mt-2">No affiliates found matching "{searchQuery}".</p>
                )}
            </div>

            <div className="col-span-1 md:col-span-1">
                <label className="block text-sm font-medium mb-1 text-zinc-300">
                    Affiliate Account (Showing: {usersWithTasks.length})
                </label>
                <select
                    value={selectedUserId || ''}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-gold-500 focus:border-gold-500"
                    disabled={usersWithTasks.length === 0}
                >
                    {usersWithTasks.length > 0 ? (
                        usersWithTasks.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.id}) - {user.completionPercentage}%
                                {user.status === 'Package Timed Out' && ' [TIMED OUT]'}
                            </option>
                        ))
                    ) : (
                        <option value="">No users available</option>
                    )}
                </select>
            </div>

            {currentUser && (
                <div className="md:col-span-2 space-y-4">
                    <div className="flex justify-between items-center text-zinc-300">
                        <span className="text-sm font-medium">Overall Task Completion:</span>
                        <span className="text-xl font-extrabold" style={{ color: COLORS.GOLD_ACCENT_LIGHT }}>
                            {currentUser.completionPercentage}%
                        </span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-3.5">
                        <div
                            className="h-3.5 rounded-full transition-all duration-700 ease-out"
                            style={{
                                width: `${currentUser.completionPercentage}%`,
                                background: `linear-gradient(90deg, ${COLORS.GOLD_ACCENT_DARK}, ${COLORS.GOLD_ACCENT_LIGHT})`
                            }}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-2">
                        <p className="text-zinc-400">
                            Package: <span className="font-bold text-white">{currentUser.package}</span> |
                            Status: <StatusBadge status={currentUser.status} />
                        </p>

                        <button
                            onClick={handleTimeoutPackage}
                            className="px-5 py-2 bg-red-600/30 text-red-400 border border-red-600/50 rounded-lg hover:bg-red-600/50 transition-all font-medium text-sm flex items-center gap-2"
                            title="Temporarily suspend earning ability"
                        >
                            <Icon d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5" style={{ color: '#EF4444' }} />
                            Timeout Package
                        </button>
                    </div>
                </div>
            )}
        </div>
      </Card>

      {currentUser && (
        <>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4 border-b border-zinc-700 pb-2">
              Platform Details for {currentUser.name}
            </h2>

            <div className="flex flex-wrap gap-3 p-2 bg-zinc-900 rounded-xl shadow-inner">
              {PLATFORMS.map(platform => {
                const isActive = activePlatform === platform.id;
                return (
                  <button
                    key={platform.id}
                    onClick={() => setActivePlatform(platform.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                      isActive ? 'bg-white/10 shadow-lg border border-gold-400/30' : 'bg-transparent hover:bg-white/5 text-zinc-400'
                    }`}
                    style={{ color: isActive ? platform.color : COLORS.TEXT_WHITE }}
                  >
                    <Icon d={platform.icon} className="w-5 h-5" style={{ color: isActive ? platform.color : COLORS.TEXT_WHITE }} />
                    {platform.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TASK_CATEGORIES.map(category => {
                // Ensure platformTasks is defined and access its properties safely
                const tasks = platformTasks ? platformTasks[category.id] : { total: 0, completed: 0, status: 'N/A' as 'N/A', link: '' };

                return (
                    <TaskDetailCard
                    key={category.id}
                    categoryId={category.id}
                    categoryLabel={category.label}
                    categoryIcon={category.icon}
                    tasks={tasks}
                    />
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface PrivateTasksViewProps {
    data: DashboardData;
}

const PrivateTasksView: React.FC<PrivateTasksViewProps> = ({ data }) => (
  <div className="p-4 sm:p-8 space-y-6">
    <h1 className="text-3xl font-bold text-white tracking-widest">Private Task Clicks</h1>
    <p className="text-zinc-400">Detailed performance metrics for private affiliate links.</p>
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Clicks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Facebook</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">YouTube</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Instagram</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {data.privateTaskPerformance.map(task => (
              <tr key={task.userId} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{task.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gold-400 font-semibold">{task.totalClicks.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{task.facebookClicks}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{task.youtubeClicks}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{task.instagramClicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

interface UserListViewProps {
    data: DashboardData;
    filterRole?: 'Affiliate' | 'Client';
}

const UserListView: React.FC<UserListViewProps> = ({ data, filterRole }) => {
  const users = filterRole ? data.allUsers.filter(u => u.role === filterRole) : data.allUsers;

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-white tracking-widest">{filterRole ? `${filterRole} List` : 'All Users List'}</h1>
      <p className="text-zinc-400">A complete list of registered users on the platform.</p>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gold-400">{user.package}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">${user.balance.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={user.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const AffiliateListView: React.FC<UserListViewProps> = (props) => <UserListView {...props} filterRole="Affiliate" />;

const CreateUserView: React.FC = () => (
  <div className="p-4 sm:p-8 space-y-6">
    <h1 className="text-3xl font-bold text-white tracking-widest">Create New User</h1>
    <p className="text-zinc-400">Form to manually register a new client or affiliate.</p>
    <Card className="max-w-xl">
      <div className="space-y-5">
        <input className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-gold-500 focus:border-gold-500" placeholder="Full Name" />
        <input className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-gold-500 focus:border-gold-500" placeholder="Email Address" type="email" />
        <select className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-gold-500 focus:border-gold-500">
          <option className='bg-zinc-800'>Role: Client</option>
          <option className='bg-zinc-800'>Role: Affiliate</option>
        </select>
        <select className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-gold-500 focus:border-gold-500">
          <option className='bg-zinc-800'>Package: SRK Basic</option>
          <option className='bg-zinc-800'>Package: SRK Gold</option>
          <option className='bg-zinc-800'>Package: SRK Prime</option>
          <option className='bg-zinc-800'>Package: SRK Elite</option>
        </select>
        <button className="w-full py-3 rounded-lg font-bold text-black shadow-lg hover:shadow-gold-500/50 transition-all duration-300" style={{ background: COLORS.GOLD_ACCENT_LIGHT }}>
          Register User
        </button>
      </div>
    </Card>
  </div>
);

const PayoutQueueView: React.FC = () => (
  <div className="p-4 sm:p-8 space-y-6">
    <h1 className="text-3xl font-bold text-white tracking-widest">Payout Queue</h1>
    <p className="text-zinc-400">List of pending and in-review payout requests.</p>
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Request ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {mockQueueData.payoutQueue.map(p => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{p.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{p.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">${p.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{p.date}</td>
                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={p.status} /></td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-sm px-3 py-1 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/40 transition-colors">Process</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const PaymentVerificationView: React.FC = () => (
  <div className="p-4 sm:p-8 space-y-6">
    <h1 className="text-3xl font-bold text-white tracking-widest">Payment Verification</h1>
    <p className="text-zinc-400">Queue for verifying new package payments.</p>
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Verification ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Package</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {mockQueueData.paymentVerificationQueue.map(v => (
              <tr key={v.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{v.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{v.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gold-400">{v.package}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{v.date}</td>
                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={v.status} /></td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-sm px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 transition-colors">Review Doc</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

interface PerformanceTrendViewProps {
    data: DashboardData;
    className?: string;
}

const PerformanceTrendView: React.FC<PerformanceTrendViewProps> = ({ data, className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    <h1 className="text-3xl font-bold text-white tracking-widest">Performance Trends</h1>
    <p className="text-zinc-400">Monthly revenue and user growth trends.</p>
    <Card>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">Monthly Growth Visualization</h2>
        <div className="flex flex-col space-y-4">
          {data.trends.map((trend, index) => { // Using index here is acceptable as long as the array is stable
            const maxRevenue = Math.max(...data.trends.map(t => t.revenue));
            const revenueWidth = maxRevenue > 0 ? (trend.revenue / maxRevenue) * 100 : 0;

            const maxUsers = Math.max(...data.trends.map(t => t.users));
            const userWidth = maxUsers > 0 ? (trend.users / maxUsers) * 100 : 0;

            return (
              <div key={trend.month || index} className="flex items-start gap-4 flex-col sm:flex-row">
                <div className="w-16 text-right text-zinc-400 font-medium shrink">{trend.month}</div>
                <div className="grow space-y-1 w-full sm:w-auto">
                  <div className="flex justify-between text-xs text-green-400">
                      <span>Revenue: ${trend.revenue}K</span>
                      <span className="font-bold">{(revenueWidth).toFixed(0)}% of Max</span>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${revenueWidth}%`, backgroundColor: COLORS.GREEN_SUCCESS }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-blue-400 pt-2">
                      <span>Users: {trend.users}</span>
                      <span className="font-bold">{(userWidth).toFixed(0)}% of Max</span>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${userWidth}%`, backgroundColor: COLORS.BLUE_INFO }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-zinc-500 pt-4">Data scales dynamically based on the max value in the current trend set.</p>
      </div>
    </Card>
  </div>
);

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  navItems: typeof navItems;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, navItems }) => (
  <nav className="h-full w-full p-4 flex flex-col bg-zinc-900 border-r border-gold-600/20 shadow-2xl">
    <div className="shrink mb-8 p-2 border-b border-gold-600/30">
      <h2 className="text-3xl font-extrabold tracking-wider" style={{ color: COLORS.GOLD_ACCENT_LIGHT }}>SRK Admin</h2>
      <p className="text-xs text-zinc-500">Monitoring Console</p>
    </div>
    <ul className="space-y-2 grow">
      {navItems.map(item => (
        <li key={item.id}>
          <button
            onClick={() => setActiveView(item.id)}
            className={`w-full text-left flex items-center p-3 rounded-xl transition-all duration-200 font-medium ${
              activeView === item.id
                ? 'bg-gold-600/20 text-white shadow-lg border border-gold-400/30'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-gold-300'
            }`}
          >
            <Icon d={item.icon} className="w-5 h-5 mr-3" style={{ color: activeView === item.id ? COLORS.GOLD_ACCENT_LIGHT : 'currentColor' }} />
            {item.label}
          </button>
        </li>
      ))}
    </ul>
    <div className="mt-auto pt-4 border-t border-zinc-700/50">
      <p className="text-xs text-zinc-500">SRK Monitoring V1.0</p>
    </div>
  </nav>
);

// --- Main App Component ---
const data: DashboardData = {
    allUsers: ALL_USERS_DATA,
    privateTaskPerformance: PRIVATE_TASK_PERFORMANCE_DATA,
    taskMonitoringData: TASK_MONITORING_DATA,
    trends: mockQueueData.trends,
    ...mockAdminData
};

export default function App() {
  const [activeView, setActiveView] = useState<string>('global');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // FIX: Changed return type from JSX.Element to React.ReactNode for flexibility
  const renderView = (): React.ReactNode => {
    switch (activeView) {
      case 'global': return <GlobalOverviewView data={data} />;
      case 'taskmonitoring': return <TaskMonitoringView data={data} />;
      case 'privatetasks': return <PrivateTasksView data={data} />;
      case 'userlist': return <UserListView data={data} />;
      case 'affiliatelist': return <AffiliateListView data={data} />;
      case 'createuser': return <CreateUserView />;
      case 'payoutqueue': return <PayoutQueueView />;
      case 'paymentverify': return <PaymentVerificationView />;
      case 'trend': return <PerformanceTrendView data={data} />;
      default: return <GlobalOverviewView data={data} />;
    }
  };

  return (
    <div className="min-h-screen flex antialiased" style={{ backgroundColor: COLORS.BG_DEEP_BLACK }}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink">
        <Sidebar activeView={activeView} setActiveView={setActiveView} navItems={navItems} />
      </div>

      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-40 p-3 rounded-full bg-zinc-800 text-white shadow-xl transition-all hover:ring-2 ring-gold-500/50"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Icon d="M4 6h16M4 12h16M4 18h16" className="w-6 h-6" style={{ color: COLORS.GOLD_ACCENT_LIGHT }} />
      </button>

      {/* Mobile Sidebar Modal */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black opacity-70" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative w-64 h-full bg-zinc-900 transform transition-transform duration-300 ease-in-out">
            <Sidebar activeView={activeView} setActiveView={(id) => { setActiveView(id); setIsSidebarOpen(false); }} navItems={navItems} />
            <button
                className="absolute top-4 right-4 p-2 text-white bg-zinc-800 rounded-full hover:bg-zinc-700"
                onClick={() => setIsSidebarOpen(false)}
            >
                <Icon d="M6 18L18 6M6 6l12 12" className="w-6 h-6" style={{ color: COLORS.GOLD_ACCENT_LIGHT }}/>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="grow overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}