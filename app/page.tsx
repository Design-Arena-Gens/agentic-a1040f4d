"use client";

import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import TransactionList from "./components/TransactionList";
import BudgetManager from "./components/BudgetManager";
import GoalsTracker from "./components/GoalsTracker";
import Reports from "./components/Reports";
import RecurringTransactions from "./components/RecurringTransactions";
import DebtTracker from "./components/DebtTracker";
import { Transaction, Budget, Goal, RecurringTransaction, Debt } from "./types";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    const savedBudgets = localStorage.getItem("budgets");
    const savedGoals = localStorage.getItem("goals");
    const savedRecurring = localStorage.getItem("recurringTransactions");
    const savedDebts = localStorage.getItem("debts");

    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedRecurring) setRecurringTransactions(JSON.parse(savedRecurring));
    if (savedDebts) setDebts(JSON.parse(savedDebts));

    // Initialize with sample data if empty
    if (!savedTransactions) {
      const sampleTransactions: Transaction[] = [
        { id: "1", date: new Date().toISOString(), description: "Salary", amount: 5000, type: "income", category: "Salary" },
        { id: "2", date: new Date().toISOString(), description: "Groceries", amount: -150, type: "expense", category: "Food" },
        { id: "3", date: new Date().toISOString(), description: "Electric Bill", amount: -80, type: "expense", category: "Utilities" },
      ];
      setTransactions(sampleTransactions);
      localStorage.setItem("transactions", JSON.stringify(sampleTransactions));
    }

    if (!savedBudgets) {
      const sampleBudgets: Budget[] = [
        { id: "1", category: "Food", limit: 500, spent: 150, period: "monthly" },
        { id: "2", category: "Transportation", limit: 300, spent: 0, period: "monthly" },
        { id: "3", category: "Entertainment", limit: 200, spent: 0, period: "monthly" },
      ];
      setBudgets(sampleBudgets);
      localStorage.setItem("budgets", JSON.stringify(sampleBudgets));
    }

    if (!savedGoals) {
      const sampleGoals: Goal[] = [
        { id: "1", name: "Emergency Fund", targetAmount: 10000, currentAmount: 2500, deadline: "2025-12-31" },
        { id: "2", name: "Vacation", targetAmount: 3000, currentAmount: 500, deadline: "2025-06-30" },
      ];
      setGoals(sampleGoals);
      localStorage.setItem("goals", JSON.stringify(sampleGoals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("recurringTransactions", JSON.stringify(recurringTransactions));
  }, [recurringTransactions]);

  useEffect(() => {
    localStorage.setItem("debts", JSON.stringify(debts));
  }, [debts]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = { ...transaction, id: Date.now().toString() };
    setTransactions([newTransaction, ...transactions]);

    // Update budget spent amount
    if (transaction.type === "expense") {
      setBudgets(budgets.map(budget =>
        budget.category === transaction.category
          ? { ...budget, spent: budget.spent + Math.abs(transaction.amount) }
          : budget
      ));
    }
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    setTransactions(transactions.filter(t => t.id !== id));

    // Update budget spent amount
    if (transaction && transaction.type === "expense") {
      setBudgets(budgets.map(budget =>
        budget.category === transaction.category
          ? { ...budget, spent: Math.max(0, budget.spent - Math.abs(transaction.amount)) }
          : budget
      ));
    }
  };

  const addBudget = (budget: Omit<Budget, "id" | "spent">) => {
    const newBudget = { ...budget, id: Date.now().toString(), spent: 0 };
    setBudgets([...budgets, newBudget]);
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(budgets.map(budget =>
      budget.id === id ? { ...budget, ...updates } : budget
    ));
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  const addGoal = (goal: Omit<Goal, "id">) => {
    const newGoal = { ...goal, id: Date.now().toString() };
    setGoals([...goals, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const addRecurringTransaction = (recurring: Omit<RecurringTransaction, "id">) => {
    const newRecurring = { ...recurring, id: Date.now().toString() };
    setRecurringTransactions([...recurringTransactions, newRecurring]);
  };

  const deleteRecurringTransaction = (id: string) => {
    setRecurringTransactions(recurringTransactions.filter(r => r.id !== id));
  };

  const addDebt = (debt: Omit<Debt, "id">) => {
    const newDebt = { ...debt, id: Date.now().toString() };
    setDebts([...debts, newDebt]);
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(debts.map(debt =>
      debt.id === id ? { ...debt, ...updates } : debt
    ));
  };

  const deleteDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">💰 Budget Master</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: "📊" },
              { id: "transactions", label: "Transactions", icon: "💳" },
              { id: "budgets", label: "Budgets", icon: "📈" },
              { id: "goals", label: "Goals", icon: "🎯" },
              { id: "recurring", label: "Recurring", icon: "🔄" },
              { id: "debts", label: "Debts", icon: "💰" },
              { id: "reports", label: "Reports", icon: "📑" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === "dashboard" && (
            <Dashboard
              transactions={transactions}
              budgets={budgets}
              goals={goals}
              debts={debts}
            />
          )}
          {activeTab === "transactions" && (
            <TransactionList
              transactions={transactions}
              onAddTransaction={addTransaction}
              onDeleteTransaction={deleteTransaction}
            />
          )}
          {activeTab === "budgets" && (
            <BudgetManager
              budgets={budgets}
              onAddBudget={addBudget}
              onUpdateBudget={updateBudget}
              onDeleteBudget={deleteBudget}
            />
          )}
          {activeTab === "goals" && (
            <GoalsTracker
              goals={goals}
              onAddGoal={addGoal}
              onUpdateGoal={updateGoal}
              onDeleteGoal={deleteGoal}
            />
          )}
          {activeTab === "recurring" && (
            <RecurringTransactions
              recurringTransactions={recurringTransactions}
              onAddRecurring={addRecurringTransaction}
              onDeleteRecurring={deleteRecurringTransaction}
            />
          )}
          {activeTab === "debts" && (
            <DebtTracker
              debts={debts}
              onAddDebt={addDebt}
              onUpdateDebt={updateDebt}
              onDeleteDebt={deleteDebt}
            />
          )}
          {activeTab === "reports" && (
            <Reports transactions={transactions} budgets={budgets} />
          )}
        </div>
      </div>
    </div>
  );
}
