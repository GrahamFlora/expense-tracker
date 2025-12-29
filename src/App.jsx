import React, { useState, useEffect, useMemo, useContext, createContext } from 'react';
import { 
  Home, 
  Plus, 
  Wallet, 
  Calendar, 
  X, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Settings,
  Moon,
  Sun,
  DollarSign,
  Edit2,
  ArrowDownCircle,
  PieChart,
  List,
  AlertTriangle
} from 'lucide-react';

/**
 * Violet Expense Tracker - Enhanced
 * Features: 
 * 1. Daily View: Date Grouping, High-visibility summary, "Load More" pagination.
 * 2. Summary View: Redesigned Budget tracking, Daily Average, Category breakdowns.
 * 3. Monthly View: High-level history of total expenses per month.
 * 4. Settings: Dynamic Currency & Dark Mode.
 */

// --- Constants ---

const CATEGORIES = [
  { id: 'food', name: 'Food & Drink', icon: '🍔', color: 'bg-orange-100 text-orange-600' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: 'bg-blue-100 text-blue-600' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'bg-pink-100 text-pink-600' },
  { id: 'car_loan', name: 'Car Loan', icon: '🚘', color: 'bg-indigo-100 text-indigo-600' },
  { id: 'bills', name: 'Bills', icon: '💡', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'personal', name: 'Personal', icon: '👤', color: 'bg-purple-100 text-purple-600' },
  { id: 'entertainment', name: 'Fun', icon: '🎬', color: 'bg-rose-100 text-rose-600' },
  { id: 'health', name: 'Health', icon: '❤️', color: 'bg-red-100 text-red-600' },
  { id: 'education', name: 'Education', icon: '📚', color: 'bg-sky-100 text-sky-600' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: 'bg-teal-100 text-teal-600' },
  { id: 'pets', name: 'Pets', icon: '🐾', color: 'bg-stone-100 text-stone-600' },
  { id: 'other', name: 'Other', icon: '📦', color: 'bg-gray-100 text-gray-600' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'PHP', symbol: '₱' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'INR', symbol: '₹' },
];

// --- Contexts ---

const AppContext = createContext();

const useAppContext = () => useContext(AppContext);

// --- Components ---

const Card = ({ children, className = "" }) => {
  const { isDark } = useAppContext();
  return (
    <div className={`rounded-2xl shadow-sm border p-5 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} ${className}`}>
      {children}
    </div>
  );
};

const Button = ({ children, onClick, variant = 'primary', className = "", type = "button" }) => {
  const baseStyle = "px-6 py-4 rounded-xl font-bold text-base transition-all active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-violet-600 text-white shadow-lg shadow-violet-200 hover:bg-violet-700",
    secondary: "bg-violet-50 text-violet-700 hover:bg-violet-100",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-100",
    ghost: "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
  };
  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { isDark } = useAppContext();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-fade-in-up ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex items-center gap-3 mb-4 text-rose-500">
           <AlertTriangle size={28} strokeWidth={2.5} />
           <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        </div>
        <p className={`text-sm mb-8 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{message}</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className={`flex-1 ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100'}`}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} className="flex-1 shadow-none">Yes, Reset</Button>
        </div>
      </div>
    </div>
  );
};


// --- Views ---

