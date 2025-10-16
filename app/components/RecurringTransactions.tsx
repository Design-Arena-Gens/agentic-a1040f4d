import { useState } from "react";
import { RecurringTransaction } from "../types";
import { format } from "date-fns";

interface RecurringTransactionsProps {
  recurringTransactions: RecurringTransaction[];
  onAddRecurring: (recurring: Omit<RecurringTransaction, "id">) => void;
  onDeleteRecurring: (id: string) => void;
}

const categories = [
  "Salary", "Freelance", "Investment", "Other Income",
  "Food", "Transportation", "Housing", "Utilities",
  "Entertainment", "Healthcare", "Shopping", "Education",
  "Insurance", "Debt Payment", "Savings", "Subscription", "Other"
];

export default function RecurringTransactions({
  recurringTransactions,
  onAddRecurring,
  onDeleteRecurring
}: RecurringTransactionsProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense" as "income" | "expense",
    category: "Subscription",
    frequency: "monthly" as "daily" | "weekly" | "monthly" | "yearly",
    nextDate: format(new Date(), "yyyy-MM-dd"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) return;

    onAddRecurring({
      description: formData.description,
      amount: formData.type === "expense" ? -amount : amount,
      type: formData.type,
      category: formData.category,
      frequency: formData.frequency,
      nextDate: new Date(formData.nextDate).toISOString(),
    });

    setFormData({
      description: "",
      amount: "",
      type: "expense",
      category: "Subscription",
      frequency: "monthly",
      nextDate: format(new Date(), "yyyy-MM-dd"),
    });
    setShowForm(false);
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      yearly: "Yearly",
    };
    return labels[frequency] || frequency;
  };

  const getAnnualCost = (amount: number, frequency: string) => {
    const multipliers: Record<string, number> = {
      daily: 365,
      weekly: 52,
      monthly: 12,
      yearly: 1,
    };
    return Math.abs(amount) * (multipliers[frequency] || 1);
  };

  const totalMonthlyExpenses = recurringTransactions
    .filter(r => r.type === "expense")
    .reduce((sum, r) => {
      const multipliers: Record<string, number> = {
        daily: 30,
        weekly: 4.33,
        monthly: 1,
        yearly: 1 / 12,
      };
      return sum + Math.abs(r.amount) * (multipliers[r.frequency] || 1);
    }, 0);

  const totalMonthlyIncome = recurringTransactions
    .filter(r => r.type === "income")
    .reduce((sum, r) => {
      const multipliers: Record<string, number> = {
        daily: 30,
        weekly: 4.33,
        monthly: 1,
        yearly: 1 / 12,
      };
      return sum + Math.abs(r.amount) * (multipliers[r.frequency] || 1);
    }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Recurring Transactions</h2>
          <p className="text-sm text-gray-600 mt-1">Manage subscriptions, bills, and regular income</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          {showForm ? "Cancel" : "+ Add Recurring"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Netflix Subscription"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "income" | "expense" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Next Payment Date</label>
            <input
              type="date"
              value={formData.nextDate}
              onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Add Recurring Transaction
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-700 font-medium">Monthly Expenses</p>
          <p className="text-2xl font-bold text-red-700 mt-1">${totalMonthlyExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-700 font-medium">Monthly Income</p>
          <p className="text-2xl font-bold text-green-700 mt-1">${totalMonthlyIncome.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">Net Monthly</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">${(totalMonthlyIncome - totalMonthlyExpenses).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recurringTransactions.length > 0 ? (
          recurringTransactions.map((recurring) => {
            const annualCost = getAnnualCost(recurring.amount, recurring.frequency);
            const nextDate = new Date(recurring.nextDate);
            const today = new Date();
            const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={recurring.id}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{recurring.description}</h3>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        recurring.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {recurring.type}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {recurring.category}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {getFrequencyLabel(recurring.frequency)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteRecurring(recurring.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount per {recurring.frequency.slice(0, -2)}</span>
                    <span className={`text-xl font-bold ${recurring.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      ${Math.abs(recurring.amount).toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Annual cost:</span>
                      <span className="font-semibold text-gray-800">${annualCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Next payment:</span>
                      <span className="font-semibold text-gray-800">{format(nextDate, "MMM dd, yyyy")}</span>
                    </div>
                    {daysUntil >= 0 && daysUntil <= 7 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mt-2">
                        <p className="text-xs text-yellow-700 font-medium">
                          ⚠️ Due in {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="text-lg">No recurring transactions</p>
            <p className="text-sm mt-2">Add subscriptions, bills, and regular income to track them easily!</p>
          </div>
        )}
      </div>
    </div>
  );
}
