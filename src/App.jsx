import React, { useState, useEffect, useMemo, useContext, createContext } from 'react';
import { 
  Home, 
  Plus, 
  PieChart, 
  List, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Calendar, 
  Tag, 
  Trash2, 
  Edit2, 
  X, 
  Check, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  CreditCard,
  DollarSign,
  Moon,
  Sun,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';

/**
 * Violet Expense Tracker
 * A mobile-first, offline-capable expense tracker with an Airbnb-inspired aesthetic.
 * Now supports Dark Mode, Transaction Status, Custom Confirmations, and Monthly Views.
 */

// --- Theme Context ---
const ThemeContext = createContext();

const useTheme = () => useContext(ThemeContext);

// --- Constants & Utilities ---

const CATEGORY_COLORS = {
  orange: { light: 'bg-orange-100 text-orange-600', dark: 'bg-orange-900/40 text-orange-300' },
  blue: { light: 'bg-blue-100 text-blue-600', dark: 'bg-blue-900/40 text-blue-300' },
  indigo: { light: 'bg-indigo-100 text-indigo-600', dark: 'bg-indigo-900/40 text-indigo-300' },
  pink: { light: 'bg-pink-100 text-pink-600', dark: 'bg-pink-900/40 text-pink-300' },
  purple: { light: 'bg-purple-100 text-purple-600', dark: 'bg-purple-900/40 text-purple-300' },
  red: { light: 'bg-red-100 text-red-600', dark: 'bg-red-900/40 text-red-300' },
  sky: { light: 'bg-sky-100 text-sky-600', dark: 'bg-sky-900/40 text-sky-300' },
  yellow: { light: 'bg-yellow-100 text-yellow-600', dark: 'bg-yellow-900/40 text-yellow-300' },
  gray: { light: 'bg-gray-100 text-gray-600', dark: 'bg-gray-700 text-gray-300' },
  slate: { light: 'bg-slate-100 text-slate-600', dark: 'bg-slate-700 text-slate-300' },
  emerald: { light: 'bg-emerald-100 text-emerald-600', dark: 'bg-emerald-900/40 text-emerald-300' },
  teal: { light: 'bg-teal-100 text-teal-600', dark: 'bg-teal-900/40 text-teal-300' },
  green: { light: 'bg-green-100 text-green-600', dark: 'bg-green-900/40 text-green-300' },
  rose: { light: 'bg-rose-100 text-rose-600', dark: 'bg-rose-900/40 text-rose-300' },
};

const getCategoryColorClass = (colorKey, isDark) => {
  const colorSet = CATEGORY_COLORS[colorKey] || CATEGORY_COLORS.gray;
  return isDark ? colorSet.dark : colorSet.light;
};

const CATEGORIES = {
  expense: [
    { id: 'food', name: 'Food & Dining', icon: '🍔', colorKey: 'orange' },
    { id: 'transport', name: 'Transportation', icon: '🚗', colorKey: 'blue' },
    { id: 'housing', name: 'Housing', icon: '🏠', colorKey: 'indigo' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', colorKey: 'pink' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', colorKey: 'purple' },
    { id: 'health', name: 'Health', icon: '❤️', colorKey: 'red' },
    { id: 'travel', name: 'Travel', icon: '✈️', colorKey: 'sky' },
    { id: 'education', name: 'Education', icon: '📚', colorKey: 'yellow' },
    { id: 'bills', name: 'Bills & Utilities', icon: '💡', colorKey: 'gray' },
    { id: 'other', name: 'Other', icon: '📦', colorKey: 'slate' },
  ],
  income: [
    { id: 'salary', name: 'Salary', icon: '💰', colorKey: 'emerald' },
    { id: 'freelance', name: 'Freelance', icon: '💻', colorKey: 'teal' },
    { id: 'investment', name: 'Investments', icon: '📈', colorKey: 'green' },
    { id: 'gift', name: 'Gifts', icon: '🎁', colorKey: 'rose' },
    { id: 'other_income', name: 'Other Income', icon: '💵', colorKey: 'slate' },
  ]
};

const getCurrencySymbol = (code) => {
  const symbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'PHP': '₱',
    'INR': '₹'
  };
  return symbols[code] || '$';
};

