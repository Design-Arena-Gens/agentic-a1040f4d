import { useState } from "react";
import { Goal } from "../types";
import { format } from "date-fns";

interface GoalsTrackerProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, "id">) => void;
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (id: string) => void;
}

export default function GoalsTracker({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }: GoalsTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAmount = parseFloat(formData.targetAmount);
    const currentAmount = parseFloat(formData.currentAmount);

    if (isNaN(targetAmount) || targetAmount <= 0) return;
    if (isNaN(currentAmount) || currentAmount < 0) return;

    onAddGoal({
      name: formData.name,
      targetAmount,
      currentAmount,
      deadline: formData.deadline,
    });

    setFormData({
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
    });
    setShowForm(false);
  };

  const handleAddFunds = (id: string, currentAmount: number) => {
    const amount = prompt("Enter amount to add:");
    if (amount) {
      const addAmount = parseFloat(amount);
      if (!isNaN(addAmount) && addAmount > 0) {
        onUpdateGoal(id, { currentAmount: currentAmount + addAmount });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Financial Goals</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          {showForm ? "Cancel" : "+ Add Goal"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Emergency Fund, Vacation, New Car"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Add Goal
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.length > 0 ? (
          goals.map((goal) => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
            const remaining = goal.targetAmount - goal.currentAmount;
            const isCompleted = percentage >= 100;
            const deadline = new Date(goal.deadline);
            const today = new Date();
            const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={goal.id}
                className={`bg-white border-2 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${
                  isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{goal.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Target by {format(deadline, "MMM dd, yyyy")}
                    </p>
                    {daysRemaining > 0 && !isCompleted && (
                      <p className={`text-xs mt-1 ${daysRemaining < 30 ? 'text-red-600' : 'text-gray-600'}`}>
                        {daysRemaining} days remaining
                      </p>
                    )}
                    {daysRemaining < 0 && !isCompleted && (
                      <p className="text-xs mt-1 text-red-600 font-semibold">
                        ⚠️ Overdue by {Math.abs(daysRemaining)} days
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-600">Current</p>
                      <p className="text-2xl font-bold text-primary-600">${goal.currentAmount.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Target</p>
                      <p className="text-2xl font-bold text-gray-800">${goal.targetAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Progress</span>
                      <span className={`text-sm font-bold ${isCompleted ? 'text-green-600' : 'text-primary-600'}`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-green-500' : 'bg-primary-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {!isCompleted && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Remaining: <span className="font-semibold text-gray-800">${remaining.toFixed(2)}</span>
                      </p>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
                      <p className="text-green-700 font-semibold">🎉 Goal Achieved!</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleAddFunds(goal.id, goal.currentAmount)}
                      className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                    >
                      + Add Funds
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="text-lg">No goals set</p>
            <p className="text-sm mt-2">Create your first financial goal to start saving!</p>
          </div>
        )}
      </div>
    </div>
  );
}
