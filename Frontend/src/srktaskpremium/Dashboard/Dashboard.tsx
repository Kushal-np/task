import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldCheck, ListChecks, Users, Trophy, DollarSign, X, Menu, Youtube, Facebook, Instagram, Twitter, Wallet, Repeat2, CheckCircle, Clock, AlertCircle,  CoinsIcon } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  taskName: string;
  username: string;
}

interface Payout {
  id: number;
  userId: string;
  username: string;
  points: number;
  amount: number;
  method: string;
  requestedAt: string;
  status: 'Requested' | 'Paid' | 'Pending Review';
  paidAt?: string;
}

interface Verification {
  id: number;
  name: string;
  email: string;
  requestedAt: string;
  photoUrl: string;
}

interface TaskVerification {
    id: number;
    userId: string;
    username: string;
    taskName: string;
    points: number;
    submittedAt: string;
    proofUrl: string;
}

interface User {
  id: string;
  name: string;
  totalPoints: number;
  isVerified: boolean;
  joined: string;
}

interface LeaderboardUser extends User {
  rank: number;
}

interface CompletedTask {
  id: number;
  userId: string;
  username: string;
  points: number;
  completedAt: string;
}

interface TaskData {
  follow: {
    youtube: CompletedTask[];
    facebook: CompletedTask[];
    instagram: CompletedTask[];
    twitter: CompletedTask[];
  };
  video: {
    watch: CompletedTask[];
  };
}

interface NavLink {
    name: string;
    icon: React.ElementType; 
    content: React.ReactNode;
}

// --- Theme Constants (Based on Luxury Gold Theme) ---
const GOLD_PRIMARY = '#E1BA73'; // Light Gold
const GOLD_ACCENT = '#B68938'; // Dark Gold
const DARK_BG = '#0A0705'; // Deep Black/Brown
const TEXT_LIGHT = '#F5F5F5';
const CARD_BG = '#1A1715';

