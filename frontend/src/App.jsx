import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Trash2, DollarSign, PieChart, Calendar, AlertCircle, Search, TrendingDown, Tag } from 'lucide-react';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [error, setError] = useState('');

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(response.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/expenses', formData);
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      setError('');
      fetchExpenses();
    } catch (err) {
      setError('Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const totalAmount = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  // Filter expenses based on search and category
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Food': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Bills': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Transport': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shopping': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-lg py-5 px-8 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 p-2.5 rounded-xl shadow-md text-white">
              <PieChart size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Expense Tracker Dashboard</h1>
              <p className="text-xs text-slate-400">Full-Stack MERN Application | NIST University Project</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-700/50 border border-slate-600 px-4 py-2 rounded-full text-sm font-medium text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Database Connected
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-16">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700 p-6 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Spending</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">₹{totalAmount.toFixed(2)}</h3>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-400">
              <DollarSign size={28} />
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur border border-slate-700 p-6 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Transactions</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{expenses.length}</h3>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400">
              <Calendar size={28} />
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur border border-slate-700 p-6 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Categories</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {new Set(expenses.map(e => e.category)).size}
              </h3>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl text-purple-400">
              <Tag size={28} />
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Expense Form */}
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl lg:col-span-1 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <PlusCircle size={20} className="text-indigo-400" /> Add Expense
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Grocery, Fuel, Dinner"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Amount (₹) *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g. 750"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="Food">Food & Drinks</option>
                  <option value="Bills">Bills & Utilities</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-indigo-600 hover:to-violet-700 transition"
              >
                Save Expense
              </button>
            </form>
          </div>

          {/* Expense History List */}
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-lg font-bold text-white">Expense Records</h2>

              {/* Search & Filter Controls */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-48"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Food">Food</option>
                  <option value="Bills">Bills</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {filteredExpenses.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-700 rounded-2xl">
                <TrendingDown className="mx-auto text-slate-600 mb-3" size={40} />
                <p className="text-slate-400 text-sm font-medium">No expenses found.</p>
                <p className="text-slate-500 text-xs mt-1">Add your first expense using the form on the left!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4 font-semibold">Title</th>
                      <th className="py-3 px-4 font-semibold">Category</th>
                      <th className="py-3 px-4 font-semibold">Date</th>
                      <th className="py-3 px-4 font-semibold">Amount</th>
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50 text-sm">
                    {filteredExpenses.map((expense) => (
                      <tr key={expense._id} className="hover:bg-slate-700/30 transition">
                        <td className="py-3.5 px-4 font-medium text-white">{expense.title}</td>
                        <td className="py-3.5 px-4">
                          <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getCategoryColor(expense.category)}`}>
                            {expense.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-400">₹{expense.amount}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDelete(expense._id)}
                            className="text-rose-400 hover:text-rose-300 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;