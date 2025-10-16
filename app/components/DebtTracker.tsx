import { useState } from "react";
import { Debt } from "../types";
import { format } from "date-fns";

interface DebtTrackerProps {
  debts: Debt[];
  onAddDebt: (debt: Omit<Debt, "id">) => void;
  onUpdateDebt: (id: string, updates: Partial<Debt>) => void;
  onDeleteDebt: (id: string) => void;
}

export default function DebtTracker({ debts, onAddDebt, onUpdateDebt, onDeleteDebt }: DebtTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    totalAmount: "",
    remainingAmount: "",
    interestRate: "",
    minimumPayment: "",
    dueDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = parseFloat(formData.totalAmount);
    const remainingAmount = parseFloat(formData.remainingAmount);
    const interestRate = parseFloat(formData.interestRate);
    const minimumPayment = parseFloat(formData.minimumPayment);

    if (isNaN(totalAmount) || totalAmount <= 0) return;
    if (isNaN(remainingAmount) || remainingAmount < 0) return;
    if (isNaN(interestRate) || interestRate < 0) return;
    if (isNaN(minimumPayment) || minimumPayment <= 0) return;

    onAddDebt({
      name: formData.name,
      totalAmount,
      remainingAmount,
      interestRate,
      minimumPayment,
      dueDate: formData.dueDate,
    });

    setFormData({
      name: "",
      totalAmount: "",
      remainingAmount: "",
      interestRate: "",
      minimumPayment: "",
      dueDate: "",
    });
    setShowForm(false);
  };

  const handleMakePayment = (id: string, currentRemaining: number) => {
    const amount = prompt("Enter payment amount:");
    if (amount) {
      const paymentAmount = parseFloat(amount);
      if (!isNaN(paymentAmount) && paymentAmount > 0 && paymentAmount <= currentRemaining) {
        onUpdateDebt(id, { remainingAmount: currentRemaining - paymentAmount });
      }
    }
  };

  const totalDebt = debts.reduce((sum, d) => sum + d.remainingAmount, 0);
  const totalOriginal = debts.reduce((sum, d) => sum + d.totalAmount, 0);
  const totalPaid = totalOriginal - totalDebt;
  const totalMinimumPayment = debts.reduce((sum, d) => sum + d.minimumPayment, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Debt Tracker</h2>
          <p className="text-sm text-gray-600 mt-1">Track and manage your debts effectively</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          {showForm ? "Cancel" : "+ Add Debt"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Debt Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Credit Card, Student Loan, Car Loan"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remaining Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.remainingAmount}
                onChange={(e) => setFormData({ ...formData, remainingAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Payment ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.minimumPayment}
                onChange={(e) => setFormData({ ...formData, minimumPayment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Add Debt
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-700 font-medium">Total Debt</p>
          <p className="text-2xl font-bold text-red-700 mt-1">${totalDebt.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-700 font-medium">Total Paid</p>
          <p className="text-2xl font-bold text-green-700 mt-1">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-700 font-medium">Monthly Minimum</p>
          <p className="text-2xl font-bold text-orange-700 mt-1">${totalMinimumPayment.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">Accounts</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{debts.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {debts.length > 0 ? (
          debts.map((debt) => {
            const percentage = ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100;
            const monthlyInterest = (debt.remainingAmount * (debt.interestRate / 100)) / 12;
            const dueDate = new Date(debt.dueDate);
            const today = new Date();
            const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={debt.id}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{debt.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Interest Rate: {debt.interestRate}% APR
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteDebt(debt.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-600">Remaining</p>
                      <p className="text-2xl font-bold text-red-600">${debt.remainingAmount.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Original</p>
                      <p className="text-lg font-semibold text-gray-800">${debt.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Paid Off</span>
                      <span className="text-sm font-bold text-green-600">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Minimum Payment:</span>
                      <span className="font-semibold text-gray-800">${debt.minimumPayment.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Monthly Interest:</span>
                      <span className="font-semibold text-red-600">${monthlyInterest.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Next Due:</span>
                      <span className="font-semibold text-gray-800">{format(dueDate, "MMM dd, yyyy")}</span>
                    </div>
                  </div>

                  {daysUntil >= 0 && daysUntil <= 7 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-yellow-700 font-medium">
                        ⚠️ Payment due in {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleMakePayment(debt.id, debt.remainingAmount)}
                    className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Make Payment
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="text-lg">No debts tracked</p>
            <p className="text-sm mt-2">Add debts to track your progress toward financial freedom!</p>
          </div>
        )}
      </div>
    </div>
  );
}