const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// --- Components ---

const Card = ({ children, className = "" }) => {
  const { isDark } = useTheme();
  return (
    <div className={`rounded-2xl shadow-sm border p-4 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} ${className}`}>
      {children}
    </div>
  );
};

const Button = ({ children, onClick, variant = 'primary', className = "", type = "button", disabled = false }) => {
  const { isDark } = useTheme();
  const baseStyle = "px-4 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-500/20 disabled:opacity-50",
    secondary: isDark 
      ? "bg-gray-700 text-violet-300 hover:bg-gray-600 disabled:opacity-50" 
      : "bg-violet-50 text-violet-700 hover:bg-violet-100 disabled:opacity-50",
    outline: isDark
      ? "border-2 border-gray-700 text-gray-300 hover:border-violet-500 hover:text-violet-400 disabled:opacity-50"
      : "border-2 border-gray-200 text-gray-700 hover:border-violet-600 hover:text-violet-600 disabled:opacity-50",
    danger: isDark
      ? "bg-rose-900/30 text-rose-300 hover:bg-rose-900/50 disabled:opacity-50"
      : "bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-50",
    ghost: isDark
      ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200 disabled:opacity-50"
      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder, required = false, icon: Icon }) => {
  const { isDark } = useTheme();
  return (
    <div className="mb-4">
      {label && <label className={`block text-sm font-medium mb-1.5 ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`block w-full rounded-xl border focus:ring-4 transition-all duration-200 py-3 ${Icon ? 'pl-10' : 'pl-4'} 
            ${isDark 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600 focus:border-violet-500 focus:bg-gray-700 focus:ring-violet-500/20' 
              : 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-violet-500 focus:ring-violet-500/10'}`}
        />
      </div>
    </div>
  );
};

// --- Confirmation Modal ---

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", variant = "danger" }) => {
  const { isDark } = useTheme();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-sm rounded-2xl p-6 shadow-xl transform transition-all ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4 ${variant === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-violet-100 text-violet-600'}`}>
          <AlertTriangle size={24} />
        </div>
        <h3 className={`text-lg font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className={`text-sm text-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{message}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 justify-center">Cancel</Button>
          <Button variant={variant} onClick={onConfirm} className="flex-1 justify-center">{confirmText}</Button>
        </div>
      </div>
    </div>
  );
};

// --- Views ---

const Dashboard = ({ transactions, currency, onAddClick, onEdit, onToggleStatus }) => {
  const { isDark } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };
  
  const summary = useMemo(() => {
    // 1. Calculate All-Time Balance (Everything)
    const allCompletedTransactions = transactions.filter(t => t.status !== 'pending');
    const totalIncome = allCompletedTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalExpense = allCompletedTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const balance = totalIncome - totalExpense;

    // 2. Calculate Monthly Stats (Selected Month Only)
    const monthTransactions = allCompletedTransactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentDate.getMonth() && 
             tDate.getFullYear() === currentDate.getFullYear();
    });

    const monthlyIncome = monthTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const monthlyExpense = monthTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);

    return { balance, monthlyIncome, monthlyExpense };
  }, [transactions, currentDate]);

  // Use a stable recent list or filtered? Usually Dashboard "Recent Activity" is global, 
  // but let's filter it to the selected month if the user is in "Month View" mode. 
  // However, usually "Recent Activity" implies the absolute latest. 
  // Given the context, keeping it as "absolute latest" is standard for a home feed.
  const recentTransactions = transactions.slice(0, 5);

  const monthLabel = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h2 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Balance</h2>
          <h1 className={`text-4xl font-bold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {formatCurrency(summary.balance, currency)}
          </h1>
        </div>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isDark ? 'bg-violet-900/30 text-violet-300' : 'bg-violet-100 text-violet-600'}`}>
          <Wallet size={20} />
        </div>
      </div>

      {/* Month Selector */}
      <div className={`flex items-center justify-between p-2 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm border border-gray-100'}`}>
        <button 
          onClick={() => navigateMonth(-1)}
          className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
        >
          <ChevronLeft size={20} />
        </button>
        <span className={`font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {monthLabel}
        </span>
        <button 
          onClick={() => navigateMonth(1)}
          className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Summary Cards (Monthly) */}
      <div className="grid grid-cols-2 gap-4">
        <Card className={isDark ? "bg-emerald-900/20 border-emerald-900/30" : "bg-emerald-50 border-emerald-100"}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
              <TrendingUp size={16} />
            </div>
            <span className={`text-sm font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Income</span>
          </div>
          <p className={`text-xl font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{formatCurrency(summary.monthlyIncome, currency)}</p>
          <p className={`text-[10px] mt-1 ${isDark ? 'text-emerald-500/60' : 'text-emerald-600/60'}`}>for {currentDate.toLocaleDateString('en-US', { month: 'short' })}</p>
        </Card>
        <Card className={isDark ? "bg-rose-900/20 border-rose-900/30" : "bg-rose-50 border-rose-100"}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-rose-900/40 text-rose-400' : 'bg-rose-100 text-rose-600'}`}>
              <TrendingDown size={16} />
            </div>
            <span className={`text-sm font-medium ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>Expense</span>
          </div>
          <p className={`text-xl font-bold ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>{formatCurrency(summary.monthlyExpense, currency)}</p>
          <p className={`text-[10px] mt-1 ${isDark ? 'text-rose-500/60' : 'text-rose-600/60'}`}>for {currentDate.toLocaleDateString('en-US', { month: 'short' })}</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="bg-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-violet-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <h3 className="font-bold text-lg mb-1">Track your spending</h3>
          <p className="text-violet-100 text-sm mb-4 opacity-90">Keep your finances healthy and organized.</p>
          <button 
            onClick={onAddClick}
            className="bg-white text-violet-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-colors"
          >
            Add Transaction
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
        </div>
        
        {recentTransactions.length === 0 ? (
          <div className={`text-center py-10 rounded-2xl border border-dashed ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            <div className={`mx-auto h-12 w-12 mb-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
              <List size={48} strokeWidth={1} />
            </div>
            <p className={isDark ? 'text-gray-500' : 'text-gray-500'}>No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map(t => (
              <TransactionItem 
                key={t.id} 
                transaction={t} 
                currency={currency} 
                onClick={() => onEdit(t)} 
                onToggleStatus={onToggleStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Analytics = ({ transactions, currency }) => {
  const [view, setView] = useState('expense');
  const { isDark } = useTheme();

  const data = useMemo(() => {
    // Only analyze completed transactions
    const completedTransactions = transactions.filter(t => t.status !== 'pending');
    
    const filtered = completedTransactions.filter(t => t.type === view);
    const total = filtered.reduce((acc, curr) => acc + Number(curr.amount), 0);
    
    const grouped = filtered.reduce((acc, curr) => {
      const catDef = CATEGORIES[view].find(c => c.id === curr.category) || { name: 'Unknown', colorKey: 'gray' };
      if (!acc[curr.category]) {
        acc[curr.category] = { ...catDef, amount: 0, count: 0 };
      }
      acc[curr.category].amount += Number(curr.amount);
      acc[curr.category].count += 1;
      return acc;
    }, {});

    return Object.values(grouped)
      .sort((a, b) => b.amount - a.amount)
      .map(item => ({
        ...item,
        percentage: total === 0 ? 0 : Math.round((item.amount / total) * 100)
      }));
  }, [transactions, view]);

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <h2 className={`text-2xl font-bold pt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Analytics</h2>
      
      {/* Toggle */}
      <div className={`flex p-1 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <button
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
            view === 'expense' 
              ? (isDark ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm') 
              : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')
          }`}
          onClick={() => setView('expense')}
        >
          Expenses
        </button>
        <button
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
            view === 'income' 
              ? (isDark ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm') 
              : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')
          }`}
          onClick={() => setView('income')}
        >
          Income
        </button>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <PieChart size={64} strokeWidth={1} className={`mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
          <p>No data to display for {view}</p>
        </div>
      ) : (
        <>
          <Card className="space-y-4">
             <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Breakdown</h3>
             {data.map((item) => (
               <div key={item.id} className="space-y-1">
                 <div className="flex justify-between text-sm">
                    <span className={`font-medium flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      <span>{item.icon}</span> {item.name}
                    </span>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{item.percentage}%</span>
                 </div>
                 <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                   <div 
                     className={`h-full rounded-full ${view === 'income' ? 'bg-emerald-500' : 'bg-violet-500'}`} 
                     style={{ width: `${item.percentage}%` }}
                   ></div>
                 </div>
                 <div className={`text-xs text-right ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatCurrency(item.amount, currency)}
                 </div>
               </div>
             ))}
          </Card>
        </>
      )}
    </div>
  );
};

const History = ({ transactions, currency, onDelete, onEdit, onToggleStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { isDark } = useTheme();

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.amount.toString().includes(searchTerm);
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4 pb-24 h-full flex flex-col animate-fade-in">
      <h2 className={`text-2xl font-bold pt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>History</h2>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className={`block w-full rounded-xl border pl-10 py-2.5 text-sm focus:ring-violet-500 ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600 focus:border-violet-500' 
                : 'bg-white border-gray-200 text-gray-900 focus:border-violet-500'
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={`rounded-xl border py-2.5 px-3 text-sm focus:ring-violet-500 ${
            isDark
              ? 'bg-gray-800 border-gray-700 text-white focus:border-violet-500'
              : 'bg-white border-gray-200 text-gray-900 focus:border-violet-500'
          }`}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {filteredTransactions.length === 0 ? (
          <div className={`text-center py-10 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            <p>No transactions found.</p>
          </div>
        ) : (
          filteredTransactions.map(t => (
            <TransactionItem 
              key={t.id} 
              transaction={t} 
              currency={currency} 
              onClick={() => onEdit(t)}
              onToggleStatus={onToggleStatus}
            />
          ))
        )}
      </div>
    </div>
  );
};

const TransactionItem = ({ transaction, currency, onClick, onToggleStatus }) => {
  const { isDark } = useTheme();
  const isExpense = transaction.type === 'expense';
  const category = [...CATEGORIES.expense, ...CATEGORIES.income].find(c => c.id === transaction.category) || 
    { name: 'Unknown', icon: '❓', colorKey: 'gray' };
  
  const colorClass = getCategoryColorClass(category.colorKey, isDark);
  const isCompleted = transaction.status !== 'pending'; // Default to done if undefined for old data

  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between active:scale-[0.99] transition-transform cursor-pointer group ${
        isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-100 hover:border-violet-200'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Category Icon */}
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl relative ${colorClass}`}>
          {category.icon}
          {/* Status Indicator Badge (Clickable Button) */}
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus && onToggleStatus(transaction.id);
            }}
            className={`absolute -bottom-2 -right-2 h-8 w-8 flex items-center justify-center rounded-full border-2 shadow-sm z-10 transition-transform active:scale-95 ${isDark ? 'border-gray-800 bg-gray-800' : 'border-white bg-white'}`}
          >
             {isCompleted ? (
               <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-500/10" />
             ) : (
               <Clock size={16} className="text-amber-500 fill-amber-500/10" />
             )}
          </button>
        </div>
        
        {/* Text Details */}
        <div>
          <h4 className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'} ${!isCompleted && 'opacity-70'}`}>
            {transaction.description || "No Description"}
          </h4>
          <p className={`text-xs font-medium flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {category.name} • {formatDate(transaction.date)}
          </p>
        </div>
      </div>

      {/* Amount & Edit Hint */}
      <div className="flex items-center gap-3">
        <div className={`font-bold text-right ${isExpense ? (isDark ? 'text-gray-100' : 'text-gray-900') : (isDark ? 'text-emerald-400' : 'text-emerald-600')}`}>
          {isExpense ? '-' : '+'}{formatCurrency(transaction.amount, currency)}
        </div>
        <div className={`p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-400'}`}>
           <Edit2 size={14} />
        </div>
      </div>
    </div>
  );
};

const TransactionForm = ({ isOpen, onClose, onSave, editingTransaction, onDelete, currency }) => {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('completed'); // 'completed' or 'pending'
  const { isDark } = useTheme();

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setDescription(editingTransaction.description);
      setStatus(editingTransaction.status || 'completed');
    } else {
      setType('income');
      setAmount('');
      setCategory(CATEGORIES['income'][0].id);
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setStatus('completed');
    }
  }, [editingTransaction, isOpen]);

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(CATEGORIES[newType][0].id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return; // Description not required
    
    onSave({
      id: editingTransaction ? editingTransaction.id : Date.now().toString(),
      type,
      amount: parseFloat(amount),
      category,
      date,
      description: description || "", // Optional Description
      status
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity pointer-events-auto" 
        onClick={onClose}
      />
      
      <div className={`w-full max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl transform transition-transform duration-300 pointer-events-auto flex flex-col max-h-[90vh] h-[90vh] sm:h-auto ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        
        <div className={`w-full flex justify-center pt-3 pb-1 sm:hidden ${isDark ? 'bg-gray-900 rounded-t-3xl' : 'bg-white rounded-t-3xl'}`}>
          <div className={`w-12 h-1.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto scrollbar-hide">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <button onClick={onClose} type="button" className={`p-2 rounded-full hover:opacity-80 ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pb-20 sm:pb-0">
            {/* Type Switcher */}
            <div className={`grid grid-cols-2 gap-2 p-1 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`py-3 rounded-xl text-sm font-bold transition-all ${
                  type === 'income' 
                    ? (isDark ? 'bg-gray-700 shadow-sm text-emerald-400' : 'bg-white shadow-sm text-emerald-600') 
                    : (isDark ? 'text-gray-500' : 'text-gray-500')
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`py-3 rounded-xl text-sm font-bold transition-all ${
                  type === 'expense' 
                    ? (isDark ? 'bg-gray-700 shadow-sm text-rose-400' : 'bg-white shadow-sm text-rose-600') 
                    : (isDark ? 'text-gray-500' : 'text-gray-500')
                }`}
              >
                Expense
              </button>
            </div>

            {/* Amount */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Amount</label>
              <div className="relative">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {getCurrencySymbol(currency)}
                </span>
                <input 
                  type="number" 
                  step="0.01" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={`w-full pl-10 pr-4 py-4 text-3xl font-bold rounded-2xl border-2 border-transparent outline-none transition-all ${
                    isDark 
                      ? 'bg-gray-800 text-white placeholder-gray-600 focus:border-violet-500 focus:bg-gray-800' 
                      : 'bg-gray-50 text-gray-900 placeholder-gray-300 focus:border-violet-500 focus:bg-white'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Status Toggle */}
            <div className={`p-4 rounded-xl flex items-center justify-between cursor-pointer border transition-colors ${
               status === 'completed' 
                 ? (isDark ? 'bg-emerald-900/10 border-emerald-900/30' : 'bg-emerald-50 border-emerald-100')
                 : (isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100')
            }`} onClick={() => setStatus(status === 'completed' ? 'pending' : 'completed')}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  status === 'completed' 
                    ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600')
                    : (isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500')
                }`}>
                  {status === 'completed' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                </div>
                <div>
                   <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                     {status === 'completed' ? 'Cleared / Received' : 'Pending'}
                   </p>
                   <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                     {status === 'completed' ? 'Transaction is complete' : 'Mark as pending'}
                   </p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                status === 'completed' 
                  ? 'bg-emerald-500 border-emerald-500' 
                  : (isDark ? 'border-gray-600' : 'border-gray-300')
              }`}>
                {status === 'completed' && <Check size={14} className="text-white" />}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Category</label>
              <div className="grid grid-cols-4 gap-3">
                {CATEGORIES[type].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      category === cat.id 
                        ? (isDark ? 'border-violet-500 bg-violet-900/20 text-violet-300' : 'border-violet-600 bg-violet-50 text-violet-600')
                        : (isDark ? 'border-gray-800 bg-gray-800 hover:border-gray-600 text-gray-400' : 'border-gray-100 bg-white hover:border-gray-300 text-gray-600')
                    }`}
                  >
                    <span className="text-2xl mb-1">{cat.icon}</span>
                    <span className="text-[10px] font-medium truncate w-full text-center">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 gap-4">
              <Input 
                label="Date" 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required
                icon={Calendar}
              />
              <Input 
                label="Description" 
                placeholder="What is this for? (Optional)" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                // Removed required
                icon={Edit2}
              />
            </div>
          
            {/* Footer */}
            <div className={`p-6 border-t mt-auto sm:rounded-b-3xl ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} -mx-6 -mb-6`}>
              <div className="flex gap-3">
                {editingTransaction && (
                  <Button 
                    variant="danger" 
                    type="button"
                    onClick={() => { onDelete(editingTransaction.id); onClose(); }}
                    className="flex-1"
                  >
                    <Trash2 size={18} />
                    Delete
                  </Button>
                )}
                <Button 
                  variant="primary" 
                  type="submit"
                  className={`flex-[2] shadow-lg ${type === 'expense' ? 'shadow-violet-500/20' : 'shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700'}`}
                >
                  <Check size={18} />
                  Save
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SettingsView = ({ currency, setCurrency, onClearData }) => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <h2 className={`text-2xl font-bold pt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
      
      <Card>
        <h3 className={`text-sm font-bold uppercase tracking-wide mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Appearance</h3>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Dark Mode</span>
          </div>
          <button 
            onClick={toggleTheme}
            className={`w-14 h-8 rounded-full transition-colors relative flex items-center ${isDark ? 'bg-violet-600' : 'bg-gray-200'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white shadow-sm absolute transition-transform ${isDark ? 'translate-x-7' : 'translate-x-1'}`}></div>
          </button>
        </div>
      </Card>

      <Card>
        <h3 className={`text-sm font-bold uppercase tracking-wide mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Preferences</h3>
        <div className={`flex items-center justify-between py-2 border-b last:border-0 ${isDark ? 'border-gray-700' : 'border-gray-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              <DollarSign size={20} />
            </div>
            <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Currency</span>
          </div>
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className={`rounded-lg text-sm p-2 font-semibold focus:ring-violet-500 border-none ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-700'}`}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="PHP">PHP (₱)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>
      </Card>

      <Card>
        <h3 className={`text-sm font-bold uppercase tracking-wide mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Data Management</h3>
        <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          All your data is stored locally on this device. Clearing it will remove all transactions permanently.
        </p>
        <Button variant="danger" onClick={onClearData} className="w-full justify-center">
          <Trash2 size={18} />
          Clear All Data
        </Button>
      </Card>

      <div className={`text-center text-sm mt-8 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
        <p>Violet Expense Tracker</p>
        <p>Version 1.2.0 • Dark Mode Enabled</p>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [isDark, setIsDark] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Load data & theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('violet_transactions');
    const savedCurrency = localStorage.getItem('violet_currency');
    const savedTheme = localStorage.getItem('violet_theme');
    
    if (saved) setTransactions(JSON.parse(saved));
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedTheme) setIsDark(savedTheme === 'dark');
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('violet_transactions', JSON.stringify(transactions));
    localStorage.setItem('violet_currency', currency);
    localStorage.setItem('violet_theme', isDark ? 'dark' : 'light');
  }, [transactions, currency, isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleSaveTransaction = (transaction) => {
    if (editingTransaction) {
      setTransactions(transactions.map(t => t.id === transaction.id ? transaction : t));
    } else {
      setTransactions([transaction, ...transactions]);
    }
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id) => {
    // We already have a modal for edit/delete, so checking via native confirm is okay here, 
    // OR we could add another modal state. For simplicity in the form flow, native is often used,
    // but since we want to avoid native confirm, we can assume the button press in the form IS the confirmation intention, 
    // or wrap this too. For now, the delete button is inside the edit modal so it is deliberate.
    setTransactions(transactions.filter(t => t.id !== id));
    setEditingTransaction(null);
  };

  const handleToggleStatus = (id) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t
    ));
  };

  const handleClearDataRequest = () => {
    setIsClearModalOpen(true);
  };

  const confirmClearData = () => {
    setTransactions([]);
    localStorage.removeItem('violet_transactions');
    setIsClearModalOpen(false);
  };

  const openAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard transactions={transactions} currency={currency} onAddClick={openAddModal} onEdit={openEditModal} onToggleStatus={handleToggleStatus} />;
      case 'analytics': return <Analytics transactions={transactions} currency={currency} />;
      case 'history': return <History transactions={transactions} currency={currency} onDelete={handleDeleteTransaction} onEdit={openEditModal} onToggleStatus={handleToggleStatus} />;
      case 'settings': return <SettingsView currency={currency} setCurrency={setCurrency} onClearData={handleClearDataRequest} />;
      default: return <Dashboard transactions={transactions} currency={currency} onAddClick={openAddModal} onToggleStatus={handleToggleStatus} />;
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={`min-h-screen font-sans selection:bg-violet-500/30 transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        
        {/* Mobile-first Layout Container */}
        <div className={`max-w-md mx-auto min-h-screen relative shadow-2xl transition-colors duration-300 ${isDark ? 'bg-gray-900 shadow-black' : 'bg-gray-50 shadow-gray-200'}`}>
          
          {/* Main Scrollable Content */}
          <main className="h-full min-h-screen px-6 pt-8 overflow-y-auto scrollbar-hide">
            {renderContent()}
          </main>

          {/* Bottom Navigation */}
          <nav className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t px-6 py-3 pb-6 sm:pb-3 flex justify-between items-center z-40 rounded-t-3xl transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700 shadow-none' : 'bg-white border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]'}`}>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-violet-500' : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600')}`}
            >
              <Home size={24} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Home</span>
            </button>

            <button 
              onClick={() => setActiveTab('analytics')}
              className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'analytics' ? 'text-violet-500' : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600')}`}
            >
              <PieChart size={24} strokeWidth={activeTab === 'analytics' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Stats</span>
            </button>

            {/* Floating Add Button in Nav */}
            <div className="-mt-8">
              <button 
                onClick={openAddModal}
                className={`text-white p-4 rounded-full shadow-lg transition-all active:scale-95 ${isDark ? 'bg-violet-600 shadow-violet-900/50 hover:bg-violet-500' : 'bg-violet-600 shadow-violet-300 hover:bg-violet-700 hover:scale-105'}`}
              >
                <Plus size={28} strokeWidth={3} />
              </button>
            </div>

            <button 
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'history' ? 'text-violet-500' : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600')}`}
            >
              <List size={24} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">History</span>
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'settings' ? 'text-violet-500' : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600')}`}
            >
              <Settings size={24} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Settings</span>
            </button>
          </nav>

          {/* Transaction Modal */}
          <TransactionForm 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSaveTransaction}
            editingTransaction={editingTransaction}
            onDelete={handleDeleteTransaction}
            currency={currency}
          />

          {/* Clear Data Confirmation Modal */}
          <ConfirmationModal 
            isOpen={isClearModalOpen}
            onClose={() => setIsClearModalOpen(false)}
            onConfirm={confirmClearData}
            title="Clear All Data?"
            message="This action cannot be undone. All your transactions will be permanently deleted from this device."
            confirmText="Yes, Clear All"
            variant="danger"
          />

        </div>
        
        {/* Global Styles for Animations/Resets */}
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
          body {
            -webkit-tap-highlight-color: transparent;
            overscroll-behavior-y: none;
          }
        `}</style>
      </div>
    </ThemeContext.Provider>
  );
}