const DailyView = ({ transactions, currentDate, navigateMonth, onAddClick, onToggleStatus, onEdit }) => {
  const { formatCurrency, isDark } = useAppContext();
  const [visibleDays, setVisibleDays] = useState(7); // PAGINATION: Start by showing 7 dates

  // Reset pagination when month changes
  useEffect(() => {
    setVisibleDays(7);
  }, [currentDate]);

  // Filter for current month
  const monthlyTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
  }, [transactions, currentDate]);

  // Group by Date
  const groupedTransactions = useMemo(() => {
    const groups = {};
    monthlyTransactions.forEach(t => {
      if (!groups[t.date]) groups[t.date] = [];
      groups[t.date].push(t);
    });
    // Sort dates descending (newest first)
    return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [monthlyTransactions]);

  // Summary Math
  const summary = useMemo(() => {
    const total = monthlyTransactions.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const paid = monthlyTransactions.filter(t => t.status === 'completed').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const balance = total - paid;
    return { total, paid, balance };
  }, [monthlyTransactions]);

  // PAGINATION: Slice the groups
  const visibleGroups = groupedTransactions.slice(0, visibleDays);

  return (
    <div className="space-y-6 pb-32 animate-fade-in">
      {/* Month Navigator */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={() => navigateMonth(-1)} className={`p-3 rounded-2xl shadow-sm hover:text-violet-600 transition-all ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-400'}`}>
          <ChevronLeft size={24} />
        </button>
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => navigateMonth(1)} className={`p-3 rounded-2xl shadow-sm hover:text-violet-600 transition-all ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-400'}`}>
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Main Summary Card */}
      <div className="rounded-2xl p-5 shadow-xl bg-violet-600 text-white shadow-violet-500/30">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-violet-200 text-sm font-bold mb-1 uppercase tracking-wide">Total Expenses</p>
            <h1 className="text-5xl font-extrabold tracking-tight">{formatCurrency(summary.total)}</h1>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
             <Wallet className="text-white" size={28} />
          </div>
        </div>
        
        <div className="flex gap-4 pt-4 border-t border-white/20">
          <div className="flex-1">
            <p className="text-violet-200 text-xs font-bold uppercase mb-1">Paid</p>
            <p className="text-2xl font-bold">{formatCurrency(summary.paid)}</p>
          </div>
          <div className="w-px bg-white/20 my-1"></div>
          <div className="flex-1">
            <p className="text-violet-200 text-xs font-bold uppercase mb-1">Pending</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(summary.balance)}</p>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <Button onClick={onAddClick} className="w-full shadow-xl text-lg">
        <Plus size={24} strokeWidth={3} />
        Add Amount
      </Button>

      {/* Transactions List */}
      <div className="space-y-6">
        {groupedTransactions.length === 0 ? (
          <div className={`text-center py-10 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>No transactions for this month</div>
        ) : (
          <>
            {visibleGroups.map(([date, items]) => (
              <div key={date}>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
                <div className="space-y-3">
                  {items.map(t => (
                    <div 
                      key={t.id}
                      onClick={() => onEdit(t)}
                      className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between active:scale-[0.98] transition-transform ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} ${t.status === 'completed' ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Status Toggle */}
                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleStatus(t.id); }}
                          className={`h-12 w-12 rounded-xl flex items-center justify-center border-2 transition-colors ${
                            t.status === 'completed' 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : (isDark ? 'border-gray-600 bg-gray-700 text-gray-500' : 'border-gray-100 bg-gray-50 text-gray-300')
                          }`}
                        >
                          <Check size={20} strokeWidth={3} />
                        </button>
                        
                        <div>
                          <h4 className={`font-bold text-lg ${t.status === 'completed' ? (isDark ? 'line-through text-gray-500' : 'line-through text-gray-400') : (isDark ? 'text-white' : 'text-gray-900')}`}>
                            {t.title || 'Untitled'}
                          </h4>
                          <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {CATEGORIES.find(c => c.id === t.category)?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                         <span className={`block font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(t.amount)}</span>
                         {t.status === 'pending' && <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">Unpaid</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Load More Button */}
            {visibleDays < groupedTransactions.length && (
              <div className="pt-4 pb-8">
                <Button 
                  onClick={() => setVisibleDays(prev => prev + 7)} 
                  variant="secondary" 
                  className={`w-full py-4 text-sm font-bold ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-violet-50 text-violet-600 hover:bg-violet-100'}`}
                >
                  <ArrowDownCircle size={20} />
                  Load More Transactions
                </Button>
                <p className={`text-center text-xs mt-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  Showing {visibleGroups.length} of {groupedTransactions.length} days
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const SummaryView = ({ transactions, currentDate, navigateMonth }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const { formatCurrency, isDark } = useAppContext();

  // Filter for current month
  const monthlyTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
  }, [transactions, currentDate]);

  const stats = useMemo(() => {
    const totalSpent = monthlyTransactions.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalPaid = monthlyTransactions.filter(t => t.status === 'completed').reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Group by category
    const catStats = CATEGORIES.map(cat => {
      const items = monthlyTransactions.filter(t => t.category === cat.id);
      const amount = items.reduce((acc, curr) => acc + Number(curr.amount), 0);
      // Percentage of TOTAL Expenses
      const percentageOfTotal = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
      
      return { ...cat, amount, percentage: percentageOfTotal, items };
    }).sort((a, b) => b.amount - a.amount);

    return { totalSpent, totalPaid, catStats };
  }, [monthlyTransactions, currentDate]);

  // Calculate percentage of paid transactions
  const paidPercentage = stats.totalSpent > 0 ? Math.round((stats.totalPaid / stats.totalSpent) * 100) : 0;

  return (
    <div className="space-y-6 pb-32 animate-fade-in">
       {/* Header */}
       <div className="pt-2">
         <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Summary</h2>
         <div className="flex items-center justify-between">
            <button onClick={() => navigateMonth(-1)} className={`p-3 rounded-2xl shadow-sm hover:text-violet-600 transition-all ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-400'}`}>
              <ChevronLeft size={24} />
            </button>
            <div className="text-center">
              <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {currentDate.toLocaleDateString('en-US', { month: 'long' })}
              </h2>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {currentDate.getFullYear()}
              </p>
            </div>
            <button onClick={() => navigateMonth(1)} className={`p-3 rounded-2xl shadow-sm hover:text-violet-600 transition-all ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-400'}`}>
              <ChevronRight size={24} />
            </button>
         </div>
       </div>

      {/* Redesigned Total Expenses Card */}
      <Card className="relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10">
           <div>
              <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-1">Total Expenses</h3>
              <h2 className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(stats.totalSpent)}</h2>
           </div>
           
           {/* Circular Progress Indicator - Anti-Clockwise (Sweep 0), Starts Top (12 -> 9 -> 6) */}
           <div className="relative h-16 w-16 flex items-center justify-center">
              {/* SVG Ring - Modified path to sweep counter-clockwise */}
              <svg className="h-full w-full" viewBox="0 0 36 36">
                {/* Background Circle */}
                <path
                  className={`${isDark ? 'text-gray-700' : 'text-gray-100'}`}
                  // Note the sweep-flag changes from '1' to '0' to go counter-clockwise
                  d="M18 2.0845 a 15.9155 15.9155 0 0 0 0 31.831 a 15.9155 15.9155 0 0 0 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                {/* Progress Circle */}
                <path
                  className="text-violet-600 transition-all duration-1000 ease-out"
                  strokeDasharray={`${paidPercentage}, 100`}
                  // Note the sweep-flag changes from '1' to '0' to go counter-clockwise
                  d="M18 2.0845 a 15.9155 15.9155 0 0 0 0 31.831 a 15.9155 15.9155 0 0 0 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
              {/* Centered Text */}
              <div className="absolute flex flex-col items-center justify-center">
                 <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{paidPercentage}%</span>
                 <span className="text-[8px] font-bold text-gray-400 uppercase">Paid</span>
              </div>
           </div>
        </div>
      </Card>

      {/* Categories List */}
      <div className="space-y-4">
        {stats.catStats.map(cat => (
          <div key={cat.id} className={`rounded-2xl p-4 border shadow-sm transition-all ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            {/* Header */}
            <div 
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl ${isDark ? 'bg-opacity-20' : ''} ${cat.color}`}>
                {cat.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-1">
                  <h4 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{cat.name}</h4>
                  <div className="text-right flex items-center gap-2">
                    <span className={`text-xs font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{formatCurrency(cat.amount)}</span>
                    <span className={`font-bold ${cat.percentage > 20 ? 'text-rose-500' : (isDark ? 'text-gray-300' : 'text-gray-900')}`}>
                      {Math.round(cat.percentage)}%
                    </span>
                  </div>
                </div>
                {/* Progress Bar (Percentage of TOTAL) */}
                <div className={`h-2.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${cat.percentage > 20 ? 'bg-violet-500' : 'bg-violet-400'}`}
                    style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Expanded Sub-items */}
            {expandedCategory === cat.id && (
              <div className={`mt-4 pt-4 border-t space-y-3 animate-fade-in ${isDark ? 'border-gray-700' : 'border-gray-50'}`}>
                {cat.items.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No transactions in this category</p>
                ) : (
                  cat.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm pl-2 border-l-2 border-violet-200">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{item.title || "Untitled"}</span>
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{formatCurrency(item.amount)}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MonthlyView = ({ transactions, onMonthSelect }) => {
  const { formatCurrency, isDark } = useAppContext();

  // Group transactions by "YYYY-MM"
  const monthlyData = useMemo(() => {
    const grouped = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      // Key: YYYY-MM
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!grouped[key]) {
        grouped[key] = { amount: 0, dateObj: d };
      }
      grouped[key].amount += Number(t.amount);
    });

    // Convert to array and sort descending (newest first)
    return Object.entries(grouped)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, data]) => ({
        key,
        amount: data.amount,
        dateObj: data.dateObj
      }));
  }, [transactions]);

  return (
    <div className="space-y-6 pb-32 animate-fade-in pt-4">
      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Monthly History</h2>
      
      {monthlyData.length === 0 ? (
        <div className={`text-center py-20 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          <p>No transaction history yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {monthlyData.map((item) => (
            <div 
              key={item.key}
              onClick={() => onMonthSelect(item.dateObj)}
              className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-100 hover:border-violet-300'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-violet-900/30 text-violet-300' : 'bg-violet-100 text-violet-600'}`}>
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {item.dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Tap to view details
                  </p>
                </div>
              </div>
              <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(item.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SettingsModal = ({ isOpen, onClose, onClearData }) => {
  const { isDark, toggleTheme, currency, setCurrency } = useAppContext();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={onClose} className={`p-2 rounded-full ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Dark Mode Toggle */}
          <div className={`flex items-center justify-between p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
             <div className="flex items-center gap-3">
               {isDark ? <Moon size={20} className="text-violet-400" /> : <Sun size={20} className="text-orange-400" />}
               <span className="font-bold">Dark Mode</span>
             </div>
             <div 
               onClick={toggleTheme}
               className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${isDark ? 'bg-violet-600' : 'bg-gray-300'}`}
             >
               <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${isDark ? 'translate-x-5' : ''}`} />
             </div>
          </div>

          {/* Currency Selector */}
          <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
             <div className="flex items-center gap-3 mb-3">
               <DollarSign size={20} className="text-emerald-500" />
               <span className="font-bold">Currency</span>
             </div>
             <div className="grid grid-cols-3 gap-2">
               {CURRENCIES.map(c => (
                 <button
                   key={c.code}
                   onClick={() => setCurrency(c.code)}
                   className={`py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                     currency === c.code 
                       ? 'border-violet-600 bg-violet-600 text-white' 
                       : (isDark ? 'border-gray-700 bg-gray-700 text-gray-300' : 'border-white bg-white text-gray-600')
                   }`}
                 >
                   {c.symbol} {c.code}
                 </button>
               ))}
             </div>
          </div>

          <button onClick={onClearData} className="w-full py-4 text-rose-500 font-bold text-sm hover:underline mt-4">
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
};

const AddTransactionModal = ({ isOpen, onClose, onSave, editingTransaction, onDelete }) => {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { isDark, currency, getCurrencySymbol } = useAppContext();

  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount);
      setTitle(editingTransaction.title);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
    } else {
      setAmount('');
      setTitle('');
      setCategory(CATEGORIES[0].id);
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editingTransaction, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    onSave({
      id: editingTransaction ? editingTransaction.id : Date.now().toString(),
      amount: parseFloat(amount),
      title: title || 'Untitled',
      category,
      date,
      status: editingTransaction ? editingTransaction.status : 'pending' // Default pending
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      <div className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl pointer-events-auto max-h-[90vh] flex flex-col animate-fade-in-up ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        
        <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {editingTransaction ? 'Edit Amount' : 'Add Amount'}
          </h2>
          <button onClick={onClose} className={`p-2 rounded-full ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Amount Input */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Amount</label>
            <div className={`flex items-center border-b-2 transition-colors py-2 ${isDark ? 'border-gray-700 focus-within:border-violet-500' : 'border-violet-100 focus-within:border-violet-600'}`}>
              <span className="text-3xl font-bold text-gray-400 mr-2">{getCurrencySymbol()}</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className={`w-full text-4xl font-bold outline-none bg-transparent ${isDark ? 'text-white' : 'text-gray-900'}`}
                autoFocus
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Description</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Perfume, Dinner"
              className={`w-full py-3 border-b outline-none text-lg font-medium bg-transparent mt-1 ${isDark ? 'border-gray-700 text-white focus:border-violet-500' : 'border-gray-100 text-gray-900 focus:border-violet-600'}`}
            />
          </div>

          {/* Categories */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 block">Category</label>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    category === cat.id 
                    ? (isDark ? 'border-violet-500 bg-violet-900/40 text-violet-300' : 'border-violet-600 bg-violet-50 text-violet-700') 
                    : (isDark ? 'border-transparent bg-gray-800 text-gray-500 hover:bg-gray-700' : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100')
                  }`}
                >
                  <span className="text-2xl mb-1">{cat.icon}</span>
                  <span className="text-[10px] font-bold">{cat.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full py-3 border-b outline-none text-lg font-medium bg-transparent mt-1 ${isDark ? 'border-gray-700 text-white' : 'border-gray-100 text-gray-900'}`}
            />
          </div>
        </div>

        <div className={`p-6 border-t rounded-b-3xl flex gap-3 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
          {editingTransaction && (
            <Button variant="danger" onClick={() => { onDelete(editingTransaction.id); onClose(); }} className="flex-1">
              Delete
            </Button>
          )}
          <Button onClick={handleSubmit} className="flex-[2] shadow-xl">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentView, setCurrentView] = useState('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  // Removed budget state
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Settings State - Default to PHP
  const [currency, setCurrency] = useState('PHP');
  const [isDark, setIsDark] = useState(false);

  // Load Data
  useEffect(() => {
    const savedTx = localStorage.getItem('violet_pdf_transactions');
    const savedCurrency = localStorage.getItem('violet_pdf_currency');
    const savedTheme = localStorage.getItem('violet_pdf_theme');

    if (savedTx) setTransactions(JSON.parse(savedTx));
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedTheme === 'true') setIsDark(true);
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem('violet_pdf_transactions', JSON.stringify(transactions));
    localStorage.setItem('violet_pdf_currency', currency);
    localStorage.setItem('violet_pdf_theme', isDark);
  }, [transactions, currency, isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const getCurrencySymbol = () => {
    return CURRENCIES.find(c => c.code === currency)?.symbol || '$';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const navigateMonth = (dir) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + dir);
    setCurrentDate(newDate);
  };

  const handleSave = (tx) => {
    if (editingTransaction) {
      setTransactions(transactions.map(t => t.id === tx.id ? tx : t));
    } else {
      setTransactions([tx, ...transactions]);
    }
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleToggleStatus = (id) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
    ));
  };

  const handleClearDataClick = () => {
    setIsResetConfirmOpen(true);
  };

  const confirmClearData = () => {
    setTransactions([]);
    setIsResetConfirmOpen(false);
    setIsSettingsOpen(false);
  };

  const handleMonthSelect = (date) => {
    setCurrentDate(date);
    setCurrentView('daily');
  };

  const openAdd = () => { setEditingTransaction(null); setIsModalOpen(true); };
  const openEdit = (t) => { setEditingTransaction(t); setIsModalOpen(true); };

  const contextValue = {
    isDark,
    toggleTheme,
    currency,
    setCurrency,
    formatCurrency,
    getCurrencySymbol
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className={`max-w-md mx-auto min-h-screen relative shadow-2xl ${isDark ? 'bg-gray-900 shadow-black' : 'bg-gray-50'}`}>
          
          {/* Top View Toggle */}
          <div className={`px-6 pt-6 pb-2 sticky top-0 z-10 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center gap-4">
              <div className={`flex-1 flex p-1 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <button 
                  onClick={() => setCurrentView('daily')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${currentView === 'daily' ? (isDark ? 'bg-gray-700 text-white shadow-sm' : 'bg-white shadow-sm text-violet-600') : 'text-gray-400'}`}
                >
                  Daily
                </button>
                <button 
                  onClick={() => setCurrentView('summary')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${currentView === 'summary' ? (isDark ? 'bg-gray-700 text-white shadow-sm' : 'bg-white shadow-sm text-violet-600') : 'text-gray-400'}`}
                >
                  Summary
                </button>
                <button 
                  onClick={() => setCurrentView('monthly')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${currentView === 'monthly' ? (isDark ? 'bg-gray-700 text-white shadow-sm' : 'bg-white shadow-sm text-violet-600') : 'text-gray-400'}`}
                >
                  Monthly
                </button>
              </div>
              
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className={`p-3 rounded-xl transition-colors ${isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-400 hover:text-gray-900'}`}
              >
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <main className="px-6 py-4">
            {currentView === 'daily' ? (
              <DailyView 
                transactions={transactions} 
                currentDate={currentDate} 
                navigateMonth={navigateMonth}
                onAddClick={openAdd}
                onToggleStatus={handleToggleStatus}
                onEdit={openEdit}
              />
            ) : currentView === 'summary' ? (
              <SummaryView 
                transactions={transactions} 
                currentDate={currentDate} 
                navigateMonth={navigateMonth}
              />
            ) : (
              <MonthlyView 
                transactions={transactions}
                onMonthSelect={handleMonthSelect}
              />
            )}
          </main>

          {/* Modals */}
          <AddTransactionModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSave} 
            editingTransaction={editingTransaction}
            onDelete={handleDelete}
          />

          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)}
            onClearData={handleClearDataClick}
          />

          <ConfirmModal 
            isOpen={isResetConfirmOpen}
            onClose={() => setIsResetConfirmOpen(false)}
            onConfirm={confirmClearData}
            title="Reset All Data?"
            message="This will permanently delete all your transaction history. This action cannot be undone."
          />
          
        </div>
        
        <style>{`
          @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fade-in-up { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
          .animate-fade-in-up { animation: fade-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>
      </div>
    </AppContext.Provider>
  );
}