// --- CUSTOM HOOK FOR MEDIA QUERY ---
const useIsDesktop = (minWidth = 768): boolean => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(min-width: ${minWidth}px)`);
    
    const handler = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    setIsDesktop(mediaQuery.matches);

    mediaQuery.addEventListener('change', handler as EventListener);

    return () => {
      mediaQuery.removeEventListener('change', handler as EventListener);
    };
  }, [minWidth]);

  return isDesktop;
};
// --------------------------------------------------------------------------

// --- Dummy Data (Casting to defined types) ---

const initialPayouts: Payout[] = [
  { id: 501, userId: 'user_010', username: 'CoolAdmin', points: 1500, amount: 15.00, method: 'PayPal', requestedAt: '2024-11-23 14:00', status: 'Requested' },
  { id: 502, userId: 'user_001', username: 'CryptoGuru', points: 2000, amount: 20.00, method: 'Bank Transfer', requestedAt: '2024-11-24 09:30', status: 'Requested' },
  { id: 503, userId: 'user_005', username: 'JaneDoe_x', points: 1000, amount: 10.00, method: 'PayPal', requestedAt: '2024-11-20 18:00', paidAt: '2024-11-21 10:00', status: 'Paid' },
  { id: 504, userId: 'user_020', username: 'Art_Lover', points: 500, amount: 5.00, method: 'Crypto Wallet', requestedAt: '2024-11-19 12:00', paidAt: '2024-11-20 09:00', status: 'Paid' },
  { id: 505, userId: 'user_015', username: 'Traveler_88', points: 3000, amount: 30.00, method: 'Skrill', requestedAt: '2024-11-25 11:00', status: 'Pending Review' },
  { id: 506, userId: 'user_025', username: 'TechFanatic', points: 800, amount: 8.00, method: 'Payoneer', requestedAt: '2024-11-22 10:00', paidAt: '2024-11-22 15:30', status: 'Paid' },
];

const DUMMY_VERIFICATIONS: Verification[] = [
  { id: 101, name: 'Alex Johnson', email: 'alex@example.com', requestedAt: '2024-11-20', photoUrl: 'https://placehold.co/100x100/1A1715/E1BA73?text=AJ' },
  { id: 102, name: 'Sarah Lee', email: 'sarah.lee@web.net', requestedAt: '2024-11-20', photoUrl: 'https://placehold.co/100x100/1A1715/E1BA73?text=SL' },
  { id: 103, name: 'Michael Chen', email: 'mchen@work.com', requestedAt: '2024-11-21', photoUrl: 'https://placehold.co/100x100/1A1715/E1BA73?text=MC' },
  { id: 104, name: 'David Smith', email: 'dsmith@corp.io', requestedAt: '2024-11-22', photoUrl: 'https://placehold.co/100x100/1A1715/E1BA73?text=DS' },
];

const DUMMY_TASK_VERIFICATIONS: TaskVerification[] = [
    { 
        id: 901, 
        userId: 'user_030', 
        username: 'NewStreamer', 
        taskName: 'Submit 5-star rating on App Store', 
        points: 500, 
        submittedAt: '2024-11-26 10:00', 
        proofUrl: 'https://placehold.co/400x200/1A1715/E1BA73?text=App+Store+Screenshot'
    },
    { 
        id: 902, 
        userId: 'user_045', 
        username: 'DesignFan', 
        taskName: 'Share promotion on TikTok (Proof needed)', 
        points: 1200, 
        submittedAt: '2024-11-26 14:30', 
        proofUrl: 'https://placehold.co/400x200/1A1715/E1BA73?text=TikTok+Link+or+Screenshot'
    },
    { 
        id: 903, 
        userId: 'user_020', 
        username: 'Art_Lover', 
        taskName: 'Write a short blog post review', 
        points: 800, 
        submittedAt: '2024-11-27 09:15', 
        proofUrl: 'https://placehold.co/400x200/1A1715/E1BA73?text=Blog+Post+URL'
    },
];

const DUMMY_TASKS: TaskData = {
  follow: {
    youtube: [
      { id: 201, userId: 'user_001', username: 'CryptoGuru', points: 150, completedAt: '2024-11-25 10:30' },
      { id: 202, userId: 'user_005', username: 'JaneDoe_x', points: 150, completedAt: '2024-11-25 11:45' },
    ],
    facebook: [
      { id: 203, userId: 'user_010', username: 'CoolAdmin', points: 120, completedAt: '2024-11-25 12:01' },
    ],
    instagram: [
      { id: 204, userId: 'user_015', username: 'Traveler_88', points: 180, completedAt: '2024-11-25 14:22' },
      { id: 205, userId: 'user_020', username: 'Art_Lover', points: 180, completedAt: '2024-11-25 15:10' },
    ],
    twitter: [
      { id: 206, userId: 'user_025', username: 'TechFanatic', points: 100, completedAt: '2024-11-25 16:05' },
    ],
  },
  video: {
    watch: [
      { id: 301, userId: 'user_001', username: 'CryptoGuru', points: 50, completedAt: '2024-11-26 09:00' },
      { id: 302, userId: 'user_010', username: 'CoolAdmin', points: 50, completedAt: '2024-11-26 10:15' },
    ],
  },
};

const DUMMY_USERS: User[] = [
  { id: 'user_001', name: 'CryptoGuru', totalPoints: 12000, isVerified: true, joined: '2024-10-01' },
  { id: 'user_005', name: 'JaneDoe_x', totalPoints: 8500, isVerified: true, joined: '2024-10-15' },
  { id: 'user_010', name: 'CoolAdmin', totalPoints: 15000, isVerified: true, joined: '2024-09-20' },
  { id: 'user_015', name: 'Traveler_88', totalPoints: 4200, isVerified: false, joined: '2024-11-01' },
  { id: 'user_020', name: 'Art_Lover', totalPoints: 9100, isVerified: true, joined: '2024-10-10' },
  { id: 'user_025', name: 'TechFanatic', totalPoints: 6300, isVerified: false, joined: '2024-11-05' },
];

const DUMMY_LEADERBOARD: LeaderboardUser[] = DUMMY_USERS
  .sort((a, b) => b.totalPoints - a.totalPoints)
  .slice(0, 5)
  .map((user, index) => ({ ...user, rank: index + 1 }));

// --- UI Components ---

/**
 * Rejection Modal Component
 */
const RejectionModal: React.FC<RejectionModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  taskName, 
  username 
}) => {
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // NOTE: Per instructions, we MUST use a custom UI instead of alert()
  const [showError, setShowError] = useState(false);

  const handleSubmit = () => {
    if (!rejectionReason.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    
    setIsSubmitting(true);
    // Simulate API call delay
    setTimeout(() => {
      onConfirm(rejectionReason);
      setIsSubmitting(false);
      setRejectionReason('');
    }, 500);
  };

  const handleClose = () => {
    setRejectionReason('');
    setShowError(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative w-full max-w-md rounded-2xl border border-gray-700/50 shadow-2xl"
          style={{ 
            background: CARD_BG,
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-900/30">
                <AlertCircle className="text-red-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Reject Task Submission</h3>
                <p className="text-sm text-gray-400">Provide a reason for rejection</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Task:</p>
              <p className="font-medium text-white bg-gray-800/30 p-3 rounded-lg">{taskName}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Submitted by:</p>
              <p className="font-medium text-[#E1BA73] bg-gray-800/30 p-3 rounded-lg">{username}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                Rejection Reason *
                <span className="text-red-400 ml-1">(Required)</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => {
                    setRejectionReason(e.target.value);
                    if (e.target.value.trim()) setShowError(false);
                }}
                placeholder="Please provide a clear reason for rejecting this task submission. This will be shown to the user."
                className={`w-full h-32 p-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors resize-none ${
                    showError ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500' : 'border-gray-700 focus:border-[#E1BA73]/50 focus:ring-1 focus:ring-[#E1BA73]/30'
                }`}
              />
              {showError && (
                <p className="text-sm text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle size={16} /> Rejection reason is mandatory.
                </p>
              )}
              <p className="text-xs text-gray-500">
                The user will receive this feedback. Be specific and constructive.
              </p>
            </div>

            {/* Common rejection reasons (quick select) */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Quick select common reasons:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Incomplete proof",
                  "Proof doesn't match task requirements",
                  "Low quality submission",
                  "Violates community guidelines",
                  "Duplicate submission",
                  "Insufficient evidence"
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => {
                        setRejectionReason(reason);
                        setShowError(false);
                    }}
                    className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-700/50">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <motion.button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-red-700 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: !isSubmitting ? 1.02 : 1 }}
              whileTap={{ scale: !isSubmitting ? 0.98 : 1 }}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Processing...
                </>
              ) : (
                <>
                  <X size={16} />
                  Confirm Rejection
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


interface GoldButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Gold Button Component
 */
const GoldButton: React.FC<GoldButtonProps> = ({ children, onClick, disabled = false, className = '' }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    className={`w-full md:w-auto px-6 py-2.5 rounded-xl text-black font-extrabold text-sm uppercase tracking-[0.1em] transition-all duration-300 active:scale-95 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
    style={{
      background: `linear-gradient(45deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})`,
      boxShadow: `0_0_15px_rgba(225,186,115,0.2), 0_3px_10px_rgba(0,0,0,0.5)`
    }}
    whileHover={{
      scale: disabled ? 1 : 1.02,
      boxShadow: `0_0_25px_rgba(225,186,115,0.4), 0_3px_10px_rgba(0,0,0,0.5)`
    }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
  >
    {children}
  </motion.button>
);

interface NavItemProps {
  icon: React.ElementType;
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * Sidebar Navigation Item
 */
const NavItem: React.FC<NavItemProps> = ({ icon: Icon, name, isSelected, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`flex items-center gap-4 p-4 rounded-xl w-full text-left transition-all duration-300 font-semibold uppercase tracking-wider ${
      isSelected 
        ? 'bg-[#1A1715] text-[#E1BA73] shadow-inner border border-[#E1BA73]/30' 
        : 'text-gray-400 hover:bg-[#1A1715]/50 hover:text-white'
    }`}
    whileHover={{ x: isSelected ? 0 : 4 }}
  >
    <Icon size={24} className={isSelected ? 'text-[#E1BA73]' : 'text-gray-500'} />
    <span className="text-sm">{name}</span>
  </motion.button>
);

interface VerificationContentProps {
  data: Verification[];
}

/**
 * Verification Section Content
 */
const VerificationContent: React.FC<VerificationContentProps> = ({ data }) => {
  const handleApprove = (userId: number) => {
    console.log(`Approving user: ${userId}. Granting dashboard access.`);
  };

  if (data.length === 0) {
    return <div className="text-center p-10 text-gray-500">No pending verification requests.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((user) => (
        <div key={user.id} className="p-4 sm:p-6 rounded-xl border border-gray-700/50" style={{ background: CARD_BG }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-4">
            <img src={user.photoUrl} alt={user.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#E1BA73] flex-shrink-0" />
            <div className='min-w-0'>
              <h3 className="text-base sm:text-lg font-bold text-white truncate">{user.name}</h3>
              <p className="text-xs sm:text-sm text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-gray-400 mb-4 space-y-1">
            <p>Requested: <span className="text-white">{user.requestedAt}</span></p>
            <p>Credentials: <span className="text-green-400 cursor-pointer hover:underline">View Document (Dummy)</span></p>
          </div>
          <GoldButton onClick={() => handleApprove(user.id)} className="mt-2">
            Approve User
          </GoldButton>
        </div>
      ))}
    </div>
  );
};

interface TaskVerificationContentProps {
    initialData: TaskVerification[];
}

/**
 * Task Verification Section Content (UPDATED to include Rejection Modal)
 */
const TaskVerificationContent: React.FC<TaskVerificationContentProps> = ({ initialData }) => {
    const [pendingTasks, setPendingTasks] = useState<TaskVerification[]>(initialData);
    const [rejectionModal, setRejectionModal] = useState<{
        isOpen: boolean;
        taskId: number | null;
        taskName: string;
        username: string;
    }>({
        isOpen: false,
        taskId: null,
        taskName: '',
        username: ''
    });

    const handleVerify = (taskId: number, status: 'Approved' | 'Rejected') => {
        if (status === 'Approved') {
            console.log(`Task ID ${taskId} Approved. Points granted.`);
            setPendingTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        } else {
            // Open rejection modal instead of immediately rejecting
            const taskToReject = pendingTasks.find(task => task.id === taskId);
            if (taskToReject) {
                setRejectionModal({
                    isOpen: true,
                    taskId,
                    taskName: taskToReject.taskName,
                    username: taskToReject.username
                });
            }
        }
    };

    const handleConfirmRejection = (reason: string) => {
        if (rejectionModal.taskId) {
            console.log(`Task ID ${rejectionModal.taskId} Rejected. Reason: ${reason}`);
            setPendingTasks(prevTasks => prevTasks.filter(task => task.id !== rejectionModal.taskId));
            
            // Log rejection details (in real app, send to API)
            const rejectedTask = initialData.find(task => task.id === rejectionModal.taskId);
            if (rejectedTask) {
                console.log('Rejection Details:', {
                    taskId: rejectedTask.id,
                    userId: rejectedTask.userId,
                    username: rejectedTask.username,
                    taskName: rejectedTask.taskName,
                    points: rejectedTask.points,
                    rejectionReason: reason,
                    rejectedAt: new Date().toISOString()
                });
            }
        }
        
        // Close modal
        setRejectionModal({
            isOpen: false,
            taskId: null,
            taskName: '',
            username: ''
        });
    };

    const handleCloseRejectionModal = () => {
        setRejectionModal({
            isOpen: false,
            taskId: null,
            taskName: '',
            username: ''
        });
    };

    if (pendingTasks.length === 0) {
        return <div className="text-center p-10 text-gray-500">All task submissions have been verified.</div>;
    }

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white border-b border-[#E1BA73]/30 pb-2 flex items-center gap-2">
                    <Clock size={24} className="text-[#E1BA73]" /> Pending Task Reviews ({pendingTasks.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingTasks.map((task) => (
                        <div key={task.id} className="p-5 rounded-xl border border-gray-700/50 shadow-xl" style={{ background: CARD_BG }}>
                            
                            {/* Task Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{task.taskName}</h3>
                                    <p className="text-sm text-gray-400">
                                        Submitted by: <span className="font-semibold text-[#E1BA73]">{task.username}</span>
                                    </p>
                                </div>
                                <span className="text-xl font-extrabold flex items-center gap-1" style={{ color: GOLD_PRIMARY }}>
                                    <DollarSign size={18} /> {task.points}
                                </span>
                            </div>

                            {/* Details and Proof */}
                            <div className="text-xs text-gray-500 mb-4 space-y-2">
                                <p>Submission Time: <span className="text-white">{task.submittedAt}</span></p>
                                <a 
                                    href={task.proofUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-400 hover:text-blue-300 underline font-medium"
                                >
                                    View Submitted Proof (Link/Screenshot)
                                </a>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-4 mt-4">
                                <GoldButton 
                                    onClick={() => handleVerify(task.id, 'Approved')} 
                                    className="flex-1 px-4 py-2 text-sm uppercase"
                                >
                                    <CheckCircle size={16} className="inline mr-2" /> Approve
                                </GoldButton>
                                <motion.button 
                                    onClick={() => handleVerify(task.id, 'Rejected')} 
                                    className="flex-1 px-4 py-2 text-sm uppercase rounded-xl bg-red-800/50 text-red-400 font-bold hover:bg-red-800/70 transition-colors flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <X size={16} /> Reject
                                </motion.button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rejection Modal */}
            <RejectionModal
                isOpen={rejectionModal.isOpen}
                onClose={handleCloseRejectionModal}
                onConfirm={handleConfirmRejection}
                taskName={rejectionModal.taskName}
                username={rejectionModal.username}
            />
        </>
    );
};


interface PayoutRequestsContentProps {
  initialData: Payout[];
  onPayout: (id: number) => void;
}

/**
 * Payout Requests Section Content
 */
const PayoutRequestsContent: React.FC<PayoutRequestsContentProps> = ({ initialData, onPayout }) => {
  // Filter for requests that require action (Requested or Pending Review)
  const pendingRequests = useMemo<Payout[]>(() => 
    initialData.filter(p => p.status !== 'Paid')
  , [initialData]);

  if (pendingRequests.length === 0) {
    return <div className="text-center p-10 text-gray-500">No pending payout requests requiring action.</div>;
  }

  return (
    <div className="space-y-4">
      {pendingRequests.map((payout) => (
        <div key={payout.id} className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 rounded-xl border border-gray-700/50" style={{ background: CARD_BG }}>
          
          {/* User and Status Info */}
          <div className="flex-1 min-w-0 mb-3 lg:mb-0 space-y-1">
            <p className="text-white font-semibold text-lg truncate">{payout.username} ({payout.userId})</p>
            <p className="text-gray-400 text-sm">Requested on: <span className="text-white">{payout.requestedAt}</span></p>
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase ${payout.status === 'Requested' ? 'bg-yellow-600/20 text-yellow-400' : 'bg-blue-600/20 text-blue-400'}`}>
                {payout.status}
            </span>
          </div>

          {/* Amount and Method Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-8 w-full lg:w-auto">
            <div className="text-left">
              <p className="text-xl font-extrabold" style={{ color: GOLD_PRIMARY }}>
                ${payout.amount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">{payout.points.toLocaleString()} Points</p>
            </div>

            <div className="text-left">
              <p className="text-sm font-medium text-white">{payout.method}</p>
              <p className="text-xs text-gray-500">Payment Method</p>
            </div>

            {/* Payout Button */}
            <GoldButton onClick={() => onPayout(payout.id)} className="h-10 text-sm px-5 w-full sm:w-auto">
              Payout
            </GoldButton>
          </div>
        </div>
      ))}
    </div>
  );
};

interface TransactionsContentProps {
  initialData: Payout[];
  onPayout: (id: number) => void;
}

/**
 * Transactions Section Content
 */
const TransactionsContent: React.FC<TransactionsContentProps> = ({ initialData }) => {
  type TabType = 'Unpaid' | 'Paid' | 'All';
  const [activeTab, setActiveTab] = useState<TabType>('Unpaid');

  const filteredData = useMemo<Payout[]>(() => {
    switch (activeTab) {
      case 'Paid':
        return initialData.filter(p => p.status === 'Paid').sort((a, b) => new Date(b.paidAt!).getTime() - new Date(a.paidAt!).getTime());
      case 'Unpaid':
        return initialData.filter(p => p.status !== 'Paid').sort((a, b) => new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime());
      case 'All':
      default:
        return initialData.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
    }
  }, [initialData, activeTab]);



  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex gap-1 mb-8 p-1 rounded-xl border border-gray-700/50 w-full sm:w-fit" style={{ background: CARD_BG }}>
        {/* FIX: Explicitly cast array to match TabType union */}
        {(['Unpaid', 'Paid', 'All'] as TabType[]).map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold uppercase text-sm transition-colors ${activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-white'}`}
            style={activeTab === tab ? { background: `linear-gradient(45deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})` } : {}}
            whileHover={{ scale: 1.02 }}
          >
            {tab} {tab === 'Unpaid' && `(${initialData.filter(p => p.status !== 'Paid').length})`}
          </motion.button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((transaction) => (
            <div key={transaction.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-gray-700/50" style={{ background: CARD_BG }}>
              <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                <p className="text-white font-semibold text-base truncate">{transaction.username} ({transaction.userId})</p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {transaction.status === 'Paid' ? `Paid on: ${transaction.paidAt}` : `Requested on: ${transaction.requestedAt}`}
                </p>
                <p className="text-xs sm:text-sm mt-1 flex items-center gap-1 text-gray-500">
                    Method: <span className="text-white font-medium">{transaction.method}</span>
                </p>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                <div className="text-right">
                    <p className="text-lg font-extrabold" style={{ color: GOLD_PRIMARY }}>
                        ${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.points.toLocaleString()} Points</p>
                </div>
                



              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-10 text-gray-500">No transactions recorded for the "{activeTab}" category.</div>
        )}
      </div>
    </div>
  );
};

interface TaskDoneContentProps {}

/**
 * Task Done Section Content
 */
const TaskDoneContent: React.FC<TaskDoneContentProps> = () => {
  type TaskTabType = 'follow' | 'watch' | 'share';
  const [taskTab, setTaskTab] = useState<TaskTabType>('follow');
  const [socialTab, setSocialTab] = useState<'youtube' | 'facebook' | 'instagram' | 'twitter'>('youtube');

  const socialIcons: Record<string, React.ElementType> = {
    youtube: Youtube,
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
  };

  const currentTasks = useMemo<CompletedTask[]>(() => {
    if (taskTab === 'follow') {
      return DUMMY_TASKS.follow[socialTab] || [];
    }
    return DUMMY_TASKS.video.watch;
  }, [taskTab, socialTab]);

  interface SocialTabButtonProps {
      platform: 'youtube' | 'facebook' | 'instagram' | 'twitter';
  }

  const SocialTabButton: React.FC<SocialTabButtonProps> = ({ platform }) => {
    const Icon = socialIcons[platform];
    const isSelected = socialTab === platform;

    return (
      <motion.button
        onClick={() => setSocialTab(platform)}
        className={`p-2 sm:p-3 rounded-xl transition-all duration-300 border ${isSelected ? 'border-[#E1BA73] text-[#E1BA73] shadow-md shadow-[#E1BA73]/20' : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-white'}`}
        style={{ background: isSelected ? 'rgba(225, 186, 115, 0.1)' : CARD_BG }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon size={20} className="sm:size-6" />
      </motion.button>
    );
  };

  return (
    <div>
      {/* Primary Tab Switcher (Follow / Video) */}
      <div className="flex gap-3 mb-6 p-1 rounded-xl border border-gray-700/50 w-full sm:w-fit" style={{ background: CARD_BG }}>
        {/* FIX: Explicitly cast array to match TaskTabType union */}
        {(['follow', 'watch' , 'share'] as TaskTabType[]).map((tab) => (
          <motion.button 
            key={tab}
            onClick={() => { setTaskTab(tab); setSocialTab('youtube'); }}
            className={`flex-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold uppercase text-sm transition-colors ${taskTab === tab ? 'text-black' : 'text-gray-400 hover:text-white'}`}
            style={taskTab === tab ? { background: `linear-gradient(45deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})` } : {}}
            whileHover={{ scale: 1.05 }}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      {/* Secondary Tab Switcher (Social Media Icons for 'Follow') */}
      {taskTab === 'follow'  && (
        <div className="flex gap-3 sm:gap-4 mb-8 flex-wrap">
          {(Object.keys(DUMMY_TASKS.follow) as Array<keyof TaskData['follow']>).map(platform => (
            <SocialTabButton key={platform} platform={platform} />
          ))}
        </div>
      )}
            {taskTab === 'share'  && (
        <div className="flex gap-3 sm:gap-4 mb-8 flex-wrap">
          {(Object.keys(DUMMY_TASKS.follow) as Array<keyof TaskData['follow']>).map(platform => (
            <SocialTabButton key={platform} platform={platform} />
          ))}
        </div>
      )}

      {/* Task List */}
      <div className="space-y-4">
        {currentTasks.length > 0 ? (
          currentTasks.map((task) => (
            <div key={task.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-gray-700/50" style={{ background: CARD_BG }}>
              <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                <p className="text-white font-semibold text-base truncate">{task.username} ({task.userId})</p>
                <p className="text-gray-400 text-xs sm:text-sm">Completed: {task.completedAt}</p>
                <p className="text-xs sm:text-sm mt-1 flex items-center gap-1 text-green-400">
                    <ListChecks size={14} />
                    {taskTab === 'follow' ? `Followed on ${socialTab}` : `Watched video`}
                </p>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                {/* Point Count Button */}
                <button 
                  className="flex-1 sm:flex-none px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-1"
                  style={{ background: '#333', color: GOLD_PRIMARY }}
                >
                  <CoinsIcon size={14} />
                  {task.points}
                </button>
                

              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-10 text-gray-500">No tasks completed for this category yet.</div>
        )}
      </div>
    </div>
  );
};

interface AllUsersContentProps {
  data: User[];
}

/**
 * All Users Section Content
 */
const AllUsersContent: React.FC<AllUsersContentProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-700/50 shadow-lg">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-[#1A1715] uppercase text-xs tracking-wider text-gray-400 border-b border-gray-600">
            <th className="py-3 px-3 sm:px-4 text-left whitespace-nowrap">User ID</th>
            <th className="py-3 px-3 sm:px-4 text-left whitespace-nowrap">Username</th>
            <th className="py-3 px-3 sm:px-4 text-left whitespace-nowrap">Points</th>
            <th className="py-3 px-3 sm:px-4 text-left whitespace-nowrap">Joined</th>
            <th className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id} className="border-b border-gray-800 hover:bg-[#1A1715]/50 transition-colors text-sm">
              <td className="py-3 px-3 sm:px-4 text-gray-500 text-xs whitespace-nowrap">{user.id}</td>
              <td className="py-3 px-3 sm:px-4 font-medium text-white whitespace-nowrap">{user.name}</td>
              <td className="py-3 px-3 sm:px-4 font-bold text-[#E1BA73] whitespace-nowrap">{user.totalPoints.toLocaleString()}</td>
              <td className="py-3 px-3 sm:px-4 text-gray-500 text-xs whitespace-nowrap">{user.joined}</td>
              <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${user.isVerified ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                  {user.isVerified ? 'Verified' : 'Pending'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface LeaderboardContentProps {
  data: LeaderboardUser[];
}

/**
 * Leaderboard Section Content
 */
const LeaderboardContent: React.FC<LeaderboardContentProps> = ({ data }) => {
  // Use data for sorting, although the dummy data is already sorted and ranked
  const sortedData = useMemo<LeaderboardUser[]>(() => {
    return [...data].sort((a, b) => b.totalPoints - a.totalPoints).map((user, index) => ({ ...user, rank: index + 1 }));
  }, [data]);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white border-b border-[#E1BA73]/30 pb-2">Top Performers by Total Points</h2>
      {sortedData.map((user) => (
        <motion.div
          key={user.id}
          className="flex items-center p-4 rounded-xl shadow-lg border border-gray-700/50"
          style={{ background: CARD_BG }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: user.rank * 0.05 }}
        >
          {/* Rank Badge */}
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-extrabold text-sm sm:text-base mr-3 sm:mr-4 ${
            user.rank === 1 ? 'bg-[#FFD700] text-black shadow-[0_0_15px_#FFD700]' : 
            user.rank === 2 ? 'bg-[#C0C0C0] text-black' : 
            user.rank === 3 ? 'bg-[#CD7F32] text-black' : 
            'bg-gray-700 text-white'
          }`}>
            {user.rank}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-lg sm:text-xl font-bold text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-400">User ID: {user.id}</p>
          </div>

          <div className="text-right">
            <p className="text-xl sm:text-2xl font-extrabold" style={{ color: GOLD_PRIMARY }}>
              {user.totalPoints.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Total Points</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};


/**
 * Main Application Component
 */
const Dashboard: React.FC = () => {
  const isDesktop = useIsDesktop(); 
  const [selectedSection, setSelectedSection] = useState<string>('Payout Requests');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(isDesktop); 
  // Explicitly type the state holding the mutable data
  const [payoutsData, setPayoutsData] = useState<Payout[]>(initialPayouts); 

  // Update sidebar state when desktop view changes
  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  const handlePayout = (payoutId: number) => {
    // Simulate updating the status to 'Paid'
    setPayoutsData(prevData => prevData.map(payout => {
      if (payout.id === payoutId) {
        return {
          ...payout,
          status: 'Paid' as Payout['status'], // Explicitly cast string literal
          paidAt: new Date().toLocaleString('en-US', { hour12: false }),
        };
      }
      return payout;
    }));
    console.log(`Payout ID ${payoutId} marked as Paid.`);
  };


  const navLinks: NavLink[] = [
    { name: 'Verification', icon: ShieldCheck, content: <VerificationContent data={DUMMY_VERIFICATIONS} /> },
    { name: 'Payout Requests', icon: Wallet, content: <PayoutRequestsContent initialData={payoutsData} onPayout={handlePayout} /> }, 
    { name: 'Transactions', icon: Repeat2, content: <TransactionsContent initialData={payoutsData} onPayout={handlePayout} /> }, 
    { name: 'Task Done', icon: ListChecks, content: <TaskDoneContent /> },
    { name: 'Task Verification', icon: CheckCircle, content: <TaskVerificationContent initialData={DUMMY_TASK_VERIFICATIONS} /> }, 
    { name: 'All Users', icon: Users, content: <AllUsersContent data={DUMMY_USERS} /> },
    { name: 'Leaderboard', icon: Trophy, content: <LeaderboardContent data={DUMMY_LEADERBOARD} /> },
  ];

  const currentContent = navLinks.find(link => link.name === selectedSection)?.content;

  // Handler for the SRK Bank link (redirects externally)
  const handleSrkBankClick = () => {
    console.log("Redirecting to SRK Bank...");
    window.open('https://srk-bank-external-link.com', '_blank'); 
  };

  const Sidebar: React.FC = () => (
    <motion.div
      initial={false}
      animate={{ 
        width: isDesktop ? (isSidebarOpen ? 300 : 0) : (isSidebarOpen ? '100%' : 0),
        x: isDesktop ? 0 : (isSidebarOpen ? 0 : '-100%'),
      }}
      transition={{ duration: 0.3 }}
      className={`fixed ${isDesktop ? 'sticky top-0 h-screen' : 'inset-0'} flex-shrink-0 z-50 p-6 ${DARK_BG} border-r border-gray-700/50 shadow-2xl overflow-hidden`}
      style={{
        boxShadow: '8px 0 20px rgba(0,0,0,0.6)',
      }}
    >
      <div className="h-full flex flex-col space-y-8">
        {/* Logo and Close Button */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                 style={{ background: `linear-gradient(135deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})` }}>
              <Shield size={20} className="text-black" strokeWidth={3} />
            </div>
            <span className="font-extrabold text-white text-xl tracking-wider">
              ADMIN<span style={{ color: GOLD_PRIMARY }}>Task</span>
            </span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden text-white hover:text-[#E1BA73] p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-grow space-y-2 overflow-y-auto pr-2">
          {navLinks.map((link) => (
            <NavItem 
              key={link.name}
              icon={link.icon}
              name={link.name}
              isSelected={selectedSection === link.name}
              onClick={() => {
                setSelectedSection(link.name);
                if (!isDesktop) setIsSidebarOpen(false); 
              }}
            />
          ))}
        </div>

        {/* SRK Bank Link (at the bottom) */}
        <NavItem 
          icon={DollarSign}
          name="SRK Bank"
          isSelected={false}
          onClick={handleSrkBankClick}
        />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex antialiased" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: DARK_BG, color: TEXT_LIGHT }}>
      
      {/* Sidebar (Conditional rendering for AnimatePresence) */}
      <AnimatePresence>
        {isSidebarOpen && <Sidebar key="sidebar" />}
      </AnimatePresence>
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0`}>
        
        {/* Header/Mobile Menu Button */}
        <header className={`sticky top-0 p-4 md:px-8 flex items-center ${DARK_BG} z-30 border-b border-gray-700/50`} style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.7)' }}>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="md:hidden text-white hover:text-[#E1BA73] p-2 mr-4"
          >
            <Menu size={28} />
          </button>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wider truncate">
            {selectedSection} <span style={{ color: GOLD_PRIMARY }}>ADMIN</span>
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold">A</div>
          </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentContent}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;